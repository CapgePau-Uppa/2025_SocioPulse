<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CheckAdminRole
{
    public function handle(Request $request, Closure $next)
    {
        // Récupérer l'utilisateur authentifié
        $user = Auth::user();
        
        // Vérifier si l'utilisateur a le rôle "admin"
        if ($user->role->name !== 'administrator') {
            return response()->json(['message' => 'Accès refusé. Seul un administrateur peut accéder à cette ressource.'], 403);
        }

        return $next($request);
    }
}
