<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Hash;


class AuthController extends Controller
{
    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');

        
        if (Auth::attempt($credentials)) {
            $user = Auth::user();
            return response()->json(['token' => $user->createToken('socioPulse')->plainTextToken, 'user_id' => $user->id, 'name' => $user->name], 200);
        }

        return response()->json(['message' => 'Tu fais quoi là ?'], 401);
    }

    public function register(Request $request){
        $request->validate([
            'email' => 'required|string|email|unique:users',
            'name' => 'required|string|max:255',
            'password' => 'required|string|min:6',
        ]); 

        $user = User::create([
            'email' => $request->email,
            'name' => $request->name,
            'password' => Hash::make($request->password)
        ]);
        return response()->json([
            'message' => 'Utilisateur créé avec succès',
            'user' => $user
        ], 201);
    }
}