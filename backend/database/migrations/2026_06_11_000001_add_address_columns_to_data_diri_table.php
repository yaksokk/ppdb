<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('data_diri', function (Blueprint $table) {
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
            $table->decimal('jarak_km', 8, 2)->nullable()->after('lng');
        });
    }

    public function down(): void
    {
        Schema::table('data_diri', function (Blueprint $table) {
            $table->dropColumn([
                'provinsi', 'provinsi_id',
                'kabupaten', 'kabupaten_id',
                'kecamatan', 'kecamatan_id',
                'desa', 'desa_id',
                'lat', 'lng', 'jarak_km',
            ]);
        });
    }
};
