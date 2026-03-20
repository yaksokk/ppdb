<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pendaftaran extends Model
{
    protected $table = 'pendaftaran';

    protected $fillable = [
        'user_id', 'jalur_id', 'no_pendaftaran', 'status', 'submitted_at',
    ];

    protected $casts = [
        'submitted_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function jalur()
    {
        return $this->belongsTo(JalurMasuk::class, 'jalur_id');
    }

    public function dataDiri()
    {
        return $this->hasOne(DataDiri::class);
    }

    public function dataOrangTua()
    {
        return $this->hasOne(DataOrangTua::class);
    }

    public function dokumen()
    {
        return $this->hasMany(Dokumen::class);
    }

    public function seleksi()
    {
        return $this->hasOne(Seleksi::class);
    }
    public function nilaiKriteria()
    {
        return $this->hasMany(NilaiKriteria::class);
    }
}
