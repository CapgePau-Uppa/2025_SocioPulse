<?php

namespace App\Http\Controllers;

use App\Models\Entreprise;
use Illuminate\Http\Request;

class EntrepriseController extends Controller
{
    public function store(Request $request)
    {
        // Validation of received request
        $request->validate([
            'siren' => 'required|string|unique:entreprise,siren|max:255',
            'nom' => 'required|string|max:255',
            'type_entreprise' => 'required|in:TPE/PME,GE,ETI,Association,Organisme de recherche,EPIC,Etablissement public,GIE,Organisme de formation,Autre',
            'note_generale' => 'nullable|integer',
            'note_citoyenne' => 'nullable|integer',
            'note_commune' => 'nullable|integer',
        ]);

        // Entreprise creation
        $entreprise = Entreprise::create($request->all());

        return response()->json([
            'message' => 'Entreprise créée avec succès',
            'entreprise' => $entreprise
        ], 201);
    }

    public function update(Request $request, $id)
    {
        // Validation of received request
        $request->validate([
            'siren' => 'required|string|max:255|unique:entreprise,siren,' . $id,
            'nom' => 'required|string|max:255',
            'type_entreprise' => 'required|in:TPE/PME,GE,ETI,Association,Organisme de recherche,EPIC,Etablissement public,GIE,Organisme de formation,Autre',
            'note_generale' => 'nullable|integer',
            'note_citoyenne' => 'nullable|integer',
            'note_commune' => 'nullable|integer',
        ]);

        // Find the entreprise
        $entreprise = Entreprise::find($id);

        // Entreprise not found
        if (!$entreprise) {
            return response()->json(['message' => 'Entreprise non trouvée'], 404);
        }

        // Data update
        $entreprise->update($request->all());

        // Return the updated entreprise
        return response()->json([
            'message' => 'Entreprise mise à jour avec succès',
            'data' => $entreprise
        ], 200);
    }

    public function index()
    {
        // Select all entreprises
        $entreprises = Entreprise::all();

        // Return all entreprises in JSON
        return response()->json($entreprises);
    }

    public function show($id)
    {
        // Find the entreprise
        $entreprise = Entreprise::find($id);

        // Entreprise not found
        if (!$entreprise) {
            return response()->json(['message' => 'Entreprise non trouvée'], 404);
        }

        // Return the entreprise
        return response()->json($entreprise);
    }

    public function destroy($id)
    {
        // Find the entreprise
        $entreprise = Entreprise::find($id);

        // Entreprise not found
        if (!$entreprise) {
            return response()->json(['message' => 'Entreprise non trouvée'], 404);
        }

        // Delete the entreprise
        $entreprise->delete();

        // Return a success message
        return response()->json(['message' => 'Entreprise supprimée avec succès'], 200);
    }
}
