<?php

namespace App\Http\Middleware;

use App\Models\Setting;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CekStatusPpdb
{
    /**
     * R4: Blokir route pendaftar yang memerlukan PPDB terbuka.
     * Route /pendaftar/status dan /pendaftar/hasil dikecualikan
     * dari middleware ini langsung di routes/api.php.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $statusPpdb = Setting::where('key', 'status_ppdb')->value('value');

        if ($statusPpdb === 'tutup') {
            return response()->json([
                'message' => 'PPDB sedang ditutup',
                'code'    => 'PPDB_CLOSED',
            ], Response::HTTP_FORBIDDEN);
        }

        return $next($request);
    }
}
