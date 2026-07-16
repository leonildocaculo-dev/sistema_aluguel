<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\AuditLog;

class AuditLogController extends Controller
{
    public function index()
    {
        // Administrador apenas
        $logs = AuditLog::with('user')->orderBy('created_at', 'desc')->paginate(50);
        return response()->json($logs);
    }
}
