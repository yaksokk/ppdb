<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PendaftarController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\OperatorController;
use App\Http\Controllers\SawController;
use App\Http\Controllers\KriteriaController;


Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login',    [AuthController::class, 'login']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/me',              [AuthController::class, 'me']);
        Route::post('/logout',         [AuthController::class, 'logout']);
        Route::put('/password',        [AuthController::class, 'updatePassword']);
    });

    Route::middleware('auth:sanctum')->group(function () {
        Route::middleware('role:pendaftar')->group(function () {
            Route::post('/pendaftar/formulir',        [PendaftarController::class, 'submitFormulir']);
            Route::put('/pendaftar/formulir',         [PendaftarController::class, 'submitFormulir']);
            Route::post('/pendaftar/dokumen',         [PendaftarController::class, 'uploadDokumen']);
            Route::delete('/pendaftar/dokumen/{id}',  [PendaftarController::class, 'hapusDokumen']);
            Route::post('/pendaftar/submit',          [PendaftarController::class, 'submit']);
            Route::get('/pendaftar/status',           [PendaftarController::class, 'status']);
            Route::get('/pendaftar/hasil',            [PendaftarController::class, 'hasil']);
        });
    });

    Route::get('/cek-status/{no_pendaftaran}', [PendaftarController::class, 'cekStatus']);



    Route::middleware(['auth:sanctum', 'role:admin'])->prefix('admin')->group(function () {
        Route::get('/dashboard',                    [AdminController::class, 'dashboard']);
        Route::get('/pendaftar',                    [AdminController::class, 'listPendaftar']);
        Route::get('/pendaftar/{id}',               [AdminController::class, 'detailPendaftar']);
        Route::put('/pendaftar/{id}/status',        [AdminController::class, 'updateStatus']);
        Route::put('/dokumen/{id}/verifikasi',      [AdminController::class, 'verifikasiDokumen']);
        Route::get('/operator',                     [AdminController::class, 'listOperator']);
        Route::post('/operator',                    [AdminController::class, 'tambahOperator']);
        Route::put('/operator/{id}',                [AdminController::class, 'updateOperator']);
        Route::delete('/operator/{id}',             [AdminController::class, 'hapusOperator']);
        Route::get('/setting',                      [AdminController::class, 'getSetting']);
        Route::put('/setting',                      [AdminController::class, 'updateSetting']);
        Route::get('/log',                          [AdminController::class, 'logAktivitas']);
    });


    Route::middleware(['auth:sanctum', 'role:operator'])->prefix('operator')->group(function () {
        Route::get('/pendaftar',                        [OperatorController::class, 'listPendaftar']);
        Route::get('/pendaftar/{id}',                   [OperatorController::class, 'detailPendaftar']);
        Route::post('/pendaftar/{id}/nilai',            [OperatorController::class, 'inputNilai']);
        Route::get('/hasil-seleksi',                    [OperatorController::class, 'hasilSeleksi']);
        Route::put('/hasil-seleksi/{id}',               [OperatorController::class, 'updateHasil']);
    });
    Route::middleware(['auth:sanctum', 'role:operator'])->prefix('saw')->group(function () {
        Route::post('/hitung',          [SawController::class, 'hitung']);
        Route::get('/ranking',          [SawController::class, 'getRanking']);
    });

    Route::middleware('auth:sanctum')->group(function () {
    Route::get('/kriteria',                         [KriteriaController::class, 'index']);
    Route::get('/kriteria/jalur/{jalurId}',         [KriteriaController::class, 'indexByJalur']);
    Route::get('/kriteria/validasi/{jalurId}',      [KriteriaController::class, 'validateBobot']);

    Route::middleware('role:admin')->group(function () {
        Route::post('/kriteria',                    [KriteriaController::class, 'store']);
        Route::put('/kriteria/{id}',                [KriteriaController::class, 'update']);
        Route::delete('/kriteria/{id}',             [KriteriaController::class, 'destroy']);
        });
    });
});
