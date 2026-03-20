<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\JalurMasuk;

class JalurMasukSeeder extends Seeder
{
    public function run(): void
    {
        $jalur = [
            ['nama' => 'Zonasi',   'kode' => 'zonasi',   'kuota' => 50, 'deskripsi' => 'Seleksi berdasarkan jarak domisili ke sekolah'],
            ['nama' => 'Prestasi', 'kode' => 'prestasi', 'kuota' => 30, 'deskripsi' => 'Berdasarkan nilai rapor atau sertifikat prestasi'],
            ['nama' => 'Afirmasi', 'kode' => 'afirmasi', 'kuota' => 20, 'deskripsi' => 'Untuk siswa dari keluarga tidak mampu'],
            ['nama' => 'Mutasi',   'kode' => 'mutasi',   'kuota' => 10, 'deskripsi' => 'Perpindahan tugas orang tua/wali'],
        ];

        foreach ($jalur as $item) {
            JalurMasuk::create($item);
        }
    }
}
