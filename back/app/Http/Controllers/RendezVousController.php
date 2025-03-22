<?php

namespace App\Http\Controllers;

use App\Models\RendezVous;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class RendezVousController extends Controller {
    // Create a new appointment request
    public function store(Request $request, $id) {
        $request->validate([
            'date_heure' => 'required|date|after:now',
            'message' => 'nullable|string|max:500',
        ]);

        $rendezVous = RendezVous::create([
            'project_id' => $id,
            'user_id' => Auth::id(),
            'date_heure' => $request->date_heure,
            'message' => $request->message,
            'status' => 'pending',
        ]);

        return response()->json($rendezVous, 201);
    }

    // Retrieve all appointment requests for a project
    public function index($id) {
        $rendezVous = RendezVous::where('project_id', $id)->get();
        return response()->json($rendezVous);
    }

    // Update an appointment request (modify date/message or approve/reject)
    public function update(Request $request, $id) {
        $rendezVous = RendezVous::findOrFail($id);
        $user = Auth::user();

        // Check if the user is authorized to update
        if ($user->role !== 'administrator' && $rendezVous->user_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Validate update fields
        $request->validate([
            'date_heure' => 'sometimes|date|after:now',
            'message' => 'sometimes|string|max:500',
            'status' => 'sometimes|in:pending,approved,rejected',
        ]);

        $rendezVous->update($request->only(['date_heure', 'message', 'status']));

        return response()->json($rendezVous);
    }
    public function accept($id)
    {
        $rendezVous = RendezVous::findOrFail($id);
        $user = Auth::user();
    
        // Affichage du rôle dans les logs Laravel
        Log::info('Utilisateur avec le rôle : ' . $user->role->name);
    
        // Correction de la condition (&& au lieu de ||)
        if ($user->role->name !== 'administrator' && $user->role->name !== 'entreprise') {
            return response()->json([
                'message' => 'Non autorisé',
                'role' => $user->role->name // Ajout du rôle dans la réponse JSON
            ], 403);
        }
    
        $rendezVous->status = 'approved';
        $rendezVous->save();
    
        return response()->json([
            'message' => 'Rendez-vous accepté',
            'role' => $user->role->name // Ajout du rôle dans la réponse JSON
        ]);
    }
    
    public function reject($id)
    {
        $rendezVous = RendezVous::findOrFail($id);
        $user = Auth::user();

        if ($user->role->name !== 'entreprise' || $user->role->name !== 'administrator') {
            return response()->json(['message' => 'Non autorisé'], 403);
        }
    
        $rendezVous->status = 'rejected';
        $rendezVous->save();
    
        return response()->json(['message' => 'Rendez-vous refusé']);
    }
    
    // Cancel (delete) an appointment request
    public function destroy($id) {
        $rendezVous = RendezVous::findOrFail($id);
        $user = Auth::user();

        // Check if the user is authorized to delete
        if ($user->role !== 'administrator' && $rendezVous->user_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $rendezVous->delete();

        return response()->json(['message' => 'Appointment request deleted']);
    }
}
