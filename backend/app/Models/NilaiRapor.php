<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class NilaiRapor extends Model
{
    protected $table = 'nilai_rapor';

    protected $fillable = [
        'pendaftaran_id', 'semester', 'nilai',
    ];

    protected $casts = [
        'nilai' => 'decimal:2',
    ];

    public function pendaftaran()
    {
        return $this->belongsTo(Pendaftaran::class);
    }
}
