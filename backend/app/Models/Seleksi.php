<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Seleksi extends Model
{
    protected $table = 'seleksi';

    protected $fillable = [
        'pendaftaran_id', 'nilai', 'ranking',
        'status_lulus', 'catatan', 'input_by',
        'skor_saw',
    ];

    protected $casts = [
        'status_lulus' => 'boolean',
        'nilai'        => 'decimal:2',
        'skor_saw'     => 'decimal:4',
    ];

    public function pendaftaran()
    {
        return $this->belongsTo(Pendaftaran::class);
    }

    public function inputBy()
    {
        return $this->belongsTo(User::class, 'input_by');
    }
}
