<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CheckCitoyenRole
{
    public function handle(Request $request, Closure $next)
    {
        // Récupérer l'utilisateur authentifié
        $user = Auth::user();

        // Vérifier si l'utilisateur a le rôle "citoyen"
        if ($user->role->name !== 'citoyen') {
            return response()->json(['message' => 'Accès refusé. Seul un citoyen peut accéder à cette ressource.'], 403);
        }

        return $next($request);
    }
}
