<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class FeatureFlagController extends Controller
{
    /**
     * Retorna a lista de funcionalidades ativas no sistema para monitorização.
     * Seguro para exposição ao Admin (não revela chaves ou passwords).
     */
    public function index(Request $request)
    {
        $features = config('features');
        
        // Assegurar que nenhum valor env/sensível seja acidentalmente retornado
        // Embora config('features') só devesse conter booleanos.
        
        $flattened = $this->flattenArray($features);

        // Mapear apenas tipos booleanos explícitos para garantir que não vazam strings (como secrets em .env que se misturem)
        $safeFeatures = array_map(function ($value) {
            return (bool) $value;
        }, $flattened);

        return response()->json([
            'environment' => app()->environment(),
            'debug_mode' => config('app.debug'),
            'features' => $safeFeatures,
            'timestamp' => now()->toIso8601String()
        ]);
    }

    /**
     * Transforma array multidimensional num array unidimensional de chaves "ponto".
     * Ex: ['payments' => ['proxypay' => true]] -> ['payments.proxypay' => true]
     */
    private function flattenArray(array $array, string $prefix = ''): array
    {
        $result = [];
        foreach ($array as $key => $value) {
            $newKey = $prefix === '' ? $key : $prefix . '.' . $key;
            if (is_array($value)) {
                $result = array_merge($result, $this->flattenArray($value, $newKey));
            } else {
                $result[$newKey] = $value;
            }
        }
        return $result;
    }
}
