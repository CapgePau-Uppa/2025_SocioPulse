<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\Http\Request;

class ProjectController extends Controller
{
    public function store(Request $request)
    {
        // Validation of received request
        $request->validate([
            'name' => 'required|string|max:255',
            'department' => 'required|string|max:255',
            'city' => 'required|string|max:255',
            'description' => 'required|string',
            'user_id' => 'required|exists:users,id',
            'entreprise_id' => 'required|exists:entreprise,id',
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
            'volet_relance' => 'nullable|string',
            'mesure' => 'nullable|string',
            'mesure_light' => 'nullable|string',
            'mise_a_jour' => 'nullable|date',
            'filiere' => 'nullable|string',
            'notation_general' => 'nullable|integer',
            'notation_commune' => 'nullable|integer',
            'notation_citoyen' => 'nullable|integer',
            'status' => 'required|in:En cours,Terminé,En préparation,En contestation',
        ]);

        // Project creation
        $project = Project::create($request->all());

        return response()->json([
            'message' => 'Projet créé avec succès',
            'project' => $project
        ], 201);
    }

    public function update(Request $request, $id)
    {
        // Validation of received request
        $request->validate([
            'name' => 'required|string|max:255',
            'department' => 'required|string|max:255',
            'city' => 'required|string|max:255',
            'description' => 'nullable|string',
            'user_id' => 'required|exists:users,id',
            'entreprise_id' => 'required|exists:entreprise,id',
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
            'volet_relance' => 'nullable|string',
            'mesure' => 'nullable|string',
            'mesure_light' => 'nullable|string',
            'mise_a_jour' => 'nullable|date',
            'filiere' => 'nullable|string',
            'notation_general' => 'nullable|integer',
            'notation_commune' => 'nullable|integer',
            'notation_citoyen' => 'nullable|integer',
            'status' => 'required|in:En cours,Terminé,En préparation,En contestation',
        ]);

        // Find the project
        $project = Project::find($id);

        // Project not found
        if (!$project) {
            return response()->json(['message' => 'Projet non trouvé'], 404);
        }

        // Data update
        $project->update($request->all());

        // Return the updated project
        return response()->json([
            'message' => 'Projet mis à jour avec succès',
            'data' => $project
        ], 200);
    }

    public function index()
    {
        // Select all projects
        $projects = Project::all();

        // Return all projects in JSON
        return response()->json($projects);
    }

    public function destroy($id)
    {
        // Find the project
        $project = Project::find($id);

        // Project not found
        if (!$project) {
            return response()->json(['message' => 'Projet non trouvé'], 404);
        }

        // Delete the project
        $project->delete();

        // Return a success message
        return response()->json(['message' => 'Projet supprimé avec succès'], 200);
    }
   
}
