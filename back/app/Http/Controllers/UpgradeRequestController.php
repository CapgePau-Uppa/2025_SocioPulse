<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\UpgradeRequest;
use App\Models\User;
use App\Models\Entreprise;

class UpgradeRequestController extends Controller
{
    public function store(Request $request)
    {
        // Validate incoming data
        $request->validate([
            'role_id' => 'required|string',
            'user_id' => 'required|exists:users,id',
            'details' => 'required|array',
            'details.siren' => 'required_if:details.entreprise_id,null|string|unique:entreprise,siren|max:255',
            'details.nom' => 'required_if:details.entreprise_id,null|string|max:255',
            'details.type_entreprise' => 'required_if:details.entreprise_id,null|in:TPE/PME,GE,ETI,Association,Organisme de recherche,EPIC,Etablissement public,GIE,Organisme de formation,Autre',
            'details.entreprise_id' => 'required_if:details.siren,null|exists:entreprise,id'
        ]);


        // Check if the company already exists
        if ($request->details['entreprise_id']) {
            $entreprise = Entreprise::find($request->details['entreprise_id']);
        } else { // If the company doesn't exist, create it
            $entreprise = Entreprise::create([
                'siren' => $request->details['siren'],
                'nom' => $request->details['nom'],
                'type_entreprise' => $request->details['type_entreprise'],
            ]);
        }

        // Create the upgrade request
        $upgradeRequest = UpgradeRequest::create([
            'role_id' => $request->role_id,
            'user_id' => $request->user_id,
        ]);

        // Find the user
        $user = User::find($request->user_id);

        // Associate the user with the company and update their role
        $user->entreprise_id = $entreprise->id;
        $user->role_id = $request->role_id;
        $user->save();

        // Return a success response
        return response()->json([
            'message' => 'Upgrade request and company created successfully',
            'upgradeRequest' => $upgradeRequest,
            'entreprise' => $entreprise,
        ], 201);
    }

    public function index()
    {
        // Retrieve all upgrade requests
        $upgradeRequests = UpgradeRequest::all();

        // Return all requests as JSON
        return response()->json($upgradeRequests);
    }

    public function destroy($id)
    {
        // Find the upgrade request
        $upgradeRequest = UpgradeRequest::find($id);

        // If not found, return error
        if (!$upgradeRequest) {
            return response()->json(['message' => 'Request not found'], 404);
        }

        // Delete the upgrade request
        $upgradeRequest->delete();

        // Return success message
        return response()->json(['message' => 'Request successfully deleted'], 200);
    }
}
