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
    // Login: Check credentials and generate a token
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required'
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Invalid credentials.']
            ]);
        }

        // Generate a Bearer token with a name
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'token' => $token,
            'user' => [
                'id' => $user->id,
                'email' => $user->email,
                'name' => $user->name,
                'role' => $user->role->name,
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

    // Check the current authenticated user
    public function user(Request $request)
    {
        return response()->json($request->user());
    }

    // Logout: Delete the token
    public function logout(Request $request)
    {
        $request->user()->tokens()->delete(); // Delete all tokens for the user
        return response()->json(['message' => 'Successfully logged out']);
    }

    // Register: Create a new user
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

        // Generate a token immediately after registration
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token
        ], 201);
    }

    // Delete the user's account
    public function deleteAccount(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
        ]);

        $user = User::find($request->user_id);

        // Delete all tokens for the user
        $user->tokens()->delete();

        // Delete the user
        $user->delete();

        return response()->json(['message' => 'Account successfully deleted'], 200);
    }

    public function upgradeAccount(Request $request)
    {
        // Validate incoming data
        $request->validate([
            'type' => 'required|in:collectivity,enterprise',
            'details' => 'required|array',
            'details.companyName' => 'required_if:type,enterprise|string',
            'details.siren' => 'required_if:details.companyName,Autre|string',
            'details.companyType' => 'required_if:details.companyName,Autre|string',
            'details.department' => 'required_if:type,collectivity|string',
            'details.city' => 'required_if:type,collectivity|string',
        ]);

        // Find the user by ID
        $user = User::find($request->user_id);
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        // Change the user's role
        $roleId = ($request->type === 'collectivity') ? 3 : 4; // 3 for collectivity, 4 for enterprise
        $user->role_id = $roleId;

        // Handle enterprise-related data
        if ($request->type === 'enterprise') {
            // If the company is new, create a new one
            if ($request->details['companyName'] === 'Autre') {
                try {
                    // Create a new enterprise with name, siren and type
                    $entreprise = Entreprise::create([
                        'siren' => $request->details['siren'],
                        'nom' => $request->details['companyName'],
                        'type_entreprise' => $request->details['companyType']
                    ]);

                    // Log to confirm the enterprise was created
                    \Log::info('New enterprise created: ', $entreprise->toArray());

                    // Assign the enterprise to the user
                    $user->entreprise_id = $entreprise->id;
                } catch (\Exception $e) {
                    // In case of error, log the exception
                    \Log::error('Error while creating the enterprise: ', ['error' => $e->getMessage()]);
                    return response()->json(['message' => 'Error while creating the enterprise'], 500);
                }
            } else {
                // If the enterprise already exists, link it to the user
                $entreprise = Entreprise::where('nom', $request->details['companyName'])->first();
                if ($entreprise) {
                    $user->entreprise_id = $entreprise->id;
                } else {
                    return response()->json(['message' => 'Enterprise not found'], 404);
                }
            }
        } else {
            // If type is Collectivity, no enterprise to associate
            $user->entreprise_id = null;
        }

        // Save the user with updated role and associated enterprise
        try {
            $user->save();
        } catch (\Exception $e) {
            // In case of error while saving the user
            \Log::error('Error while saving the user: ', ['error' => $e->getMessage()]);
            return response()->json(['message' => 'Error while updating the user'], 500);
        }

        return response()->json([
            'message' => 'Account successfully updated',
            'user' => $user
        ], 200);
    }
}
