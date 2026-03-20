<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Kriteria;
use App\Models\JalurMasuk;

class KriteriaSeeder extends Seeder
{
    public function run(): void
    {
        $jalurPrestasi  = JalurMasuk::where('kode', 'prestasi')->first();
        $jalurZonasi    = JalurMasuk::where('kode', 'zonasi')->first();
        $jalurAfirmasi  = JalurMasuk::where('kode', 'afirmasi')->first();
        $jalurMutasi    = JalurMasuk::where('kode', 'mutasi')->first();

        $kriteria = [
            // Prestasi
            ['jalur_id' => $jalurPrestasi->id,  'nama' => 'Nilai Rapor',         'kode' => 'prestasi_rapor',     'bobot' => 60, 'jenis' => 'benefit', 'deskripsi' => 'Rata-rata nilai rapor kelas 4-6 SD'],
            ['jalur_id' => $jalurPrestasi->id,  'nama' => 'Nilai Prestasi',      'kode' => 'prestasi_sertifikat','bobot' => 40, 'jenis' => 'benefit', 'deskripsi' => 'Skor dari sertifikat atau piagam prestasi'],
            // Zonasi
            ['jalur_id' => $jalurZonasi->id,    'nama' => 'Nilai Rapor',         'kode' => 'zonasi_rapor',       'bobot' => 70, 'jenis' => 'benefit', 'deskripsi' => 'Rata-rata nilai rapor kelas 4-6 SD'],
            ['jalur_id' => $jalurZonasi->id,    'nama' => 'Jarak Domisili (km)', 'kode' => 'zonasi_jarak',       'bobot' => 30, 'jenis' => 'cost',    'deskripsi' => 'Jarak domisili ke sekolah dalam km'],
            // Afirmasi
            ['jalur_id' => $jalurAfirmasi->id,  'nama' => 'Nilai Rapor',         'kode' => 'afirmasi_rapor',     'bobot' => 50, 'jenis' => 'benefit', 'deskripsi' => 'Rata-rata nilai rapor kelas 4-6 SD'],
            ['jalur_id' => $jalurAfirmasi->id,  'nama' => 'Kondisi Ekonomi',     'kode' => 'afirmasi_ekonomi',   'bobot' => 50, 'jenis' => 'cost',    'deskripsi' => 'Skor kondisi ekonomi keluarga'],
            // Mutasi
            ['jalur_id' => $jalurMutasi->id,    'nama' => 'Nilai Rapor',         'kode' => 'mutasi_rapor',       'bobot' => 100,'jenis' => 'benefit', 'deskripsi' => 'Rata-rata nilai rapor kelas 4-6 SD'],
        ];

        foreach ($kriteria as $item) {
            Kriteria::create($item);
        }
    }
}
