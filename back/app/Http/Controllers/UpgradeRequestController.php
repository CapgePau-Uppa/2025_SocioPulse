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
        $request->validate([
            'role_id' => 'required|string',
            'user_id' => 'required|exists:users,id',
            'details' => 'required|array',
            'entreprise_id' => 'nullable|exists:entreprise,id',
        ]);
    
        if (!empty($request->details['siren']) && empty($request->details['entreprise_id'])) {
            $request->validate([
                'details.siren' => 'required|string|unique:entreprise,siren|max:255',
                'details.nom' => 'required|string|max:255',
                'details.type_entreprise' => 'required|in:TPE/PME,GE,ETI,Association,Organisme de recherche,EPIC,Etablissement public,GIE,Organisme de formation,Autre',
            ]);
    
            $entreprise = Entreprise::create([
                'siren' => $request->details['siren'],
                'nom' => $request->details['nom'],
                'type_entreprise' => $request->details['type_entreprise'],
            ]);

        } else {
            $entreprise = Entreprise::find($request->details['entreprise_id']);

        }
    
        $upgradeRequest = UpgradeRequest::create([
            'user_id' => $request->user_id,
            'role_id' => $request->role_id,
            'entreprise_id' => $entreprise->id ?? null,
            'status' => 'pending',
        ]);
    
        return response()->json([
            'message' => 'Upgrade request submitted for admin review.',
            'upgradeRequest' => $upgradeRequest,
        ], 201);
    }
    

    public function index()
    {
        // Retrieve all upgrade requests
        $upgradeRequests = UpgradeRequest::with(['user', 'entreprise'])
                                        ->orderBy('created_at', 'desc')
                                        ->get();

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

    public function approve($id)
    {
        $request = UpgradeRequest::findOrFail($id);
    
        $request->status = 'approved';
        $request->reviewed_by = auth()->id();
        $request->reviewed_at = now();
        $request->save();
    
        $user = $request->user;
        $user->role_id = $request->role_id;
        $user->entreprise_id = $request->entreprise_id;
        $user->save();
    
        return response()->json(['message' => 'Demande approuvée.']);
    }
    
    public function reject($id)
    {
        $request = UpgradeRequest::findOrFail($id);
    
        $request->status = 'rejected';
        $request->reviewed_by = auth()->id();
        $request->reviewed_at = now();
        $request->save();
    
        return response()->json(['message' => 'Demande refusée.']);
    }
    
    
}
