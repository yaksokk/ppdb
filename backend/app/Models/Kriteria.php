<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Kriteria extends Model
{
    protected $table = 'kriteria';

    protected $fillable = [
        'jalur_id', 'nama', 'kode', 'bobot', 'jenis', 'deskripsi',
    ];

    protected $casts = [
        'bobot' => 'decimal:2',
    ];

    public function jalur()
    {
        return $this->belongsTo(JalurMasuk::class, 'jalur_id');
    }

    public function nilaiKriteria()
    {
        return $this->hasMany(NilaiKriteria::class);
    }
}
