<?php

namespace App\Http\Controllers;

use App\Models\RendezVous;
use App\Models\Project;
use App\Models\Notification;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class RendezVousController extends Controller {
    // Create a new appointment request
    public function store(Request $request, $id) {
        Log::info('Data received for appointment:', $request->all());

        $request->validate([
            'project_id' => 'required|integer|exists:projects,id',
            'date' => 'required|date',
            'hour' => 'required|date_format:H:i',
            'message' => 'nullable|string|max:500',
        ]);

        // Check if an appointment already exists for this date and time
        $existingRendezVous = RendezVous::where('project_id', $id)
            ->where('date', '=', $request->input('date'))
            ->where('hour', '=', $request->input('hour'))
            ->exists();

        // If an appointment already exists, return an error
        if ($existingRendezVous) {
            return response()->json(['message' => 'An appointment already exists for this date and time.'], 400);
        }

        Log::info('Data received for appointment creation:', [
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

        // Récupérer le projet et l'utilisateur
        $project = Project::findOrFail($id);
        $user = Auth::user();

        // Créer des notifications pour les propriétaires du projet
        $projectOwners = User::where('entreprise_id', $project->entreprise_id)->get();

        foreach ($projectOwners as $owner) {
            Notification::create([
                'user_id' => $owner->id,
                'message' => "Nouvelle demande de rendez-vous pour le projet '{$project->name}' par {$user->name} le {$request->date} à {$request->hour}",
                'read' => false,
                'link' => "/projects/{$project->id}/rendez-vous"
            ]);
        }

        return response()->json($rendezVous, 201);
    }

    // Accept an appointment request
    public function accept($id)
    {
        $rendezVous = RendezVous::findOrFail($id);
        $user = Auth::user();

        // Log the user's role
        Log::info('User role: ' . $user->role->name);

        // Only administrator or enterprise can approve
        if ($user->role->name !== 'administrator' && $user->role->name !== 'entreprise') {
            return response()->json([
                'message' => 'Unauthorized',
                'role' => $user->role->name
            ], 403);
        }

        $rendezVous->status = 'approved';
        $rendezVous->save();

        // Récupérer le projet pour les notifications
        $project = Project::findOrFail($rendezVous->project_id);

        // Créer une notification pour l'utilisateur dont le rendez-vous a été accepté
        Notification::create([
            'user_id' => $rendezVous->user_id,
            'message' => "Votre demande de rendez-vous pour le projet '{$project->name}' le {$rendezVous->date} à {$rendezVous->hour} a été acceptée",
            'read' => false,
            'link' => "/projects/{$project->id}/rendez-vous"
        ]);

        return response()->json([
            'message' => 'Appointment accepted',
            'role' => $user->role->name
        ]);
    }

    // Reject an appointment request
    public function reject($id)
    {
        $rendezVous = RendezVous::findOrFail($id);
        $user = Auth::user();

        if ($user->role->name !== 'administrator' && $user->role->name !== 'entreprise') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $rendezVous->status = 'rejected';
        $rendezVous->save();

        // Récupérer le projet pour les notifications
        $project = Project::findOrFail($rendezVous->project_id);

        // Créer une notification pour l'utilisateur dont le rendez-vous a été rejeté
        Notification::create([
            'user_id' => $rendezVous->user_id,
            'message' => "Votre demande de rendez-vous pour le projet '{$project->name}' le {$rendezVous->date} à {$rendezVous->hour} a été rejetée",
            'read' => false,
            'link' => "/projects/{$project->id}/rendez-vous"
        ]);

        return response()->json(['message' => 'Appointment rejected', 'role' => $user->role->name]);
    }

    // N'oubliez pas d'ajouter le use pour le modèle Notification en haut du fichier
}