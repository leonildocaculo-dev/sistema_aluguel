<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class OwnerMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // 1 = Admin, 2 = Owner
        // Admins can also manage properties if needed, but primarily 2 is Owner
        if (!$request->user() || !in_array($request->user()->role_id, [1, 2])) {
            return response()->json([
                'message' => 'Acesso negado. Apenas proprietarios podem executar esta acao.'
            ], 403);
        }

        if (!$request->user()->isVerifiedOwner()) {
            return response()->json([
                'message' => 'Conta não verificada. Por favor, conclua o processo de KYC enviando o seu documento de identidade para poder listar propriedades.'
            ], 403);
        }

        return $next($request);
    }
}
