<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CheckEntrepriseRole
{
    public function handle(Request $request, Closure $next)
    {
        // Récupérer l'utilisateur authentifié
        $user = Auth::user();

        // Vérifier si l'utilisateur a un rôle "entreprise"
        if ($user->role->name !== 'entreprise') {
            return response()->json(['message' => 'Accès refusé. Seules les entreprises peuvent créer des projets.'], 403);
        }

        return $next($request);
    }
}