<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use App\Models\Role;

class AuthController extends Controller
{
    // Login : Vérifie les identifiants et génère un token
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required'
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Les identifiants sont incorrects.']
            ]);
        }

        // Génère un token Bearer avec un nom
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'token' => $token,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'role' => $user->role->name, // Nom du rôle de l'utilisateur
                'entreprise_id' => $user->entreprise_id,
                'permissions' => [
                    'canDelete' => $user->role->canDelete,
                    'canCreate' => $user->role->canCreate,
                    'canComment' => $user->role->canComment,
                    'canGrade' => $user->role->canGrade
                ]
            ]
        ]);
        
    }

    // Vérifie l'utilisateur actuel
    public function user(Request $request)
    {
        return response()->json($request->user());
    }

    // Déconnexion : Supprime le token
    public function logout(Request $request)
    {
        $request->user()->tokens()->delete(); // Supprime tous les tokens de l'utilisateur
        return response()->json(['message' => 'Déconnexion réussie']);
    }

    // Inscription : Crée un nouvel utilisateur
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:6|confirmed'
        ]);
    
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => bcrypt($request->password),
        ]);
    
        // Génère un token directement après l'inscription
        $token = $user->createToken('auth_token')->plainTextToken;
    
        return response()->json([
            'user' => $user,
            'token' => $token
        ], 201);
    }
    // Supprime le compte de l'utilisateur
    public function deleteAccount(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
        ]);

        $user = User::find($request->user_id);

        // Supprime tous les tokens de l'utilisateur
        $user->tokens()->delete();

        // Supprime l'utilisateur
        $user->delete();

        return response()->json(['message' => 'Compte supprimé avec succès'], 200);
    }
}
