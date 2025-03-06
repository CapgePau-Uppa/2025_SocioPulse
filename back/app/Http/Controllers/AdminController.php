<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Role;
use Illuminate\Support\Facades\Log;

class AdminController extends Controller
{
    // Récupérer tous les rôles avec leurs permissions intégrées
    public function getRoles() {
        return response()->json(Role::all());
    }

    public function getPermissions($roleId) {
        // Récupérer le rôle avec l'ID spécifié
        $role = Role::findOrFail($roleId);
    
        // Extraire toutes les permissions sous forme de tableau
        $permissions = [];
    
        // Vérifier chaque permission pour savoir si elle est activée
        $permissions['canCreate'] = $role->canCreate;
        $permissions['canDelete'] = $role->canDelete;
        $permissions['canComment'] = $role->canComment;
        $permissions['canGrade'] = $role->canGrade;
    
        return response()->json([
            'role' => $role->name,
            'permissions' => $permissions
        ]);
    }
    

    // Récupérer tous les utilisateurs avec leur rôle associé
    public function getUsers() {
        return response()->json(User::with('role')->get());
    }

    // Mettre à jour le rôle d'un utilisateur
    public function updateUserRole(Request $request, $id) {
        $user = User::findOrFail($id);
        $role = Role::findOrFail($request->role_id);

        $user->role_id = $role->id;
        $user->save();

        return response()->json(['message' => 'Rôle mis à jour avec succès']);
    }

    // Mettre à jour les permissions d'un rôle
    public function updateRolePermissions(Request $request, $roleId)
    {
        $role = Role::findOrFail($roleId);

        // Vérification de ce que Laravel reçoit
        Log::info('Permissions reçues:', $request->all());

        // Extraction des permissions depuis le tableau
        $permissions = $request->input('permissions', []);
        $validatedData = [
            'canCreate' => $permissions[0] ?? false,
            'canDelete' => $permissions[1] ?? false,
            'canComment' => $permissions[2] ?? false,
            'canGrade' => $permissions[3] ?? false,
        ];

        // Vérification après extraction
        Log::info('Données validées avant update:', $validatedData);

        // Mise à jour du rôle
        $role->update($validatedData);

        return response()->json([
            'message' => "Permissions mises à jour pour le rôle '{$role->name}'",
            'role' => $role
        ]);
    }

}
