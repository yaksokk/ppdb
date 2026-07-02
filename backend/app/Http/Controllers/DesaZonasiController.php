<?php

namespace App\Http\Controllers;

use App\Models\DesaZonasi;
use Illuminate\Http\Request;

class DesaZonasiController extends Controller
{
    /**
     * Daftar semua desa (aktif + nonaktif) — untuk admin CRUD.
     */
    public function index(Request $request)
    {
        $query = DesaZonasi::orderBy('nama_desa');

        if ($request->search) {
            $query->where('nama_desa', 'like', '%' . $request->search . '%');
        }

        if ($request->has('is_active') && $request->is_active !== '') {
            $query->where('is_active', (bool) $request->is_active);
        }

        return response()->json(['desa' => $query->get()]);
    }

    /**
     * Daftar desa aktif saja — untuk dropdown formulir pendaftar.
     */
    public function aktif()
    {
        $desa = DesaZonasi::where('is_active', true)
                           ->orderBy('nama_desa')
                           ->get(['id', 'nama_desa', 'jarak_km']);

        return response()->json(['desa' => $desa]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nama_desa' => 'required|string|max:255|unique:desa_zonasi,nama_desa',
            'jarak_km'  => 'required|numeric|min:0',
            'is_active' => 'boolean',
        ]);

        $desa = DesaZonasi::create([
            'nama_desa' => $request->nama_desa,
            'jarak_km'  => $request->jarak_km,
            'is_active' => $request->boolean('is_active', true),
        ]);

        return response()->json(['message' => 'Desa berhasil ditambahkan', 'desa' => $desa], 201);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'nama_desa' => 'required|string|max:255|unique:desa_zonasi,nama_desa,' . $id,
            'jarak_km'  => 'required|numeric|min:0',
            'is_active' => 'boolean',
        ]);

        $desa = DesaZonasi::findOrFail($id);
        $desa->update([
            'nama_desa' => $request->nama_desa,
            'jarak_km'  => $request->jarak_km,
            'is_active' => $request->boolean('is_active', $desa->is_active),
        ]);

        return response()->json(['message' => 'Desa berhasil diupdate', 'desa' => $desa]);
    }

    /**
     * Toggle aktif/nonaktif desa (soft-disable).
     */
    public function toggle($id)
    {
        $desa = DesaZonasi::findOrFail($id);
        $desa->update(['is_active' => !$desa->is_active]);

        return response()->json([
            'message'   => $desa->is_active ? 'Desa diaktifkan' : 'Desa dinonaktifkan',
            'is_active' => $desa->is_active,
        ]);
    }

    public function destroy($id)
    {
        $desa = DesaZonasi::findOrFail($id);
        $desa->delete();

        return response()->json(['message' => 'Desa berhasil dihapus']);
    }
}
