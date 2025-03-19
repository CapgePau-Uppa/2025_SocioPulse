<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\UpgradeRequest; // Ajoutez cette ligne
use App\Models\User;
use App\Models\Entreprise;

class UpgradeRequestController extends Controller
{
    public function store(Request $request)
{
    // Validation des données reçues
    $request->validate([
        'role_id' => 'required|string',
        'user_id' => 'required|exists:users,id',
        'details' => 'required|array',  // Si des données sur l'entreprise sont envoyées
        'details.siren' => 'required|string|unique:entreprise,siren|max:255',
        'details.nom' => 'required|string|max:255',
        'details.type_entreprise' => 'required|in:TPE/PME,GE,ETI,Association,Organisme de recherche,EPIC,Etablissement public,GIE,Organisme de formation,Autre',
    ]);

    // Vérifier si l'entreprise existe déjà
    $entreprise = Entreprise::where('siren', $request->details['siren'])->first();

    // Si l'entreprise n'existe pas, la créer
    if (!$entreprise) {
        $entreprise = Entreprise::create([
            'siren' => $request->details['siren'],
            'nom' => $request->details['nom'],
            'type_entreprise' => $request->details['type_entreprise'],
        ]);
    }

    // Créer la requête de mise à niveau
    $upgradeRequest = UpgradeRequest::create([
        'role_id' => $request->role_id,
        'user_id' => $request->user_id,
    ]);

    // Récupérer l'utilisateur
    $user = User::find($request->user_id);

    // Mettre à jour l'entreprise de l'utilisateur
    $user->entreprise_id = $entreprise->id; // Associer l'utilisateur à l'entreprise
    $user->role_id = $request->role_id; // Mettre à jour son rôle
    $user->save();

    // Retourner une réponse avec succès
    return response()->json([
        'message' => 'Requête de mise à niveau et entreprise créée avec succès',
        'upgradeRequest' => $upgradeRequest,
        'entreprise' => $entreprise,
    ], 201);
}


    public function index()
    {
        // Sélectionner toutes les requêtes de mise à niveau
        $upgradeRequests = UpgradeRequest::all();

        // Retourner toutes les requêtes sous forme JSON
        return response()->json($upgradeRequests);
    }

    public function destroy($id)
    {
        // Trouver la requête de mise à niveau
        $upgradeRequest = UpgradeRequest::find($id);

        // Si la requête n'est pas trouvée
        if (!$upgradeRequest) {
            return response()->json(['message' => 'Requête non trouvée'], 404);
        }

        // Supprimer la requête de mise à niveau
        $upgradeRequest->delete();

        // Retourner un message de succès
        return response()->json(['message' => 'Requête supprimée avec succès'], 200);
    }
}