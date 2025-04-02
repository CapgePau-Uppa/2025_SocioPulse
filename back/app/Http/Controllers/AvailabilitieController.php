<?php

namespace App\Http\Controllers;

use App\Models\Availabilitie;
use Illuminate\Http\Request;
use Carbon\Carbon;
class AvailabilitieController extends Controller {
    // Récupérer les disponibilités d'un projet
    public function index($projectId) {
        $availabilities = Availabilitie::where('project_id', $projectId)->get();
        if ($availabilities->isEmpty()) {
            return response()->json([], 200);
        }
        return response()->json($availabilities, 200);
    }

    // Ajouter ou modifier des disponibilités pour un projet
    public function store(Request $request, $projectId) {
        $request->validate([
            'availabilities' => 'required|array',
            'availabilities.*.availability_date' => 'required|date',
            'availabilities.*.start_time' => 'required',
            'availabilities.*.end_time' => 'required'
        ]);

        foreach ($request->availabilities as $available) {
            // ✅ Conversion explicite de la date pour éviter les erreurs
            $availabilityDate = Carbon::parse($available['availability_date'])->toDateString(); 
            
            // Vérifie si la disponibilité existe déjà pour ce projet
            $existingDispo = Availabilitie::where('project_id', $projectId)
                                        ->where('availability_date', $availabilityDate)
                                        ->where('start_time', $available['start_time'])
                                        ->first();

            if ($existingDispo) {
                // Met à jour si la disponibilité existe déjà
                $existingDispo->update([
                    'end_time' => $available['end_time']
                ]);
            } else {
                // Ajoute une nouvelle disponibilité
                Availabilitie::create([
                    'entreprise_id' => auth()->user()->entreprise_id,
                    'project_id' => $projectId,
                    'availability_date' => $availabilityDate, // ✅ Stocké correctement en format date
                    'start_time' => $available['start_time'],
                    'end_time' => $available['end_time']
                ]);
            }
        }

        return response()->json(['message' => 'Disponibilités mises à jour'], 200);
    }
}
