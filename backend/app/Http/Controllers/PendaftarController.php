<?php

namespace App\Http\Controllers;

use App\Models\Pendaftaran;
use App\Models\DataDiri;
use App\Models\DataOrangTua;
use App\Models\Dokumen;
use App\Models\JalurMasuk;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class PendaftarController extends Controller
{
    private function generateNoPendaftaran()
    {
        $tahun = date('Y');
        $count = Pendaftaran::whereYear('created_at', $tahun)->count() + 1;
        return 'PPDB-' . $tahun . '-' . str_pad($count, 3, '0', STR_PAD_LEFT);
    }

    public function submitFormulir(Request $request)
    {
        $request->validate([
            'jalur_id'       => 'required|exists:jalur_masuk,id',
            'nama_lengkap'   => 'required|string',
            'nisn'           => 'required|string',
            'jenis_kelamin'  => 'required|string',
            'tempat_lahir'   => 'required|string',
            'tgl_lahir'      => 'required|date',
            'agama'          => 'required|string',
            'asal_sekolah'   => 'required|string',
            'tahun_lulus'    => 'required|string',
            'nama_ortu'      => 'required|string',
            'hubungan'       => 'required|string',
            'no_telepon'     => 'required|string',
        ]);

        $user = $request->user();

        $pendaftaran = Pendaftaran::updateOrCreate(
            ['user_id' => $user->id],
            [
                'jalur_id'        => $request->jalur_id,
                'no_pendaftaran'  => $this->generateNoPendaftaran(),
                'status'          => 'draft',
            ]
        );

        DataDiri::updateOrCreate(
            ['pendaftaran_id' => $pendaftaran->id],
            [
                'nama_lengkap'  => $request->nama_lengkap,
                'nisn'          => $request->nisn,
                'jenis_kelamin' => $request->jenis_kelamin,
                'tempat_lahir'  => $request->tempat_lahir,
                'tgl_lahir'     => $request->tgl_lahir,
                'agama'         => $request->agama,
                'asal_sekolah'  => $request->asal_sekolah,
                'tahun_lulus'   => $request->tahun_lulus,
            ]
        );

        DataOrangTua::updateOrCreate(
            ['pendaftaran_id' => $pendaftaran->id],
            [
                'nama'       => $request->nama_ortu,
                'hubungan'   => $request->hubungan,
                'pekerjaan'  => $request->pekerjaan,
                'no_telepon' => $request->no_telepon,
                'alamat'     => $request->alamat,
            ]
        );

        return response()->json([
            'message'     => 'Formulir berhasil disimpan',
            'pendaftaran' => $pendaftaran,
        ]);
    }

    public function uploadDokumen(Request $request)
    {
        $request->validate([
            'jenis' => 'required|string',
            'file'  => 'required|file|mimes:jpg,jpeg,png,pdf|max:2048',
        ]);

        $user        = $request->user();
        $pendaftaran = Pendaftaran::where('user_id', $user->id)->firstOrFail();

        $path = $request->file('file')->store('dokumen/' . $pendaftaran->id, 'public');

        Dokumen::updateOrCreate(
            ['pendaftaran_id' => $pendaftaran->id, 'jenis' => $request->jenis],
            ['file_path' => $path, 'status' => 'belum']
        );

        return response()->json(['message' => 'Dokumen berhasil diupload']);
    }

    public function hapusDokumen(Request $request, $id)
    {
        $user        = $request->user();
        $pendaftaran = Pendaftaran::where('user_id', $user->id)->firstOrFail();
        $dokumen     = Dokumen::where('id', $id)
                              ->where('pendaftaran_id', $pendaftaran->id)
                              ->firstOrFail();

        Storage::disk('public')->delete($dokumen->file_path);
        $dokumen->delete();

        return response()->json(['message' => 'Dokumen berhasil dihapus']);
    }

    public function submit(Request $request)
    {
        $user        = $request->user();
        $pendaftaran = Pendaftaran::where('user_id', $user->id)->firstOrFail();

        $pendaftaran->update([
            'status'       => 'menunggu',
            'submitted_at' => now(),
        ]);

        return response()->json(['message' => 'Pendaftaran berhasil dikirim']);
    }

    public function status(Request $request)
    {
        $user        = $request->user();
        $pendaftaran = Pendaftaran::with(['dataDiri', 'jalur', 'dokumen'])
                                  ->where('user_id', $user->id)
                                  ->first();

        if (!$pendaftaran) {
            return response()->json(['pendaftaran' => null]);
        }

        return response()->json(['pendaftaran' => $pendaftaran]);
    }

    public function hasil(Request $request)
    {
        $user        = $request->user();
        $pendaftaran = Pendaftaran::with(['dataDiri', 'jalur', 'seleksi'])
                                  ->where('user_id', $user->id)
                                  ->firstOrFail();

        return response()->json(['pendaftaran' => $pendaftaran]);
    }

    public function cekStatus($noPendaftaran)
    {
        $pendaftaran = Pendaftaran::with(['dataDiri', 'jalur'])
                                  ->where('no_pendaftaran', $noPendaftaran)
                                  ->first();

        if (!$pendaftaran) {
            return response()->json(['message' => 'Nomor pendaftaran tidak ditemukan'], 404);
        }

        return response()->json([
            'no_pendaftaran' => $pendaftaran->no_pendaftaran,
            'nama'           => $pendaftaran->dataDiri->nama_lengkap ?? '-',
            'jalur'          => $pendaftaran->jalur->nama ?? '-',
            'status'         => $pendaftaran->status,
        ]);
    }
}
