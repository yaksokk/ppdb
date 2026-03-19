<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JalurMasuk extends Model
{
    protected $table = 'jalur_masuk';

    protected $fillable = [
        'nama', 'kode', 'kuota', 'deskripsi', 'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function pendaftaran()
    {
        return $this->hasMany(Pendaftaran::class, 'jalur_id');
    }
}
