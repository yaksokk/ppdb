<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Pendaftaran;
use App\Models\Dokumen;
use App\Models\Setting;
use App\Models\LogAktivitas;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AdminController extends Controller
{
    public function dashboard(Request $request)
    {
        $total      = Pendaftaran::count();
        $diterima   = Pendaftaran::where('status', 'diterima')->count();
        $menunggu   = Pendaftaran::where('status', 'menunggu')->count();
        $ditolak    = Pendaftaran::where('status', 'ditolak')->count();
        $operator   = User::role('operator')->count();

        $perJalur = Pendaftaran::with('jalur')
            ->selectRaw('jalur_id, count(*) as total')
            ->groupBy('jalur_id')
            ->get()
            ->map(fn($p) => [
                'jalur' => $p->jalur->nama ?? '-',
                'total' => $p->total,
            ]);

        $statusVerifikasi = [
            ['name' => 'Terverifikasi',   'value' => $diterima],
            ['name' => 'Belum Periksa',   'value' => $menunggu],
            ['name' => 'Perlu Perbaikan', 'value' => Pendaftaran::where('status', 'perbaikan')->count()],
        ];

        return response()->json([
            'total'            => $total,
            'diterima'         => $diterima,
            'menunggu'         => $menunggu,
            'ditolak'          => $ditolak,
            'operator'         => $operator,
            'per_jalur'        => $perJalur,
            'status_verifikasi'=> $statusVerifikasi,
        ]);
    }

    public function listPendaftar(Request $request)
    {
        $query = Pendaftaran::with(['dataDiri', 'jalur', 'dokumen']);

        if ($request->search) {
            $query->whereHas('dataDiri', function ($q) use ($request) {
                $q->where('nama_lengkap', 'like', '%' . $request->search . '%');
            })->orWhere('no_pendaftaran', 'like', '%' . $request->search . '%');
        }

        if ($request->status) {
            $query->where('status', $request->status);
        }

        if ($request->jalur_id) {
            $query->where('jalur_id', $request->jalur_id);
        }

        $pendaftar = $query->paginate(10);

        return response()->json($pendaftar);
    }

    public function detailPendaftar($id)
    {
        $pendaftaran = Pendaftaran::with([
            'dataDiri', 'dataOrangTua', 'jalur', 'dokumen', 'seleksi'
        ])->findOrFail($id);

        return response()->json(['pendaftaran' => $pendaftaran]);
    }

    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:draft,menunggu,perbaikan,diterima,ditolak',
        ]);

        $pendaftaran = Pendaftaran::findOrFail($id);
        $pendaftaran->update(['status' => $request->status]);

        $this->log($request, 'update_status', 'pendaftaran', $id, 'Update status pendaftaran ke ' . $request->status);

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
