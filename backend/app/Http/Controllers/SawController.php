<?php

namespace App\Http\Controllers;

use App\Models\Pendaftaran;
use App\Models\Kriteria;
use App\Models\NilaiKriteria;
use App\Models\Seleksi;
use Illuminate\Http\Request;

class SawController extends Controller
{
    public function hitung(Request $request)
    {
        $request->validate([
            'jalur_id' => 'required|exists:jalur_masuk,id',
        ]);

        $jalurId = $request->jalur_id;

        $kriteria = Kriteria::where('jalur_id', $jalurId)->get();
        if ($kriteria->isEmpty()) {
            return response()->json(['message' => 'Tidak ada kriteria untuk jalur ini'], 404);
        }

        $pendaftaran = Pendaftaran::with('nilaiKriteria')
            ->where('jalur_id', $jalurId)
            ->where('status', 'menunggu')
            ->get();

        if ($pendaftaran->isEmpty()) {
            return response()->json(['message' => 'Tidak ada pendaftar untuk jalur ini'], 404);
        }

        $nilaiMatrix = [];
        foreach ($pendaftaran as $p) {
            foreach ($kriteria as $k) {
                $nilai = $p->nilaiKriteria->where('kriteria_id', $k->id)->first();
                $nilaiMatrix[$p->id][$k->id] = $nilai ? (float)$nilai->nilai : 0;
            }
        }

        $nilaiNormalisasi = [];
        foreach ($kriteria as $k) {
            $nilaiKolom = array_column(array_map(fn($row) => [$k->id => $row[$k->id]], $nilaiMatrix), $k->id);

            if ($k->jenis === 'benefit') {
                $best = max($nilaiKolom);
            } else {
                $best = min($nilaiKolom);
                $best = $best == 0 ? 1 : $best;
            }

            foreach ($pendaftaran as $p) {
                $nilai = $nilaiMatrix[$p->id][$k->id];
                if ($k->jenis === 'benefit') {
                    $nilaiNormalisasi[$p->id][$k->id] = $best > 0 ? $nilai / $best : 0;
                } else {
                    $nilaiNormalisasi[$p->id][$k->id] = $nilai > 0 ? $best / $nilai : 0;
                }
            }
        }

        $skorAkhir = [];
        foreach ($pendaftaran as $p) {
            $skor = 0;
            foreach ($kriteria as $k) {
                $bobot = (float)$k->bobot / 100;
                $skor += $bobot * $nilaiNormalisasi[$p->id][$k->id];
            }
            $skorAkhir[$p->id] = round($skor, 4);
        }

        arsort($skorAkhir);
        $ranking = 1;
        $hasil   = [];

        foreach ($skorAkhir as $pendaftaranId => $skor) {
            Seleksi::updateOrCreate(
                ['pendaftaran_id' => $pendaftaranId],
                [
                    'skor_saw'    => $skor,
                    'ranking'     => $ranking,
                    'input_by'    => $request->user()->id,
                ]
            );

            $p = $pendaftaran->find($pendaftaranId);
            $hasil[] = [
                'pendaftaran_id' => $pendaftaranId,
                'nama'           => $p->dataDiri->nama_lengkap ?? '-',
                'skor_saw'       => $skor,
                'ranking'        => $ranking,
            ];

            $ranking++;
        }

        return response()->json([
            'message' => 'Perhitungan SAW berhasil',
            'hasil'   => $hasil,
        ]);
    }

    public function getRanking(Request $request)
    {
        $request->validate([
            'jalur_id' => 'required|exists:jalur_masuk,id',
        ]);

        $hasil = Pendaftaran::with(['dataDiri', 'jalur', 'seleksi'])
            ->where('jalur_id', $request->jalur_id)
            ->whereHas('seleksi', function ($q) {
                $q->whereNotNull('ranking');
            })
            ->get()
            ->sortBy(fn($p) => $p->seleksi->ranking ?? 999)
            ->values()
            ->map(fn($p) => [
                'pendaftaran_id' => $p->id,
                'no_pendaftaran' => $p->no_pendaftaran,
                'nama'           => $p->dataDiri->nama_lengkap ?? '-',
                'jalur'          => $p->jalur->nama ?? '-',
                'skor_saw'       => $p->seleksi->skor_saw ?? 0,
                'ranking'        => $p->seleksi->ranking ?? '-',
                'status_lulus'   => $p->seleksi->status_lulus,
            ]);

        return response()->json(['ranking' => $hasil]);
    }
}
