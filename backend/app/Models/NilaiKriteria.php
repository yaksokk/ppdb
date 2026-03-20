<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class NilaiKriteria extends Model
{
    protected $table = 'nilai_kriteria';

    protected $fillable = [
        'pendaftaran_id', 'kriteria_id', 'nilai',
    ];

    protected $casts = [
        'nilai' => 'decimal:2',
    ];

    public function pendaftaran()
    {
        return $this->belongsTo(Pendaftaran::class);
    }

    public function kriteria()
    {
        return $this->belongsTo(Kriteria::class);
    }
}
