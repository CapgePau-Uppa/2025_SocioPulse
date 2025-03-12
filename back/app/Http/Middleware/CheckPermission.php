<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Role; // Si tu utilises un modèle Role, par exemple.
use App\Models\Permission; // Vérifie que tu importes le modèle correctement.
use App\Models\User;

class CheckPermission
{
    /**
     * Handle an incoming request and check for the specified permission.
     *
     * @param \Illuminate\Http\Request $request
     * @param \Closure $next
     * @param string $permission
     */
    public function handle(Request $request, Closure $next, $permission = null)
    {
        // Récupérer l'utilisateur authentifié
        $user = Auth::user();      

        // On récupère le rôle de l'utilisateur
        $role = $user->role;

        // Vérifier si le rôle possède un attribut correspondant à la permission et si la permission est activée (true)
        if (isset($role->$permission) && ($role->$permission)) {
            return $next($request);
        }

        // Si l'utilisateur n'a pas la permission, on retourne une réponse d'accès refusé
        return response()->json(['message' => 'Accès interdit, permission insuffisante'], 403);
    }
}