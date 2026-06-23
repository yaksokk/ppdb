<?php

namespace App\Http\Controllers;

use App\Models\Pendaftaran;
use App\Models\Seleksi;
use App\Models\NilaiKriteria;
use App\Models\Kriteria;
use Illuminate\Http\Request;

class OperatorController extends Controller
{
    /**
     * O4: Hanya tampilkan pendaftar dengan status draft, menunggu, perbaikan.
     * Terverifikasi sudah dipindah ke menu Seleksi SAW.
     */
    public function listPendaftar(Request $request)
    {
        $query = Pendaftaran::with(['dataDiri', 'jalur', 'dokumen', 'seleksi'])
            ->whereIn('status', ['draft', 'menunggu', 'perbaikan']);

        if ($request->search) {
            $query->whereHas('dataDiri', function ($q) use ($request) {
                $q->where('nama_lengkap', 'like', '%' . $request->search . '%')
                  ->orWhere('nisn', 'like', '%' . $request->search . '%');
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
     * O2: Tombol "Valid" → ubah status menjadi terverifikasi.
     * Data otomatis pindah ke menu Seleksi SAW.
     */
    public function setValid(Request $request, $id)
    {
        $pendaftaran = Pendaftaran::findOrFail($id);
        $pendaftaran->update(['status' => 'terverifikasi']);

        return response()->json(['message' => 'Pendaftar berhasil diverifikasi dan dipindahkan ke Seleksi SAW']);
    }

    /**
     * O2: Tombol "Kirim Perbaikan" → ubah status menjadi perbaikan.
     * Pendaftar dapat re-upload dokumen.
     */
    public function kirimPerbaikan(Request $request, $id)
    {
        $pendaftaran = Pendaftaran::findOrFail($id);
        $pendaftaran->update(['status' => 'perbaikan']);

        return response()->json(['message' => 'Status berhasil diubah menjadi perbaikan']);
    }

    /**
     * O3: Daftar pendaftar dengan status terverifikasi untuk menu Seleksi SAW.
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

    public function inputNilai(Request $request, $pendaftaranId)
    {
        $request->validate([
            'nilai'                => 'required|array',
            'nilai.*.kriteria_id'  => 'required|exists:kriteria,id',
            'nilai.*.nilai'        => 'required|numeric|min:0|max:100',
        ]);

        foreach ($request->nilai as $item) {
            NilaiKriteria::updateOrCreate(
                [
                    'pendaftaran_id' => $pendaftaranId,
                    'kriteria_id'    => $item['kriteria_id'],
                ],
                ['nilai' => $item['nilai']]
            );
        }

        return response()->json(['message' => 'Nilai berhasil disimpan']);
    }

    public function hasilSeleksi(Request $request)
    {
        $query = Pendaftaran::with(['dataDiri', 'jalur', 'dokumen', 'seleksi'])
                            ->whereIn('status', ['diterima', 'ditolak']);

        if ($request->status) {
            $statusLulus = $request->status === 'diterima' ? true : false;
            $query->whereHas('seleksi', function ($q) use ($statusLulus) {
                $q->where('status_lulus', $statusLulus);
            });
        }

        $hasil = $query->get()->map(function ($p) {
            return [
                'pendaftaran_id' => $p->id,
                'nama'           => $p->dataDiri->nama_lengkap ?? '-',
                'nisn'           => $p->dataDiri->nisn ?? '-',
                'data_diri'      => $p->dataDiri,
                'jalur'          => $p->jalur,
                'status_lulus'   => $p->seleksi?->status_lulus,
                'skor_saw'       => $p->seleksi?->skor_saw,
                'ranking'        => $p->seleksi?->ranking,
            ];
        });

        return response()->json(['hasil' => $hasil]);
    }

    public function updateHasil(Request $request, $id)
    {
        $request->validate([
            'status_lulus' => 'required|boolean',
        ]);

        $seleksi = Seleksi::where('pendaftaran_id', $id)->firstOrFail();
        $seleksi->update(['status_lulus' => $request->status_lulus]);

        $pendaftaran = $seleksi->pendaftaran;
        $pendaftaran->update([
            'status' => $request->status_lulus ? 'diterima' : 'ditolak',
        ]);

        return response()->json(['message' => 'Hasil seleksi berhasil diupdate']);
    }
}
