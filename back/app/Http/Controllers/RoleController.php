<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Role;
use App\Models\Permission;

class RoleController extends Controller
{

    /**
     * Assign a permission to a role.
     *
     * @param \Illuminate\Http\Request $request The request instance containing the permission name.
     * @param int $roleId The ID of the role to which the permission will be assigned.
     * @return \Illuminate\Http\JsonResponse A JSON response indicating the result of the operation.
     */
    public function assignPermission(Request $request, $roleId)
    {
        $role = Role::findOrFail($roleId);
        $permission = Permission::where('name', $request->permission)->first();

        if (!$permission) {
            return response()->json(['message' => 'Permission introuvable'], 404);
        }

        $role->permissions()->attach($permission->id);

        return response()->json(['message' => "Permission '{$permission->name}' ajoutée au rôle '{$role->name}'"]);
    }

    /**
     * Remove a permission from a role.
     *
     * @param \Illuminate\Http\Request $request The HTTP request instance.
     * @param int $roleId The ID of the role from which the permission will be removed.
     * @return \Illuminate\Http\JsonResponse The JSON response indicating the result of the operation.
     */
    public function removePermission(Request $request, $roleId)
    {
        $role = Role::findOrFail($roleId);
        $permission = Permission::where('name', $request->permission)->first();

        if (!$permission) {
            return response()->json(['message' => 'Permission introuvable'], 404);
        }

        $role->permissions()->detach($permission->id);

        return response()->json(['message' => "Permission '{$permission->name}' retirée du rôle '{$role->name}'"]);
    }
}