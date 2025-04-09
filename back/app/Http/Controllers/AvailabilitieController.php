<?php

namespace App\Http\Controllers;

use App\Models\Availabilitie;
use Illuminate\Http\Request;
use Carbon\Carbon;

class AvailabilitieController extends Controller {
    // Retrieve the availabilities of a project
    public function index($projectId) {
        $availabilities = Availabilitie::where('project_id', $projectId)->get();
        if ($availabilities->isEmpty()) {
            return response()->json([], 200);
        }
        return response()->json($availabilities, 200);
    }

    // Add or update availabilities for a project
    public function store(Request $request, $projectId) {
        $request->validate([
            'availabilities' => 'required|array',
            'availabilities.*.availability_date' => 'required|date',
            'availabilities.*.start_time' => 'required',
            'availabilities.*.end_time' => 'required'
        ]);

        foreach ($request->availabilities as $available) {
            // Explicit date conversion to avoid errors
            $availabilityDate = Carbon::parse($available['availability_date'])->toDateString(); 
            
            // Check if the availability already exists for this project
            $existingDispo = Availabilitie::where('project_id', $projectId)
                                        ->where('availability_date', $availabilityDate)
                                        ->where('start_time', $available['start_time'])
                                        ->first();

            if ($existingDispo) {
                // Update if the availability already exists
                $existingDispo->update([
                    'end_time' => $available['end_time']
                ]);
            } else {
                // Add a new availability
                Availabilitie::create([
                    'entreprise_id' => auth()->user()->entreprise_id,
                    'project_id' => $projectId,
                    'availability_date' => $availabilityDate, // Properly stored in date format
                    'start_time' => $available['start_time'],
                    'end_time' => $available['end_time']
                ]);
            }
        }

        return response()->json(['message' => 'Availabilities updated'], 200);
    }
}
