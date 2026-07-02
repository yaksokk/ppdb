<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('data_diri', function (Blueprint $table) {
            // Tambah kolom baru setelah tahun_lulus
            $table->string('nama_desa')->nullable()->after('tahun_lulus');

            // Hapus kolom cascade wilayah & koordinat yang tidak lagi dipakai
            // (kolom ini ditambahkan oleh migration 2026_06_11_000001)
            $table->dropColumn([
                'provinsi', 'provinsi_id',
                'kabupaten', 'kabupaten_id',
                'kecamatan', 'kecamatan_id',
                'desa', 'desa_id',
                'lat', 'lng',
            ]);
            // Kolom jarak_km dipertahankan (sudah ada dari migration sebelumnya)
        });
    }

    public function down(): void
    {
        Schema::table('data_diri', function (Blueprint $table) {
            $table->dropColumn('nama_desa');

            $table->string('provinsi')->nullable()->after('tahun_lulus');
            $table->string('provinsi_id')->nullable()->after('provinsi');
            $table->string('kabupaten')->nullable()->after('provinsi_id');
            $table->string('kabupaten_id')->nullable()->after('kabupaten');
            $table->string('kecamatan')->nullable()->after('kabupaten_id');
            $table->string('kecamatan_id')->nullable()->after('kecamatan');
            $table->string('desa')->nullable()->after('kecamatan_id');
            $table->string('desa_id')->nullable()->after('desa');
            $table->decimal('lat', 10, 7)->nullable()->after('desa_id');
            $table->decimal('lng', 10, 7)->nullable()->after('lat');
        });
    }
};
