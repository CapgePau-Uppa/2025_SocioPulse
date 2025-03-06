<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Role;
use Illuminate\Support\Facades\Log;

class RoleController extends Controller
{
/*
    public function updatePermissions(Request $request, $roleId)
    {
        $role = Role::findOrFail($roleId);
    
        // Afficher ce que Laravel reçoit pour voir si le problème vient du frontend
        //\Log::info('Permissions reçues:', $request->all());

        // Laravel pourrait interpréter des valeurs null, donc on les force à 0 si elles sont absentes
        foreach (['canDelete', 'canCreate', 'canComment', 'canGrade'] as $key) {
            if (!isset($validatedData[$key])) {
                $validatedData[$key] = false;
            }
        }
        // Convertir les valeurs en booléen pour éviter les NULL
        $validatedData = $request->validate([
            'canDelete' => 'sometimes|boolean',
            'canCreate' => 'sometimes|boolean',
            'canComment' => 'sometimes|boolean',
            'canGrade' => 'sometimes|boolean',
        ]);
    
    
        // Mise à jour du rôle
        $role->update($validatedData);
    
        return response()->json([
            'message' => "Permissions mises à jour pour le rôle '{$role->name}'",
            'role' => $role
        ]);
    }
*/

/*  
    public function updatePermissions(Request $request, $roleId)
    {
        $role = Role::findOrFail($roleId);

        // Validate incoming data
        $validatedData = $request->validate([
            'canDelete' => 'boolean',
            'canCreate' => 'boolean',
            'canComment' => 'boolean',
            'canGrade' => 'boolean',
        ]);

        // Update role permissions
        $role->update($validatedData);


        foreach (['canCreate', 'canDelete', 'canComment', 'canGrade'] as $key) {
            if (!isset($validatedData[$key])) {
                $validatedData[$key] = false;
            }
        }

        $role->update([
            'canCreate' => $request->canCreate,
            'canDelete' => $request->canDelete,
            'canComment' => $request->canComment,
            'canGrade' => $request->canGrade,
        ]);

        $role->save();

        return response()->json([
            'message' => "Permissions mises à jour pour le rôle '{$role->name}'",
            'role' => $role
        ]);
    }
*/

    public function updatePermissions(Request $request, $roleId)
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