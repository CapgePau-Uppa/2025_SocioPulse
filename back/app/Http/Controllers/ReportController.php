<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\Report; 
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\Log;
class ReportController extends Controller
{
    // Retrieve a report file based on its filename
    public function getReportFile($filename)
    {
        $path = storage_path("../../ressource/$filename"); // Define the file path

        // Check if the file exists
        if (!File::exists($path)) {
            return response()->json(['error' => 'File not found'], 404);
        }

        // Return the file as a response
        return Response::file($path);
    }

    // Upload a new report file
    public function upload(Request $request)
    {
        // Validate the input data (report name, file, project ID, and category ID)
        $request->validate([
            'name' => 'required|string|max:255',
            'file' => 'required|mimes:pdf|max:2048', // Only PDF files allowed (max 2MB)
            'project_id' => 'required|integer|exists:projects,id', // Project must exist
            'category_id' => 'required|integer|exists:table_category_report,id', // Category must exist
        ]);

        // Ensure a file has been sent
        if (!$request->hasFile('file')) {
            return response()->json(['error' => 'No file received'], 400);
        }

        $file = $request->file('file');
        $name = $request->input('name');
        $projectId = $request->input('project_id');
        $categoryId = $request->input('category_id');

        // Ensure file is a PDF (extra check beyond validation)
        if ($file->getClientOriginalExtension() !== 'pdf') {
            return response()->json(['error' => 'Only PDF files are allowed'], 400);
        }

        // Verify that the project exists
        $project = Project::find($projectId);
        if (!$project) {
            return response()->json(['error' => 'Project not found'], 404);
        }

        // Generate a unique filename to avoid name collisions
        $fileName = time() . '-' . $file->getClientOriginalName();

        // Move the file to the custom "ressource" directory (relative to base path)
        $path = storage_path('../../ressource/');
        $file->move($path, $fileName);

        // Save the report to the database
        $report = Report::create([
            'name' => $name,
            'path' => "../../ressource/$fileName", // File path to store
            'project_id' => $projectId,
            'category_id' => $categoryId,
        ]);

        // Return the file path as confirmation
        return response()->json(['path' => "../../ressource/$fileName"], 200);
    }

    // Retrieve all reports with their related project
    public function getReports()
    {
        $reports = Report::with('project')->get(); // Eager-load the project relation

        return response()->json($reports, 200);
    }

    public function moveReport(Request $request, Report $report)
    {
        // Check if the user is authenticated (using the 'auth:sanctum' middleware)
    
        // Validate the data received in the request
        $request->validate([
            'category_id' => 'required|integer|exists:table_category_report,id', // Ensure the category exists in the database
        ]);
    
        // Update the report's category
        $report->category_id = $request->input('category_id');
        $report->save();  // Save the changes in the database
    
        // Return a success response
        return response()->json([
            'message' => 'Report moved successfully!',
            'report' => $report
        ], 200);
    }
    

}
