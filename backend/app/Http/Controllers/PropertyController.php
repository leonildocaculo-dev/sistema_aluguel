<?php

namespace App\Http\Controllers;

use App\Models\Property;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;

class PropertyController extends Controller
{
    // Cliente/Público: Listar propriedades aprovadas
    public function index(Request $request)
    {
        $query = Property::with(['images', 'accommodations'])->where('status', 'approved');

        // Pesquisa simples por localização/preço (para usar os índices compostos)
        if ($request->has('province')) {
            $query->where('province', $request->province);
        }
        if ($request->has('municipality')) {
            $query->where('municipality', $request->municipality);
        }
        if ($request->has('max_price')) {
            $query->where('price_per_night', '<=', $request->max_price);
        }

        // Paginação obrigatória conforme SKILL.md
        return response()->json($query->paginate(15));
    }

    // Proprietário: Listar as suas próprias propriedades
    public function myProperties(Request $request)
    {
        $properties = $request->user()->properties()->with('images')->paginate(15);
        return response()->json($properties);
    }

    // Proprietário: Criar propriedade
    public function store(Request $request)
    {
        // Regras base
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'province' => 'required|string',
            'municipality' => 'required|string',
            'address' => 'required|string',
            'price_per_night' => 'required|numeric|min:0',
            'images' => 'required|array|min:1',
            'images.*' => 'image|mimes:jpeg,png,jpg,webp|max:2048', // 2MB max, MIME real validado pelo Laravel
        ]);

        DB::beginTransaction();
        try {
            $property = $request->user()->properties()->create([
                'name' => $request->name,
                'description' => $request->description,
                'province' => $request->province,
                'municipality' => $request->municipality,
                'address' => $request->address,
                'price_per_night' => $request->price_per_night,
                'status' => 'pending', // Requer aprovação do admin
            ]);

            // Upload de imagens para S3 (Cloudflare R2)
            $isPrimary = true;
            foreach ($request->file('images') as $image) {
                // 's3' driver configurado no .env aponta para o Cloudflare R2
                $path = $image->store('properties/' . $property->id, 's3');
                
                $property->images()->create([
                    'path' => Storage::disk('s3')->url($path),
                    'is_primary' => $isPrimary,
                ]);
                $isPrimary = false; // Só a primeira é primária
            }

            DB::commit();

            return response()->json(['message' => 'Propriedade criada e aguarda aprovação administrativa.', 'property' => $property->load('images')], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Erro ao criar propriedade.', 'error' => $e->getMessage()], 500);
        }
    }

    // Cliente/Público: Ver detalhes da propriedade
    public function show($id)
    {
        $property = Property::with(['images', 'accommodations'])->where('status', 'approved')->findOrFail($id);
        return response()->json($property);
    }
}
