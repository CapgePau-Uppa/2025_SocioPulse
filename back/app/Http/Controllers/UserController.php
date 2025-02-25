<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Role;

class UserController extends Controller
{
    /**
     * Assign a role to a user.
     *
     * @param \Illuminate\Http\Request $request The request instance containing the role name.
     * @param int $userId The ID of the user to whom the role will be assigned.
     */
    public function assignRole(Request $request, $userId)
    {
        $user = User::findOrFail($userId);
        $role = Role::where('name', $request->role)->first();
    
        if (!$role) {
            return response()->json(['message' => 'Rôle introuvable'], 404);
        }
    
        $user->roles()->attach($role->id);
    
        return response()->json(['message' => "Rôle '{$role->name}' attribué à '{$user->name}'"]);
    }
    
    /**
     * Remove a role from a user.
     *
     * @param \Illuminate\Http\Request $request The request instance containing the role to be removed.
     * @param int $userId The ID of the user from whom the role will be removed.
     */
    public function removeRole(Request $request, $userId)
    {
        $user = User::findOrFail($userId);
        $role = Role::where('name', $request->role)->first();
    
        if (!$role) {
            return response()->json(['message' => 'Rôle introuvable'], 404);
        }
    
        $user->roles()->detach($role->id);
    
        return response()->json(['message' => "Rôle '{$role->name}' retiré de '{$user->name}'"]);
    }
    
}
