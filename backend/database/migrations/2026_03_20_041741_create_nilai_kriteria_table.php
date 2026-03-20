<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('nilai_kriteria', function (Blueprint $table) {
            $table->id();
            $table->foreignId('pendaftaran_id')->constrained('pendaftaran')->onDelete('cascade');
            $table->foreignId('kriteria_id')->constrained('kriteria')->onDelete('cascade');
            $table->decimal('nilai', 8, 2);
            $table->timestamps();

            $table->unique(['pendaftaran_id', 'kriteria_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('nilai_kriteria');
    }
};
