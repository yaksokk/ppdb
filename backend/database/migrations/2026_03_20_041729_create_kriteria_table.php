<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('kriteria', function (Blueprint $table) {
            $table->id();
            $table->foreignId('jalur_id')->constrained('jalur_masuk')->onDelete('cascade');
            $table->string('nama');
            $table->string('kode')->unique();
            $table->decimal('bobot', 5, 2);
            $table->enum('jenis', ['benefit', 'cost'])->default('benefit');
            $table->text('deskripsi')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('kriteria');
    }
};
