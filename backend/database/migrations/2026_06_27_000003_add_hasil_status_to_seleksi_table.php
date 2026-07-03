<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('seleksi', function (Blueprint $table) {
            $table->enum('hasil_status', [
                'belum_diproses',
                'sudah_saw',
                'diterima',
                'ditolak',
            ])->default('belum_diproses')->after('skor_saw');
        });
    }

    public function down(): void
    {
        Schema::table('seleksi', function (Blueprint $table) {
            $table->dropColumn('hasil_status');
        });
    }
};
