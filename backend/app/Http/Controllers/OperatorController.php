<?php

namespace App\Http\Controllers;

use App\Models\Pendaftaran;
use App\Models\Seleksi;
use App\Models\NilaiKriteria;
use App\Models\Kriteria;
use Illuminate\Http\Request;

class OperatorController extends Controller
{
    public function listPendaftar(Request $request)
    {
        $query = Pendaftaran::with(['dataDiri', 'jalur', 'dokumen']);

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
            'dataDiri', 'dataOrangTua', 'jalur', 'dokumen', 'seleksi', 'nilaiKriteria.kriteria'
        ])->findOrFail($id);

        return response()->json(['pendaftaran' => $pendaftaran]);
    }

    public function inputNilai(Request $request, $pendaftaranId)
    {
        $request->validate([
            'nilai' => 'required|array',
            'nilai.*.kriteria_id' => 'required|exists:kriteria,id',
            'nilai.*.nilai'       => 'required|numeric|min:0|max:100',
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
        $query = Pendaftaran::with(['dataDiri', 'jalur', 'seleksi'])
                            ->whereHas('seleksi');

        if ($request->jalur_id) {
            $query->where('jalur_id', $request->jalur_id);
        }

        if ($request->status) {
            $statusLulus = $request->status === 'diterima' ? true : false;
            $query->whereHas('seleksi', function ($q) use ($statusLulus) {
                $q->where('status_lulus', $statusLulus);
            });
        }

        $hasil = $query->get()->sortBy(function ($p) {
            return $p->seleksi->ranking ?? 999;
        })->values();

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
            'status' => $request->status_lulus ? 'diterima' : 'ditolak'
        ]);

        return response()->json(['message' => 'Hasil seleksi berhasil diupdate']);
    }
}
