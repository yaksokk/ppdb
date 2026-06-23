<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement(
            "ALTER TABLE pendaftaran MODIFY COLUMN status
             ENUM('draft','menunggu','perbaikan','terverifikasi','diterima','ditolak')
             DEFAULT 'draft'"
        );
    }

    public function down(): void
    {
        DB::statement(
            "ALTER TABLE pendaftaran MODIFY COLUMN status
             ENUM('draft','menunggu','perbaikan','diterima','ditolak')
             DEFAULT 'draft'"
        );
    }
};
