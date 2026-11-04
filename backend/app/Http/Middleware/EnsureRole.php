<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureRole
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next, string ...$perfis): Response
    {
        $usuario = $request->user();

        if (! $usuario) {
            abort(401);
        }

        if (! in_array($usuario->role, $perfis, true)) {
            abort(403, 'Acesso negado.');
        }

        return $next($request);
    }
}
