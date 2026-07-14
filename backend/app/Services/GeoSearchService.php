<?php

namespace App\Services;

use App\Models\Property;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;

class GeoSearchService
{
    /**
     * Pesquisa propriedades contidas num Bounding Box (janela visível do mapa)
     */
    public function searchByBoundingBox(float $minLng, float $minLat, float $maxLng, float $maxLat)
    {
        $cacheKey = "geo_search_bbox_{$minLng}_{$minLat}_{$maxLng}_{$maxLat}";

        return Cache::remember($cacheKey, 1800, function () use ($minLng, $minLat, $maxLng, $maxLat) {
            return Property::with(['images', 'accommodations'])
                ->whereNotNull('latitude')
                ->whereNotNull('longitude')
                ->whereBetween('latitude', [$minLat, $maxLat])
                ->whereBetween('longitude', [$minLng, $maxLng])
                ->get();
        });
    }

    /**
     * Pesquisa propriedades num raio de X km a partir de um ponto usando a Fórmula Haversine
     */
    public function searchByRadius(float $lng, float $lat, int $radiusKm)
    {
        $cacheKey = "geo_search_radius_{$lng}_{$lat}_{$radiusKm}";

        return Cache::remember($cacheKey, 1800, function () use ($lng, $lat, $radiusKm) {
            // Fórmula Haversine bruta em SQL para Postgres/MySQL/SQLite
            $haversine = "(6371 * acos(cos(radians(?)) * cos(radians(latitude)) * cos(radians(longitude) - radians(?)) + sin(radians(?)) * sin(radians(latitude))))";

            return Property::with(['images', 'accommodations'])
                ->whereNotNull('latitude')
                ->whereNotNull('longitude')
                ->selectRaw("*, {$haversine} AS distance", [$lat, $lng, $lat])
                ->having('distance', '<=', $radiusKm)
                ->orderBy('distance')
                ->get();
        });
    }
}
