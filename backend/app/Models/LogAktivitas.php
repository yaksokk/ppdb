<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LogAktivitas extends Model
{
    protected $table = 'log_aktivitas';

    protected $fillable = [
        'user_id', 'aksi', 'entity',
        'entity_id', 'deskripsi', 'ip_address',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
