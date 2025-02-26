<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CheckCommunauteRole
{
    public function handle(Request $request, Closure $next)
    {
        // Récupérer l'utilisateur authentifié
        $user = Auth::user();
        
        // Vérifier si l'utilisateur a le rôle "communaute"
        if ($user->role->name !== 'communaute') {
            return response()->json(['message' => 'Accès refusé. Seule une communauté peut accéder à cette ressource.'], 403);
        }

        return $next($request);
    }
}
