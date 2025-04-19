<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Rating;
use Illuminate\Support\Facades\Auth;

class RatingController extends Controller
{
    
    public function store(Request $request)
    {
        $request->validate([
            'project_id' => 'required|exists:projects,id',
            'engagement_rating' => 'required|integer|min:1|max:5',
            'societal_value_rating' => 'required|integer|min:1|max:5',
            'ecological_impact_rating' => 'required|integer|min:1|max:5',
            'job_creation_rating' => 'required|integer|min:1|max:5',
        ]);
    
        $existing = Rating::where('user_id', Auth::id())
                          ->where('project_id', $request->project_id)
                          ->first();
    
        if ($existing) {
            return response()->json(['message' => 'Vous avez déjà noté ce projet.'], 409);
        }
    
        $rating = Rating::create([
            'user_id' => Auth::id(),
            'project_id' => $request->project_id,
            'engagement_rating' => $request->engagement_rating,
            'societal_value_rating' => $request->societal_value_rating,
            'ecological_impact_rating' => $request->ecological_impact_rating,
            'job_creation_rating' => $request->job_creation_rating,
        ]);
        $this->updateProjectRatings($request->project_id);
        return response()->json($rating, 201);
    }
    
    public function update(Request $request, $id)
    {
        $rating = Rating::where('id', $id)
                        ->where('user_id', Auth::id())
                        ->firstOrFail();

        $request->validate([
            'engagement_rating' => 'sometimes|integer|min:1|max:5',
            'societal_value_rating' => 'sometimes|integer|min:1|max:5',
            'ecological_impact_rating' => 'sometimes|integer|min:1|max:5',
            'job_creation_rating' => 'sometimes|integer|min:1|max:5',
        ]);

        $rating->update($request->only([
            'engagement_rating',
            'societal_value_rating',
            'ecological_impact_rating',
            'job_creation_rating'
        ]));
        $this->updateProjectRatings($request->project_id);
        return response()->json($rating);
    }

    public function getByProject($projectId)
    {
        $ratings = Rating::where('project_id', $projectId)->get();

        return response()->json($ratings);
    }

    private function updateProjectRatings($projectId)
    {
        $project = Project::with(['ratings.user'])->findOrFail($projectId);

        $ratings = $project->ratings;

        $userRatings = $ratings->where('user.role', 'citoyen');
        $communeRatings = $ratings->where('user.role', 'commune');

        $project->notation_general = $ratings->avg(function ($r) {
            return ($r->engagement_rating + $r->societal_value_rating + $r->ecological_impact_rating + $r->job_creation_rating) / 4;
        });

        $project->notation_citoyen = $userRatings->avg(function ($r) {
            return ($r->engagement_rating + $r->societal_value_rating + $r->ecological_impact_rating + $r->job_creation_rating) / 4;
        });

        $project->notation_commune = $communeRatings->avg(function ($r) {
            return ($r->engagement_rating + $r->societal_value_rating + $r->ecological_impact_rating + $r->job_creation_rating) / 4;
        });

        $project->save();
    }

}
