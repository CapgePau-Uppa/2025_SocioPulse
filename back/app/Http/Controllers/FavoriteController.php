<?php

namespace App\Http\Controllers;

use App\Models\Favorite;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class FavoriteController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $favorites = $user->favorites()->with('project')->get();
        return response()->json($favorites);
    }

    public function store(Request $request)
    {
        $request->validate([
            'project_id' => 'required|exists:projects,id',
        ]);

        $user = Auth::user();
        $favorite = Favorite::firstOrCreate([
            'user_id' => $user->id,
            'project_id' => $request->project_id,
        ]);

        return response()->json($favorite, 201);
    }

    public function destroy(Favorite $favorite)
    {
        $user = Auth::user();

        if ($favorite->user_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $favorite->delete();
        return response()->json(['message' => 'Favorite deleted successfully']);
    }
}

