<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Role;

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
    public function updateRolePermissions(Request $request, $id) {
        $role = Role::findOrFail($id);

        // On s'assure que les permissions sont présentes et ne sont pas nulles
        $permissions = $request->permissions;

        if ($permissions === null) {
            return response()->json(['message' => 'Permissions cannot be null'], 400);
        }

        // Mettre à jour les permissions sous forme de booléens
        $role->update([
            'canCreate' => $request->canCreate,
            'canDelete' => $request->canDelete,
            'canComment' => $request->canComment,
            'canGrade' => $request->canGrade,
        ]);

        $role->save();

        return response()->json(['message' => 'Permissions updated successfully'], 200);
    }
}
