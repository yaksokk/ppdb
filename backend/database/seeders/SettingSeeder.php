<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Setting;

class SettingSeeder extends Seeder
{
    public function run(): void
    {
        $settings = [
            ['key' => 'nama_sekolah',    'value' => 'SMP Negeri 1 Tumpaan'],
            ['key' => 'tahun_ajaran',    'value' => '2025/2026'],
            ['key' => 'status_ppdb',     'value' => 'buka'],
            ['key' => 'tgl_buka',        'value' => '2025-01-15'],
            ['key' => 'tgl_tutup',       'value' => '2025-02-28'],
            ['key' => 'tgl_verifikasi',  'value' => '2025-03-01'],
            ['key' => 'tgl_pengumuman',  'value' => '2025-03-15'],
            ['key' => 'tgl_daftar_ulang','value' => '2025-03-16'],
            ['key' => 'buka_pengumuman', 'value' => 'tidak'],
            ['key' => 'kuota_total',     'value' => '110'],
        ];

        foreach ($settings as $item) {
            Setting::create($item);
        }
    }
}
