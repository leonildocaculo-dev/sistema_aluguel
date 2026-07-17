<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class IpWhitelistMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     * @param  string  $gateway  The gateway name (e.g. proxypay, gpo)
     */
    public function handle(Request $request, Closure $next, string $gateway = ''): Response
    {
        // Se estivermos em ambiente de desenvolvimento ou testes, ignoramos a verificação
        // a menos que estejamos explicitamente testando isso.
        if (app()->environment('local', 'testing') && !env('FORCE_IP_WHITELIST', false)) {
            return $next($request);
        }

        // Obtém o IP do cliente (considerando proxies/load balancers se os TrustedProxies estiverem configurados corretamente)
        $clientIp = $request->ip();

        // Determina a variável de ambiente baseada no gateway (se passado via alias no roteador)
        // O Laravel 11 passa parâmetros de middleware a seguir ao nome (ex: ip.whitelist:proxypay)
        // Se não for passado um gateway pelo middleware, tenta descobrir a partir da rota
        if (empty($gateway)) {
            $gateway = $request->route('gateway') ?? 'default';
        }
        
        // Tenta obter as IPs a partir das configurações (config/payments.php)
        $configKey = "payments.{$gateway}.allowed_ips";
        $allowedIpsString = config($configKey);

        if (empty($allowedIpsString)) {
            // Tenta ver se a variável de ambiente existe diretamente (fallback)
            $envKey = strtoupper($gateway) . '_ALLOWED_IPS';
            $allowedIpsString = env($envKey);
        }

        if (empty($allowedIpsString)) {
            // Se a whitelist estiver vazia/não configurada para este gateway, podemos bloquear por segurança
            // ou permitir dependendo das políticas corporativas. Neste caso bloqueamos.
            abort(403, 'Acesso bloqueado: Whitelist de IPs não configurada para este gateway.');
        }

        $allowedIps = array_map('trim', explode(',', $allowedIpsString));

        if (!in_array($clientIp, $allowedIps)) {
            \Log::warning("Tentativa de acesso bloqueada por IP Whitelist.", [
                'ip' => $clientIp,
                'gateway' => $gateway,
                'url' => $request->fullUrl()
            ]);
            abort(403, 'Acesso negado.');
        }

        return $next($request);
    }
}
