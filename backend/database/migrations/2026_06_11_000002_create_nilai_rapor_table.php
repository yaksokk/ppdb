<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('nilai_rapor', function (Blueprint $table) {
            $table->id();
            $table->foreignId('pendaftaran_id')->constrained('pendaftaran')->onDelete('cascade');
            $table->enum('semester', ['4a', '4b', '5a', '5b', '6a']);
            $table->decimal('nilai', 5, 2);
            $table->timestamps();

            $table->unique(['pendaftaran_id', 'semester']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('nilai_rapor');
    }
};
