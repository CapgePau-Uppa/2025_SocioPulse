<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Role;
use Illuminate\Support\Facades\Log;

class AdminController extends Controller
{
    // Retrieve all roles with their embedded permissions
    public function getRoles() {
        return response()->json(Role::all());
    }

    public function getPermissions($roleId) {
        // Retrieve the role with the specified ID
        $role = Role::findOrFail($roleId);
    
        // Extract all permissions as an array
        $permissions = [];
    
        // Check each permission to see if it's enabled
        $permissions['canCreate'] = $role->canCreate;
        $permissions['canDelete'] = $role->canDelete;
        $permissions['canComment'] = $role->canComment;
        $permissions['canGrade'] = $role->canGrade;
    
        return response()->json([
            'role' => $role->name,
            'permissions' => $permissions
        ]);
    }

    // Retrieve all users with their associated roles
    public function getUsers() {
        return response()->json(User::with('role')->get());
    }

    // Update a user's role
    public function updateUserRole(Request $request, $id) {
        $user = User::findOrFail($id);
        $role = Role::findOrFail($request->role_id);

        $user->role_id = $role->id;
        $user->save();

        return response()->json(['message' => 'Role updated successfully']);
    }

    // Update the permissions of a role
    public function updateRolePermissions(Request $request, $roleId)
    {
        $role = Role::findOrFail($roleId);

        // Check what Laravel receives
        Log::info('Received permissions:', $request->all());

        // Extract permissions from the array
        $permissions = $request->input('permissions', []);
        $validatedData = [
            'canCreate' => $permissions[0] ?? false,
            'canDelete' => $permissions[1] ?? false,
            'canComment' => $permissions[2] ?? false,
            'canGrade' => $permissions[3] ?? false,
        ];

        // Check after extraction
        Log::info('Validated data before update:', $validatedData);

        // Update the role
        $role->update($validatedData);

        return response()->json([
            'message' => "Permissions updated for role '{$role->name}'",
            'role' => $role
        ]);
    }

}
