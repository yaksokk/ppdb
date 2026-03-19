<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DataOrangTua extends Model
{
    protected $table = 'data_orang_tua';

    protected $fillable = [
        'pendaftaran_id', 'nama', 'hubungan',
        'pekerjaan', 'no_telepon', 'alamat',
    ];

    public function pendaftaran()
    {
        return $this->belongsTo(Pendaftaran::class);
    }
}
