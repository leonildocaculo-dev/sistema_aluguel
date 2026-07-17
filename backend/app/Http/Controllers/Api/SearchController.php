<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Property;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Requests\Search\SearchRequest;
use App\Http\Requests\Search\GeoSearchRequest;

class SearchController extends Controller
{
    public function search(SearchRequest $request)
    {
        // Construir a query base (só aprovadas e com imagens)
        $query = Property::where('status', 'approved')
            ->with(['images' => function($q) { $q->where('is_primary', true); }]);

        // Filtros Indexados (province, municipality, price_per_night)
        if ($request->filled('province')) {
            $query->where('province', $request->province);
        }
        if ($request->filled('municipality')) {
            $query->where('municipality', $request->municipality);
        }

        // Se o cliente forneceu datas, filtramos apenas propriedades com acomodações disponíveis nessas datas
        if ($request->filled('check_in') && $request->filled('check_out')) {
            $checkIn = $request->check_in;
            $checkOut = $request->check_out;

            // WhereHas accommodation that does NOT have an overlapping availability entry
            $query->whereHas('accommodations', function ($accQuery) use ($checkIn, $checkOut, $request) {
                if ($request->filled('capacity')) {
                    $accQuery->where('capacity', '>=', $request->capacity);
                }

                // Filtrar acomodações onde não existe sobreposição no intervalo [checkIn, checkOut)
                // A logic && no Postgres daterange verifica sobreposição
                $accQuery->whereDoesntHave('availability', function ($avQuery) use ($checkIn, $checkOut) {
                    $avQuery->whereRaw("daterange(start_date, end_date, '[)') && daterange(?, ?, '[)')", [$checkIn, $checkOut]);
                });
            });
        } elseif ($request->filled('capacity')) {
            // Apenas filtro de capacidade sem datas
            $query->whereHas('accommodations', function ($accQuery) use ($request) {
                $accQuery->where('capacity', '>=', $request->capacity);
            });
        }

        // Eager Load das acomodações filtradas para enviar ao frontend
        $query->with(['accommodations' => function ($accQuery) use ($request) {
            if ($request->filled('capacity')) {
                $accQuery->where('capacity', '>=', $request->capacity);
            }
        }]);

        return response()->json($query->paginate(12));
    }

    public function geoSearch(GeoSearchRequest $request, \App\Services\GeoSearchService $geoService)
    {
        $properties = $geoService->searchByBoundingBox(
            (float) $request->minLng,
            (float) $request->minLat,
            (float) $request->maxLng,
            (float) $request->maxLat
        );

        return response()->json($properties);
    }
}
