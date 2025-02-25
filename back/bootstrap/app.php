<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful; // Import du middleware Sanctum
use Illuminate\Http\Middleware\HandleCors;// Import du middleware CORS
use Illuminate\Routing\Middleware\SubstituteBindings; // Import du middleware SubstituteBindings
use App\Http\Middleware\CheckPermission;


return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        api: __DIR__.'/../routes/api.php', //Ajout de la route api 
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up', 
    )
    ->withMiddleware(function (Middleware $middleware) {
        // Ajout des middlewares Sanctum et SubstituteBindings pour les requêtes API
        $middleware->api(append: [
            HandleCors::class,  // Ajoute le middleware CORS pour les requêtes API
            EnsureFrontendRequestsAreStateful::class,  // Gère la session d'authentification pour l'API
            SubstituteBindings::class,                 // Gère la liaison automatique des paramètres de route
            CheckPermission::class,                    // Permission middleware
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();
