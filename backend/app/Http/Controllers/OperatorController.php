<?php

namespace App\Http\Controllers;

use App\Models\Pendaftaran;
use App\Models\Seleksi;
use Illuminate\Http\Request;

class OperatorController extends Controller
{
    /**
     * O4: Hanya tampilkan pendaftar dengan status draft, menunggu, perbaikan.
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
     * Buat record seleksi dengan hasil_status = belum_diproses.
     */
    public function setValid(Request $request, $id)
    {
        $pendaftaran = Pendaftaran::findOrFail($id);
        $pendaftaran->update(['status' => 'terverifikasi']);

        // R3: Inisialisasi record seleksi dengan status belum_diproses
        Seleksi::firstOrCreate(
            ['pendaftaran_id' => $id],
            ['hasil_status' => 'belum_diproses']
        );

        return response()->json(['message' => 'Pendaftar berhasil diverifikasi dan dipindahkan ke Seleksi SAW']);
    }

    /**
     * O2: Tombol "Kirim Perbaikan" → ubah status menjadi perbaikan.
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

    /**
     * R3: Hasil seleksi — tampilkan semua status (belum_diproses, sudah_saw, diterima, ditolak).
     * Mencakup status terverifikasi (belum diputuskan) DAN diterima/ditolak (sudah diputuskan),
     * supaya data tidak hilang dari daftar setelah keputusan final ditetapkan.
     */
    public function hasilSeleksi(Request $request)
    {
        $query = Pendaftaran::with(['dataDiri', 'jalur', 'seleksi'])
                            ->whereIn('status', ['terverifikasi', 'diterima', 'ditolak'])
                            ->whereHas('seleksi');

        if ($request->hasil_status) {
            $query->whereHas('seleksi', function ($q) use ($request) {
                $q->where('hasil_status', $request->hasil_status);
            });
        }

        if ($request->jalur_id) {
            $query->where('jalur_id', $request->jalur_id);
        }

        $hasil = $query->get()->map(function ($p) {
            return [
                'pendaftaran_id' => $p->id,
                'nama'           => $p->dataDiri->nama_lengkap ?? '-',
                'nisn'           => $p->dataDiri->nisn ?? '-',
                'data_diri'      => $p->dataDiri,
                'jalur'          => $p->jalur,
                'hasil_status'   => $p->seleksi?->hasil_status ?? 'belum_diproses',
                'status_lulus'   => $p->seleksi?->status_lulus,
                'skor_saw'       => $p->seleksi?->skor_saw,
                'ranking'        => $p->seleksi?->ranking,
            ];
        });

        return response()->json(['hasil' => $hasil]);
    }

    /**
     * R3: Keputusan final hanya bisa diubah setelah hasil_status = sudah_saw.
     */
    public function updateHasil(Request $request, $id)
    {
        $request->validate([
            'status_lulus' => 'required|boolean',
        ]);

        $seleksi = Seleksi::where('pendaftaran_id', $id)->firstOrFail();

        // R3: Guard — hanya bisa update setelah SAW dijalankan
        if ($seleksi->hasil_status !== 'sudah_saw') {
            return response()->json([
                'message' => 'Keputusan final hanya bisa ditetapkan setelah ranking SAW dihitung.',
            ], 422);
        }

        $hasilBaru = $request->status_lulus ? 'diterima' : 'ditolak';

        $seleksi->update([
            'status_lulus' => $request->status_lulus,
            'hasil_status' => $hasilBaru,
        ]);

        $seleksi->pendaftaran->update([
            'status' => $hasilBaru,
        ]);

        return response()->json(['message' => 'Hasil seleksi berhasil diupdate']);
    }
}
