<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\Http\Request;

class ProjectController extends Controller {
    public function store(Request $request) {
        // Validation of recieved request
        $request->validate([
            'name' => 'required|string|max:255',
            'department' => 'required|string|max:255',
            'city' => 'required|string|max:255',
            'description' => 'required|string',
            'user_id' => 'required|exists:users,id',
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric'
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
        // Validation of recieved request
        $request->validate([
            'name' => 'required|string|max:255',
            'department' => 'required|string|max:255',
            'city' => 'required|string|max:255',
            'description' => 'nullable|string',
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric'
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
        // Select all projets
        $projects = Project::all();

        // Return all projects in JSON
        return response()->json($projects);
    }
}
