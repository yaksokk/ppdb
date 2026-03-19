<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Dokumen extends Model
{
    protected $fillable = [
        'pendaftaran_id', 'jenis', 'file_path',
        'status', 'catatan', 'verified_by', 'verified_at',
    ];

    protected $casts = [
        'verified_at' => 'datetime',
    ];

    public function pendaftaran()
    {
        return $this->belongsTo(Pendaftaran::class);
    }

    public function verifiedBy()
    {
        return $this->belongsTo(User::class, 'verified_by');
    }
}
