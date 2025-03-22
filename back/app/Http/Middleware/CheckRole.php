<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CheckRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @param  string  ...$roles
     * @return mixed
     */
    public function handle(Request $request, Closure $next, ...$roles)
    {
        // Récupérer l'utilisateur authentifié
        $user = Auth::user();

        // Vérifier si l'utilisateur a l'un des rôles autorisés
        $userRole = $user->role->name;

        if (!in_array($userRole, $roles)) {
            return response()->json(['message' => "Accès refusé. Seul un utilisateur avec le rôle suivant peut accéder à cette ressource : " . implode(", ", $roles)], 403);
        }

        return $next($request);
    }
}
