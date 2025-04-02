<?php

namespace App\Http\Controllers;

use App\Models\RendezVous;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class RendezVousController extends Controller {
    // Create a new appointment request
    public function store(Request $request, $id) {
        Log::info('Données reçues pour le rendez-vous :', $request->all());
        $request->validate([
            'project_id' => 'required|integer|exists:projects,id',
            'date' => 'required|date',       
            'hour' => 'required|date_format:H:i', 
            'message' => 'nullable|string|max:500',
        ]);

        // Vérifier si un rendez-vous existe déjà pour cette date et heure
        $existingRendezVous = RendezVous::where('project_id', $id)
                                        ->where('date', '=', $request->input('date')) 
                                        ->where('hour', '=', $request->input('hour')) 
                                        ->exists();

        // Si un rendez-vous existe déjà, retourner une erreur
        if ($existingRendezVous) {
            return response()->json(['message' => 'Un rendez-vous existe déjà pour cette date et heure.'], 400);
        }

        Log::info('Données reçues pour création de rendez-vous:', [
            'project_id' => $id,
            'user_id' => Auth::id(),
            'date' => $request->date,
            'hour' => $request->hour,
            'message' => $request->message
        ]);
        $rendezVous = RendezVous::create([
            'project_id' => $id,
            'user_id' => Auth::id(),
            'date' => $request->date,
            'hour' => $request->hour,
            'message' => $request->message,
            'status' => 'pending',
        ]);
        
        return response()->json($rendezVous, 201);
    }

    // Retrieve all appointment requests for a project
    public function index($id) {
        $rendezVous = RendezVous::where('project_id', $id)
                                ->with('user:id,name')
                                ->get();
    
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
            'date' => 'sometimes|date|after:now', // Validate the date field
            'hour' => 'sometimes|date_format:H:i', // Validate the hour field (format HH:MM)
            'message' => 'sometimes|string|max:500',
            'status' => 'sometimes|in:pending,approved,rejected',
        ]);

        // Update the date and hour fields if present in the request
        if ($request->has('date') && $request->has('hour')) {
            $rendezVous->update([
                'date' => $request->input('date'),
                'hour' => $request->input('hour'),
            ]);
        }

        // Update other fields
        if ($request->has('message')) {
            $rendezVous->message = $request->input('message');
        }
        
        if ($request->has('status')) {
            $rendezVous->status = $request->input('status');
        }

        // Save the changes
        $rendezVous->save();

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

    //Retrieve all rendezvous for a specific project and date.
    public function getRendezVousForDate($projectId, $date)
    {
        $rendezVous = RendezVous::where('project_id', $projectId)
                                ->where('date', $date)
                                ->get();
        
        Log::info("Rendez-vous récupérés pour le projet $projectId à la date $date : ", $rendezVous->toArray());
    
        return response()->json($rendezVous);
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
