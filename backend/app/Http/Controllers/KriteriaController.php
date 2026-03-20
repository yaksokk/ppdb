<?php

namespace App\Http\Controllers;

use App\Models\Kriteria;
use App\Models\JalurMasuk;
use Illuminate\Http\Request;

class KriteriaController extends Controller
{
    public function index()
    {
        $kriteria = Kriteria::with('jalur')->get()->groupBy('jalur_id');
        return response()->json(['kriteria' => $kriteria]);
    }

    public function indexByJalur($jalurId)
    {
        $kriteria = Kriteria::where('jalur_id', $jalurId)->get();
        return response()->json(['kriteria' => $kriteria]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'jalur_id'   => 'required|exists:jalur_masuk,id',
            'nama'       => 'required|string',
            'kode'       => 'required|string|unique:kriteria',
            'bobot'      => 'required|numeric|min:1|max:100',
            'jenis'      => 'required|in:benefit,cost',
            'deskripsi'  => 'nullable|string',
        ]);

        $kriteria = Kriteria::create($request->all());

        return response()->json([
            'message'  => 'Kriteria berhasil ditambahkan',
            'kriteria' => $kriteria,
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'nama'      => 'required|string',
            'bobot'     => 'required|numeric|min:1|max:100',
            'jenis'     => 'required|in:benefit,cost',
            'deskripsi' => 'nullable|string',
        ]);

        $kriteria = Kriteria::findOrFail($id);
        $kriteria->update($request->only(['nama', 'bobot', 'jenis', 'deskripsi']));

        return response()->json([
            'message'  => 'Kriteria berhasil diupdate',
            'kriteria' => $kriteria,
        ]);
    }

    public function destroy($id)
    {
        $kriteria = Kriteria::findOrFail($id);
        $kriteria->delete();
        return response()->json(['message' => 'Kriteria berhasil dihapus']);
    }

    public function validateBobot($jalurId)
    {
        $totalBobot = Kriteria::where('jalur_id', $jalurId)->sum('bobot');
        return response()->json([
            'jalur_id'    => $jalurId,
            'total_bobot' => $totalBobot,
            'valid'       => $totalBobot == 100,
        ]);
    }
}
