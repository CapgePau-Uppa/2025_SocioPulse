<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use App\Http\Controllers\{
    AuthController,
    ProjectController,
    UpgradeRequestController,
    AdminController,
    EntrepriseController,
    ReportController,
    PdfAccessRequestController,
    RendezVousController,
    FavoriteController,
    NotificationController,
    CategoryReportController,
    AvailabilitieController,
    RatingController
};

// Authentication
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/deleteUser', [AuthController::class, 'deleteAccount']);
    Route::post('/upgradeRequete', [UpgradeRequestController::class, 'store']);
});

// Enterprises
Route::get('/entreprises', [EntrepriseController::class, 'index']);

// Admin
Route::middleware(['auth:sanctum', 'checkAdminRole'])->group(function () {
    Route::get('/roles', [AdminController::class, 'getRoles']);
    Route::get('/users', [AdminController::class, 'getUsers']);
    Route::put('/users/{id}/role', [AdminController::class, 'updateUserRole']);
    Route::get('/roles/{id}/permissions', [AdminController::class, 'getPermissions']);
    Route::put('/roles/{id}/permissions', [AdminController::class, 'updateRolePermissions']);
});

// Projects
Route::get('/projects', [ProjectController::class, 'index']);

Route::middleware(['auth:sanctum', 'checkPermission:canCreate'])->post('/projects', [ProjectController::class, 'store']);
Route::middleware(['auth:sanctum'])->put('/projects/{id}', [ProjectController::class, 'update']);
Route::middleware(['auth:sanctum', 'checkPermission:canDelete'])->delete('/projects/{id}', [ProjectController::class, 'destroy']);

// Reports
Route::get('/reports/file/{filename}', [ReportController::class, 'getReportFile']);
Route::post('/upload', [ReportController::class, 'upload']);
Route::middleware('auth:sanctum')->put('reports/{report}', [ReportController::class, 'moveReport']);

// PDF Access Requests & Category Reports
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/projects/access-requests', [PdfAccessRequestController::class, 'getRequests']);
    Route::get('/projects/{id}/access-requests', [PdfAccessRequestController::class, 'index']);
    Route::get('/projects/{id}/reports', [ReportController::class, 'getReports']);
    Route::post('/projects/{id}/access-requests', [PdfAccessRequestController::class, 'createRequest']);
    Route::post('/projects/{id}/access-requests/{requestId}/approve', [PdfAccessRequestController::class, 'approveRequest']);
    Route::post('/projects/{id}/access-requests/{requestId}/reject', [PdfAccessRequestController::class, 'rejectRequest']);

    Route::post('/projects/{id}/category_reports', [CategoryReportController::class, 'store']);
    Route::get('/projects/{id}/category_reports', [CategoryReportController::class, 'getByProject']);
});
Route::middleware('auth:sanctum')->delete('/category_reports/{id}', [CategoryReportController::class, 'destroy']);

// Rendez-vous
Route::middleware(['auth:sanctum', 'checkRole:administrator,communaute,entreprise'])
    ->get('/projects/{id}/rendez-vous', [RendezVousController::class, 'index']);
Route::get('/projects/{project}/rendez-vous/{date}', [RendezVousController::class, 'getRendezVousForDate']);

Route::middleware(['auth:sanctum', 'checkRole:administrator,communaute'])->group(function () {
    Route::put('/projects/{id}/rendez-vous', [RendezVousController::class, 'update']);
    Route::delete('/projects/{id}/rendez-vous', [RendezVousController::class, 'destroy']);
});

Route::middleware(['auth:sanctum', 'checkRole:administrator,entreprise'])->group(function () {
    Route::post('/projects/rendez-vous/{id}/accept', [RendezVousController::class, 'accept']);
    Route::post('/projects/rendez-vous/{id}/reject', [RendezVousController::class, 'reject']);
});

Route::middleware(['auth:sanctum', 'checkRole:administrator,communaute,entreprise'])
    ->post('/projects/{id}/rendez-vous', [RendezVousController::class, 'store']);

// Availabilities
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/availabilities/{projectId}', [AvailabilitieController::class, 'index']);
    Route::post('/availabilities/{projectId}', [AvailabilitieController::class, 'store']);
});

// Favorites
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/favorites', [FavoriteController::class, 'index']);
    Route::post('/favorites', [FavoriteController::class, 'store']);
    Route::delete('/favorites/{favorite}', [FavoriteController::class, 'destroy']);
});

// Notifications
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::post('/notifications', [NotificationController::class, 'store']);
    Route::put('/notifications/{id}/read', [NotificationController::class, 'markAsRead']);
    Route::put('/notifications/read-all', [NotificationController::class, 'markAllAsRead']);
    Route::delete('/notifications/{id}', [NotificationController::class, 'destroy']);
    Route::post('/notifications/debug', [NotificationController::class, 'addDebugNotification']);
});

// Ratings
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/ratings', [RatingController::class, 'store']);          
    Route::put('/ratings/{id}', [RatingController::class, 'update']);      
    Route::get('/projects/{id}/ratings', [RatingController::class, 'getByProject']); 
});
