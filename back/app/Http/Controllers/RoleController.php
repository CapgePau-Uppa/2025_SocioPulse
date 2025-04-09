<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Role;
use Illuminate\Support\Facades\Log;

class RoleController extends Controller
{
    // Update permissions for a given role
    public function updatePermissions(Request $request, $roleId)
    {
        // Find the role or fail if not found
        $role = Role::findOrFail($roleId);

        // Log the raw permissions received in the request
        Log::info('Permissions received:', $request->all());

        // Extract individual permissions from the array (with defaults)
        $permissions = $request->input('permissions', []);
        $validatedData = [
            'canCreate' => $permissions[0] ?? false,
            'canDelete' => $permissions[1] ?? false,
            'canComment' => $permissions[2] ?? false,
            'canGrade' => $permissions[3] ?? false,
        ];

        // Log the validated data before updating
        Log::info('Validated data before update:', $validatedData);

        // Update the role with new permissions
        $role->update($validatedData);

        // Return confirmation response
        return response()->json([
            'message' => "Permissions updated for role '{$role->name}'",
            'role' => $role
        ]);
    }
}
