<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Property;

class FavoriteController extends Controller
{
    public function index(Request $request)
    {
        $favorites = $request->user()->favorites()->with(['property.images', 'property.accommodations', 'property.owner'])->get();
        return response()->json(['data' => $favorites->pluck('property')]);
    }

    public function toggle(Request $request, $propertyId)
    {
        $user = $request->user();
        $property = Property::findOrFail($propertyId);

        $favorite = $user->favorites()->where('property_id', $property->id)->first();

        if ($favorite) {
            $favorite->delete();
            return response()->json(['message' => 'Removido dos favoritos', 'status' => 'removed']);
        } else {
            $user->favorites()->create(['property_id' => $property->id]);
            return response()->json(['message' => 'Adicionado aos favoritos', 'status' => 'added']);
        }
    }

    public function listIds(Request $request)
    {
        $ids = $request->user()->favorites()->pluck('property_id');
        return response()->json(['data' => $ids]);
    }
}
