<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\Report; 
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Response;

class ReportController extends Controller
{
    public function getReportFile($filename)
    {
        $path = storage_path("../../ressource/$filename");

        if (!File::exists($path)) {
            return response()->json(['error' => 'Fichier non trouvé'], 404);
        }

        return Response::file($path);
    }

    public function upload(Request $request)
    {
        // Validation des données reçues
        $request->validate([
            'name' => 'required|string|max:255',
            'file' => 'required|mimes:pdf|max:2048',            
            'project_id' => 'required|integer|exists:projects,id',
            'category_id' => 'required|integer|exists:table_category_report,id', // Ajout de la validation de la catégorie
        ]);

        if (!$request->hasFile('file')) {
            return response()->json(['error' => 'Aucun fichier reçu'], 400);
        }

        $file = $request->file('file');
        $name = $request->input('name');
        $projectId = $request->input('project_id');
        $categoryId = $request->input('category_id');

        if ($file->getClientOriginalExtension() !== 'pdf') {
            return response()->json(['error' => 'Seuls les fichiers PDF sont autorisés'], 400);
        }

        $project = Project::find($projectId);
        if (!$project) {
            return response()->json(['error' => 'Projet non trouvé'], 404);
        }

        $fileName = time() . '-' . $file->getClientOriginalName();
        $path = storage_path('../../ressource/');
        $file->move($path, $fileName);

        $report = Report::create([
            'name' => $name,
            'path' => "../../ressource/$fileName",
            'project_id' => $projectId,
            'category_id' => $categoryId, // Ajout de la catégorie
        ]);

        return response()->json(['path' => "../../ressource/$fileName"], 200);
    }

    public function getReports()
    {
        $reports = Report::with(['project', 'category'])->get(); // Charger aussi la catégorie

        return response()->json($reports, 200);
    }
}
