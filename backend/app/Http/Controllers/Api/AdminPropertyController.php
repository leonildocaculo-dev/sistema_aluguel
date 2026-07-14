<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Property;
use App\Models\AuditLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminPropertyController extends Controller
{
    public function index()
    {
        // Admin vê todas, pendentes primeiro
        $properties = Property::with(['owner', 'images'])->orderBy('status', 'desc')->paginate(20);
        return response()->json($properties);
    }

    public function approve(Request $request, $id)
    {
        $property = Property::findOrFail($id);
        
        DB::transaction(function () use ($property, $request) {
            $oldStatus = $property->status;
            $property->update(['status' => 'approved']);

            AuditLog::create([
                'user_id' => $request->user()->id,
                'action' => 'approved_property',
                'model_type' => Property::class,
                'model_id' => $property->id,
                'old_values' => ['status' => $oldStatus],
                'new_values' => ['status' => 'approved'],
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
            ]);
        });

        return response()->json(['message' => 'Propriedade aprovada com sucesso.']);
    }

    public function reject(Request $request, $id)
    {
        $property = Property::findOrFail($id);
        
        DB::transaction(function () use ($property, $request) {
            $oldStatus = $property->status;
            $property->update(['status' => 'rejected']);

            AuditLog::create([
                'user_id' => $request->user()->id,
                'action' => 'rejected_property',
                'model_type' => Property::class,
                'model_id' => $property->id,
                'old_values' => ['status' => $oldStatus],
                'new_values' => ['status' => 'rejected'],
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
            ]);
        });

        return response()->json(['message' => 'Propriedade rejeitada.']);
    }
}
