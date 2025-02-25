<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class UpgradeRequestController extends Controller
{
    public function store(Request $request) {
        // Validation of recieved request
        $request->validate([
            'role' => 'required|string',
            'user_id' => 'required|exists:users,id',
        ]);

        // Project creation
        $upgradeRequest = UpgradeRequest::create($request->all());

        return response()->json([
            'message' => 'Requete créé avec succès',
            'upgradeRequest' => $upgradeRequest
        ], 201);
    }

    public function index()
    {
        // Select all projets
        $upgradeRequests = UpgradeRequest::all();

        // Return all projects in JSON
        return response()->json($projects);
    }

    public function destroy($id) {
        // Find the upgrade request
        $upgradeRequest = UpgradeRequest::find($id);

        // Upgrade request not found
        if (!$upgradeRequest) {
            return response()->json(['message' => 'Requête non trouvée'], 404);
        }

        // Delete the upgrade request
        $upgradeRequest->delete();

        // Return a success message
        return response()->json(['message' => 'Requête supprimée avec succès'], 200);
    }
}
