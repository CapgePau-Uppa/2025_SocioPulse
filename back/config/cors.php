<?php

return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],  // Ajoute sanctum pour gérer le CSRF

    'allowed_methods' => ['*'],  // Permet toutes les méthodes HTTP

    'allowed_origins' => ['*'],  // Frontend Angular (à adapter en fonction de l'adresse)
    'allowed_origins_patterns' => [],  // Pas nécessaire ici

    'allowed_headers' => ['*'],  // Permet tous les headers

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' =>true,  // Obligatoire pour que les cookies soient partagés
];
