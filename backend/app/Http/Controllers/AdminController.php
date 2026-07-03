<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Pendaftaran;
use App\Models\Dokumen;
use App\Models\Setting;
use App\Models\LogAktivitas;
use App\Models\Seleksi;
use App\Models\JalurMasuk;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AdminController extends Controller
{
    public function dashboard(Request $request)
    {
        $total        = Pendaftaran::count();
        $diterima     = Pendaftaran::where('status', 'diterima')->count();
        $menunggu     = Pendaftaran::where('status', 'menunggu')->count();
        $perbaikan    = Pendaftaran::where('status', 'perbaikan')->count();
        $ditolak      = Pendaftaran::where('status', 'ditolak')->count();
        $terverifikasi = Pendaftaran::where('status', 'terverifikasi')->count();
        $operator     = User::role('operator')->count();

        $perJalur = Pendaftaran::with('jalur')
            ->selectRaw('jalur_id, count(*) as total')
            ->groupBy('jalur_id')
            ->get()
            ->map(fn($p) => [
                'jalur' => $p->jalur->nama ?? '-',
                'total' => $p->total,
            ]);

        $statusVerifikasi = [
            ['name' => 'Terverifikasi',   'value' => $terverifikasi],
            ['name' => 'Belum Periksa',   'value' => $menunggu],
            ['name' => 'Perlu Perbaikan', 'value' => $perbaikan],
        ];

        return response()->json([
            'total'             => $total,
            'diterima'          => $diterima,
            'menunggu'          => $menunggu,
            'perbaikan'         => $perbaikan,
            'ditolak'           => $ditolak,
            'terverifikasi'     => $terverifikasi,
            'operator'          => $operator,
            'per_jalur'         => $perJalur,
            'status_verifikasi' => $statusVerifikasi,
        ]);
    }

    /**
     * A1: Sinkronisasi dengan O4 — hanya tampilkan draft, menunggu, perbaikan.
     */
    public function listPendaftar(Request $request)
    {
        $query = Pendaftaran::with(['dataDiri', 'jalur', 'dokumen', 'seleksi'])
            ->whereIn('status', ['draft', 'menunggu', 'perbaikan']);

        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->whereHas('dataDiri', function ($sq) use ($request) {
                    $sq->where('nama_lengkap', 'like', '%' . $request->search . '%');
                })->orWhere('no_pendaftaran', 'like', '%' . $request->search . '%');
            });
        }

        if ($request->status) {
            $query->where('status', $request->status);
        }

        if ($request->jalur_id) {
            $query->where('jalur_id', $request->jalur_id);
        }

        return response()->json($query->paginate(10));
    }

    public function detailPendaftar($id)
    {
        $pendaftaran = Pendaftaran::with([
            'dataDiri', 'dataOrangTua', 'jalur', 'dokumen',
            'seleksi', 'nilaiKriteria.kriteria', 'nilaiRapor',
        ])->findOrFail($id);

        return response()->json(['pendaftaran' => $pendaftaran]);
    }

    /**
     * A1: Daftar terverifikasi (read-only untuk admin).
     */
    public function listSeleksiSaw(Request $request)
    {
        $query = Pendaftaran::with(['dataDiri', 'jalur', 'dokumen', 'seleksi'])
            ->where('status', 'terverifikasi');

        if ($request->search) {
            $query->whereHas('dataDiri', function ($q) use ($request) {
                $q->where('nama_lengkap', 'like', '%' . $request->search . '%')
                  ->orWhere('nisn', 'like', '%' . $request->search . '%');
            });
        }

        if ($request->jalur_id) {
            $query->where('jalur_id', $request->jalur_id);
        }

        return response()->json($query->paginate(10));
    }

    /**
     * R3: Keputusan final (diterima/ditolak) hanya boleh dilakukan setelah
     * hasil_status = sudah_saw. Status non-final (draft/menunggu/perbaikan/
     * terverifikasi) tetap bisa diubah bebas seperti sebelumnya.
     * Saat keputusan final ditetapkan, hasil_status ikut disinkronkan
     * supaya konsisten dengan data yang dibaca di Hasil Seleksi (operator).
     */
    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:draft,menunggu,perbaikan,terverifikasi,diterima,ditolak',
        ]);

        $pendaftaran = Pendaftaran::findOrFail($id);
        $isKeputusanFinal = in_array($request->status, ['diterima', 'ditolak']);

        if ($isKeputusanFinal) {
            $seleksi = Seleksi::where('pendaftaran_id', $id)->first();

            // R3: Guard — keputusan final hanya bisa ditetapkan setelah SAW dihitung
            if (!$seleksi || $seleksi->hasil_status !== 'sudah_saw') {
                return response()->json([
                    'message' => 'Keputusan final hanya bisa ditetapkan setelah ranking SAW dihitung.',
                ], 422);
            }

            $hasilBaru = $request->status; // 'diterima' atau 'ditolak'

            $seleksi->update([
                'status_lulus' => $hasilBaru === 'diterima',
                'hasil_status' => $hasilBaru,
                'input_by'     => $request->user()->id,
            ]);
        }

        $pendaftaran->update(['status' => $request->status]);

        $this->log($request, 'update_status', 'pendaftaran', $id, 'Update status ke ' . $request->status);

        return response()->json(['message' => 'Status berhasil diupdate']);
    }

    public function verifikasiDokumen(Request $request, $id)
    {
        $request->validate([
            'status'  => 'required|in:valid,perbaikan',
            'catatan' => 'nullable|string',
        ]);

        $dokumen = Dokumen::findOrFail($id);
        $dokumen->update([
            'status'      => $request->status,
            'catatan'     => $request->catatan,
            'verified_by' => $request->user()->id,
            'verified_at' => now(),
        ]);

        $this->log($request, 'verifikasi_dokumen', 'dokumen', $id, 'Verifikasi dokumen: ' . $request->status);

        return response()->json(['message' => 'Dokumen berhasil diverifikasi']);
    }

    /**
     * A2: Kelola kuota per jalur.
     */
    public function getKuota()
    {
        $keys = [
            'kuota_total', 'kuota_persen_zonasi',
            'kuota_persen_prestasi', 'kuota_persen_afirmasi',
            'kuota_persen_mutasi',
        ];
        $settings = Setting::whereIn('key', $keys)->get()->pluck('value', 'key');
        $jalur    = JalurMasuk::all(['id', 'kode', 'nama', 'kuota']);

        return response()->json([
            'settings' => $settings,
            'jalur'    => $jalur,
        ]);
    }

    public function updateKuota(Request $request)
    {
        $request->validate([
            'kuota_total'           => 'required|integer|min:1',
            'kuota_persen_zonasi'   => 'required|numeric|min:0|max:100',
            'kuota_persen_prestasi' => 'required|numeric|min:0|max:100',
            'kuota_persen_afirmasi' => 'required|numeric|min:0|max:100',
            'kuota_persen_mutasi'   => 'required|numeric|min:0|max:100',
        ]);

        $totalPersen = (float) $request->kuota_persen_zonasi
                     + (float) $request->kuota_persen_prestasi
                     + (float) $request->kuota_persen_afirmasi
                     + (float) $request->kuota_persen_mutasi;

        if (abs($totalPersen - 100) > 0.01) {
            return response()->json(['message' => 'Total persentase harus 100%'], 422);
        }

        $kuotaTotal = (int) $request->kuota_total;
        $userId     = $request->user()->id;

        $settingKeys = [
            'kuota_total'           => $kuotaTotal,
            'kuota_persen_zonasi'   => $request->kuota_persen_zonasi,
            'kuota_persen_prestasi' => $request->kuota_persen_prestasi,
            'kuota_persen_afirmasi' => $request->kuota_persen_afirmasi,
            'kuota_persen_mutasi'   => $request->kuota_persen_mutasi,
        ];

        foreach ($settingKeys as $key => $value) {
            Setting::updateOrCreate(
                ['key' => $key],
                ['value' => $value, 'updated_by' => $userId]
            );
        }

        // Auto-update kuota di tabel jalur_masuk
        $jalurMap = [
            'zonasi'   => (int) round($kuotaTotal * $request->kuota_persen_zonasi   / 100),
            'prestasi' => (int) round($kuotaTotal * $request->kuota_persen_prestasi / 100),
            'afirmasi' => (int) round($kuotaTotal * $request->kuota_persen_afirmasi / 100),
            'mutasi'   => (int) round($kuotaTotal * $request->kuota_persen_mutasi   / 100),
        ];

        foreach ($jalurMap as $kode => $kuota) {
            JalurMasuk::where('kode', $kode)->update(['kuota' => $kuota]);
        }

        $this->log($request, 'update_kuota', 'setting', null, 'Update kuota total: ' . $kuotaTotal);

        return response()->json(['message' => 'Kuota berhasil diperbarui']);
    }

    public function listOperator()
    {
        $operators = User::role('operator')->get(['id', 'name', 'email', 'created_at']);
        return response()->json(['operators' => $operators]);
    }

    public function tambahOperator(Request $request)
    {
        $request->validate([
            'name'     => 'required|string',
            'email'    => 'required|email|unique:users',
            'password' => 'required|min:8',
        ]);

        $user = User::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'password' => Hash::make($request->password),
        ]);
        $user->assignRole('operator');

        return response()->json(['message' => 'Akun operator berhasil dibuat'], 201);
    }

    public function updateOperator(Request $request, $id)
    {
        $request->validate([
            'name'  => 'required|string',
            'email' => 'required|email|unique:users,email,' . $id,
        ]);

        $user = User::findOrFail($id);
        $data = ['name' => $request->name, 'email' => $request->email];

        if ($request->password) {
            $data['password'] = Hash::make($request->password);
        }

        $user->update($data);

        return response()->json(['message' => 'Akun operator berhasil diupdate']);
    }

    public function hapusOperator($id)
    {
        $user = User::findOrFail($id);
        $user->delete();
        return response()->json(['message' => 'Akun operator berhasil dihapus']);
    }

    public function getSetting()
    {
        $settings = Setting::all()->pluck('value', 'key');
        return response()->json(['settings' => $settings]);
    }

    public function updateSetting(Request $request)
    {
        foreach ($request->all() as $key => $value) {
            Setting::updateOrCreate(
                ['key' => $key],
                ['value' => $value, 'updated_by' => $request->user()->id]
            );
        }
        return response()->json(['message' => 'Setting berhasil diupdate']);
    }

    public function logAktivitas()
    {
        $logs = LogAktivitas::with('user')->latest()->paginate(20);
        return response()->json($logs);
    }

    public function listPendaftarAkun(Request $request)
    {
        $query = User::role('pendaftar')
            ->with('pendaftaran')
            ->select('id', 'name', 'email', 'is_active', 'created_at');

        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('email', 'like', '%' . $request->search . '%');
            });
        }

        return response()->json(['pendaftar' => $query->paginate(10)]);
    }

    public function toggleAktifPendaftar($id)
    {
        $user = User::findOrFail($id);
        $user->update(['is_active' => !$user->is_active]);

        return response()->json([
            'message'   => $user->is_active ? 'Akun berhasil diaktifkan' : 'Akun berhasil dinonaktifkan',
            'is_active' => $user->is_active,
        ]);
    }

    public function hapusPendaftarAkun($id)
    {
        $user = User::findOrFail($id);
        $user->delete();

        return response()->json(['message' => 'Akun pendaftar berhasil dihapus']);
    }

    private function log(Request $request, $aksi, $entity, $entityId, $deskripsi)
    {
        LogAktivitas::create([
            'user_id'    => $request->user()->id,
            'aksi'       => $aksi,
            'entity'     => $entity,
            'entity_id'  => $entityId,
            'deskripsi'  => $deskripsi,
            'ip_address' => $request->ip(),
        ]);
    }
}
