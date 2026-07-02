<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DesaZonasi extends Model
{
    protected $table = 'desa_zonasi';

    protected $fillable = [
        'nama_desa',
        'jarak_km',
        'is_active',
    ];

    protected $casts = [
        'jarak_km'  => 'decimal:2',
        'is_active' => 'boolean',
    ];
}
