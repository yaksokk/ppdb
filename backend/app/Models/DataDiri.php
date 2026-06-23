<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DataDiri extends Model
{
    protected $table = 'data_diri';

    protected $fillable = [
        'pendaftaran_id', 'nik', 'nisn', 'nama_lengkap',
        'jenis_kelamin', 'tempat_lahir', 'tgl_lahir',
        'agama', 'asal_sekolah', 'tahun_lulus',
        'provinsi', 'provinsi_id',
        'kabupaten', 'kabupaten_id',
        'kecamatan', 'kecamatan_id',
        'desa', 'desa_id',
        'lat', 'lng', 'jarak_km',
    ];

    protected $casts = [
        'tgl_lahir' => 'date',
        'lat'       => 'float',
        'lng'       => 'float',
        'jarak_km'  => 'float',
    ];

    public function pendaftaran()
    {
        return $this->belongsTo(Pendaftaran::class);
    }
}
