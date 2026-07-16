<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdminMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Check if user is authenticated and is admin (role_id === 1)
        if (!$request->user() || $request->user()->role_id !== 1) {
            return response()->json([
                'message' => 'Acesso negado. Apenas administradores podem executar esta acao.'
            ], 403);
        }

        return $next($request);
    }
}
