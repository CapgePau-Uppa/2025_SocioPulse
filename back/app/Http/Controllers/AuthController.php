<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Entreprise;
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
                'email' => $user->email,
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

    public function upgradeAccount(Request $request)
    {
        // Valider les données envoyées
        $request->validate([
            'type' => 'required|in:collectivity,enterprise',
            'details' => 'required|array',
            'details.companyName' => 'required_if:type,enterprise|string',
            'details.siren' => 'required_if:details.companyName,Autre|string',
            'details.companyType' => 'required_if:details.companyName,Autre|string',
            'details.department' => 'required_if:type,collectivity|string',
            'details.city' => 'required_if:type,collectivity|string',
        ]);
    
        // Trouver l'utilisateur par ID
        $user = User::find($request->user_id);
        if (!$user) {
            return response()->json(['message' => 'Utilisateur non trouvé'], 404);
        }
    
        // Modifier le rôle de l'utilisateur
        $roleId = ($request->type === 'collectivity') ? 3 : 4; // 3 pour collectivité, 4 pour entreprise
        $user->role_id = $roleId;
    
        // Gérer les informations liées à l'entreprise
        if ($request->type === 'enterprise') {
            // Si l'entreprise est nouvelle, créer une nouvelle entreprise
            if ($request->details['companyName'] === 'Autre') {
                try {
                    // Créer une nouvelle entreprise avec le nom, le siren et le type
                    $entreprise = Entreprise::create([
                        'siren' => $request->details['siren'],
                        'nom' => $request->details['companyName'],
                        'type_entreprise' => $request->details['companyType']
                    ]);
                    
                    // Log pour voir si l'entreprise a bien été créée
                    \Log::info('Nouvelle entreprise créée: ', $entreprise->toArray());
    
                    // Assigner l'entreprise à l'utilisateur
                    $user->entreprise_id = $entreprise->id;
                } catch (\Exception $e) {
                    // En cas d'erreur, logguer l'exception
                    \Log::error('Erreur lors de la création de l\'entreprise: ', ['error' => $e->getMessage()]);
                    return response()->json(['message' => 'Erreur lors de la création de l\'entreprise'], 500);
                }
            } else {
                // Si l'entreprise existe déjà, associer l'ID de l'entreprise à l'utilisateur
                $entreprise = Entreprise::where('nom', $request->details['companyName'])->first();
                if ($entreprise) {
                    $user->entreprise_id = $entreprise->id;
                } else {
                    return response()->json(['message' => 'Entreprise non trouvée'], 404);
                }
            }
        } else {
            // Si le type est Collectivité, pas d'entreprise à associer
            $user->entreprise_id = null;
        }
    
        // Sauvegarder l'utilisateur avec son nouveau rôle et l'entreprise associée
        try {
            $user->save();
        } catch (\Exception $e) {
            // En cas d'erreur lors de la sauvegarde de l'utilisateur
            \Log::error('Erreur lors de la sauvegarde de l\'utilisateur: ', ['error' => $e->getMessage()]);
            return response()->json(['message' => 'Erreur lors de la mise à jour de l\'utilisateur'], 500);
        }
    
        return response()->json([
            'message' => 'Compte mis à jour avec succès',
            'user' => $user
        ], 200);
    }
    


}
