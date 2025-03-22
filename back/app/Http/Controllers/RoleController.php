<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Role;
use Illuminate\Support\Facades\Log;

class RoleController extends Controller
{

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