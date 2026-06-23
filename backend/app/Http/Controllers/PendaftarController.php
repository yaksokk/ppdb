<?php

namespace App\Http\Controllers;

use App\Models\Pendaftaran;
use App\Models\DataDiri;
use App\Models\DataOrangTua;
use App\Models\Dokumen;
use App\Models\JalurMasuk;
use App\Models\Kriteria;
use App\Models\NilaiKriteria;
use App\Models\NilaiRapor;
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

    /**
     * P4: Sync nilai_kriteria otomatis dari data rapor dan jarak.
     */
    private function syncNilaiFromForm(Pendaftaran $pendaftaran, ?array $nilaiRaporData, ?float $jarakKm): void
    {
        if (!$pendaftaran->jalur_id) {
            return;
        }

        $kriteria = Kriteria::where('jalur_id', $pendaftaran->jalur_id)->get();

        foreach ($kriteria as $k) {
            // P2: Sync *_rapor dari rata-rata nilai rapor
            if (str_ends_with($k->kode, '_rapor') && !empty($nilaiRaporData)) {
                $values = array_filter(
                    array_column($nilaiRaporData, 'nilai'),
                    fn($v) => $v !== null && $v !== '' && is_numeric($v)
                );
                if (!empty($values)) {
                    $avg = array_sum($values) / count($values);
                    NilaiKriteria::updateOrCreate(
                        ['pendaftaran_id' => $pendaftaran->id, 'kriteria_id' => $k->id],
                        ['nilai' => round($avg, 2)]
                    );
                }
            }

            // P1: Sync zonasi_jarak dari kalkulasi Haversine
            if ($k->kode === 'zonasi_jarak' && $jarakKm !== null) {
                NilaiKriteria::updateOrCreate(
                    ['pendaftaran_id' => $pendaftaran->id, 'kriteria_id' => $k->id],
                    ['nilai' => round($jarakKm, 2)]
                );
            }
        }
    }

    /**
     * P3: Sync nilai_kriteria otomatis dari sub_kategori dokumen.
     */
    private function syncNilaiFromDokumen(Pendaftaran $pendaftaran, string $subKategori): void
    {
        $jalur = JalurMasuk::find($pendaftaran->jalur_id);
        if (!$jalur) {
            return;
        }

        $kodeKriteria = null;
        $score        = null;

        if ($jalur->kode === 'prestasi') {
            $map = [
                'Internasional'  => 100,
                'Nasional'       => 85,
                'Provinsi'       => 70,
                'Kabupaten/Kota' => 55,
                'Kecamatan'      => 40,
            ];
            $kodeKriteria = 'prestasi_sertifikat';
            $score        = $map[$subKategori] ?? null;
        } elseif ($jalur->kode === 'afirmasi') {
            $map = [
                'KIP'         => 10,
                'PKH'         => 20,
                'BPNT'        => 30,
                'Disabilitas' => 40,
            ];
            $kodeKriteria = 'afirmasi_ekonomi';
            $score        = $map[$subKategori] ?? null;
        }
        // Mutasi: sub_kategori disimpan tapi tidak mempengaruhi nilai kriteria
        // Zonasi: tidak ada sub_kategori

        if ($kodeKriteria && $score !== null) {
            $kriteria = Kriteria::where('kode', $kodeKriteria)->first();
            if ($kriteria) {
                NilaiKriteria::updateOrCreate(
                    ['pendaftaran_id' => $pendaftaran->id, 'kriteria_id' => $kriteria->id],
                    ['nilai' => $score]
                );
            }
        }
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
            // P1 – alamat wilayah
            'provinsi'       => 'required|string',
            'kabupaten'      => 'required|string',
            'kecamatan'      => 'required|string',
            'desa'           => 'required|string',
            // P2 – nilai rapor
            'nilai_rapor'             => 'nullable|array',
            'nilai_rapor.*.semester'  => 'required_with:nilai_rapor|in:4a,4b,5a,5b,6a',
            'nilai_rapor.*.nilai'     => 'required_with:nilai_rapor|numeric|min:0|max:100',
        ]);

        $user = $request->user();

        $pendaftaran = Pendaftaran::updateOrCreate(
            ['user_id' => $user->id],
            [
                'jalur_id'       => $request->jalur_id,
                'no_pendaftaran' => $this->generateNoPendaftaran(),
                'status'         => 'draft',
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
                // P1
                'provinsi'      => $request->provinsi,
                'provinsi_id'   => $request->provinsi_id,
                'kabupaten'     => $request->kabupaten,
                'kabupaten_id'  => $request->kabupaten_id,
                'kecamatan'     => $request->kecamatan,
                'kecamatan_id'  => $request->kecamatan_id,
                'desa'          => $request->desa,
                'desa_id'       => $request->desa_id,
                'lat'           => $request->lat,
                'lng'           => $request->lng,
                'jarak_km'      => $request->jarak_km,
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

        // P2: Simpan nilai rapor per semester
        if ($request->filled('nilai_rapor')) {
            foreach ($request->nilai_rapor as $item) {
                NilaiRapor::updateOrCreate(
                    ['pendaftaran_id' => $pendaftaran->id, 'semester' => $item['semester']],
                    ['nilai' => $item['nilai']]
                );
            }
        }

        // P4: Sync nilai_kriteria otomatis
        $this->syncNilaiFromForm(
            $pendaftaran,
            $request->nilai_rapor,
            $request->jarak_km !== null ? (float) $request->jarak_km : null
        );

        return response()->json([
            'message'     => 'Formulir berhasil disimpan',
            'pendaftaran' => $pendaftaran,
        ]);
    }

    public function uploadDokumen(Request $request)
    {
        $request->validate([
            'jenis'        => 'required|string',
            'file'         => 'required|file|mimes:jpg,jpeg,png,pdf|max:2048',
            'sub_kategori' => 'nullable|string',
        ]);

        $user        = $request->user();
        $pendaftaran = Pendaftaran::where('user_id', $user->id)->firstOrFail();

        $namaFile = $request->file('file')->getClientOriginalName();
        $path     = $request->file('file')->store('dokumen/' . $pendaftaran->id, 'public');

        Dokumen::updateOrCreate(
            ['pendaftaran_id' => $pendaftaran->id, 'jenis' => $request->jenis],
            [
                'file_path'    => $path,
                'nama_file'    => $namaFile,
                'sub_kategori' => $request->sub_kategori,
                'status'       => 'belum',
            ]
        );

        // P4: Sync nilai_kriteria dari sub_kategori dokumen
        if ($request->filled('sub_kategori')) {
            $this->syncNilaiFromDokumen($pendaftaran, $request->sub_kategori);
        }

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
        $pendaftaran = Pendaftaran::with(['dataDiri', 'dataOrangTua', 'jalur', 'dokumen', 'nilaiRapor'])
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

    public function saveDraft(Request $request)
    {
        $request->validate([
            'jalur_id'      => 'nullable|exists:jalur_masuk,id',
            'nama_lengkap'  => 'nullable|string',
            'nisn'          => 'nullable|string',
            'jenis_kelamin' => 'nullable|string',
            'tempat_lahir'  => 'nullable|string',
            'tgl_lahir'     => 'nullable|date',
            'agama'         => 'nullable|string',
            'asal_sekolah'  => 'nullable|string',
            'tahun_lulus'   => 'nullable|string',
            'nama_ortu'     => 'nullable|string',
            'hubungan'      => 'nullable|string',
            'no_telepon'    => 'nullable|string',
            // P2
            'nilai_rapor'             => 'nullable|array',
            'nilai_rapor.*.semester'  => 'required_with:nilai_rapor|in:4a,4b,5a,5b,6a',
            'nilai_rapor.*.nilai'     => 'required_with:nilai_rapor|numeric|min:0|max:100',
        ]);

        $user = $request->user();

        $pendaftaran = Pendaftaran::updateOrCreate(
            ['user_id' => $user->id],
            [
                'jalur_id'       => $request->jalur_id,
                'no_pendaftaran' => $this->generateNoPendaftaran(),
                'status'         => 'draft',
            ]
        );

        if ($request->filled('nama_lengkap') || $request->filled('nisn') || $request->filled('provinsi')) {
            DataDiri::updateOrCreate(
                ['pendaftaran_id' => $pendaftaran->id],
                array_filter([
                    'nama_lengkap'  => $request->nama_lengkap,
                    'nisn'          => $request->nisn,
                    'jenis_kelamin' => $request->jenis_kelamin,
                    'tempat_lahir'  => $request->tempat_lahir,
                    'tgl_lahir'     => $request->tgl_lahir,
                    'agama'         => $request->agama,
                    'asal_sekolah'  => $request->asal_sekolah,
                    'tahun_lulus'   => $request->tahun_lulus,
                    // P1
                    'provinsi'      => $request->provinsi,
                    'provinsi_id'   => $request->provinsi_id,
                    'kabupaten'     => $request->kabupaten,
                    'kabupaten_id'  => $request->kabupaten_id,
                    'kecamatan'     => $request->kecamatan,
                    'kecamatan_id'  => $request->kecamatan_id,
                    'desa'          => $request->desa,
                    'desa_id'       => $request->desa_id,
                    'lat'           => $request->lat,
                    'lng'           => $request->lng,
                    'jarak_km'      => $request->jarak_km,
                ], fn($v) => $v !== null && $v !== '')
            );
        }

        if ($request->filled('nama_ortu') || $request->filled('no_telepon')) {
            DataOrangTua::updateOrCreate(
                ['pendaftaran_id' => $pendaftaran->id],
                array_filter([
                    'nama'       => $request->nama_ortu,
                    'hubungan'   => $request->hubungan,
                    'pekerjaan'  => $request->pekerjaan,
                    'no_telepon' => $request->no_telepon,
                    'alamat'     => $request->alamat,
                ], fn($v) => $v !== null && $v !== '')
            );
        }

        // P2: Simpan nilai rapor draft
        if ($request->filled('nilai_rapor')) {
            foreach ($request->nilai_rapor as $item) {
                if (isset($item['nilai']) && $item['nilai'] !== '') {
                    NilaiRapor::updateOrCreate(
                        ['pendaftaran_id' => $pendaftaran->id, 'semester' => $item['semester']],
                        ['nilai' => $item['nilai']]
                    );
                }
            }
        }

        // P4: Sync nilai_kriteria otomatis
        if ($pendaftaran->jalur_id) {
            $this->syncNilaiFromForm(
                $pendaftaran,
                $request->nilai_rapor,
                $request->jarak_km !== null ? (float) $request->jarak_km : null
            );
        }

        return response()->json(['message' => 'Draft berhasil disimpan']);
    }
}
