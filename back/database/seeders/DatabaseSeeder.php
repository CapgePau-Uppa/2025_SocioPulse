<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Role;
use App\Models\Entreprise;
use App\Models\Project;
use Illuminate\Support\Facades\Hash;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run()
    {   
        $entreprises = [
            [
                'siren' => '552081317',
                'nom' => 'EDF',
                'type_entreprise' => 'GE',
                'note_generale' => 0,
                'note_citoyenne' => 0,
                'note_commune' => 0
            ],
            [
                'siren' => '562082909',
                'nom' => 'Safran',
                'type_entreprise' => 'GE',
                'note_generale' => 0,
                'note_citoyenne' => 0,
                'note_commune' => 0
            ],
            [
                'siren' => '479766842',
                'nom' => 'Capgemini Technology Services',
                'type_entreprise' => 'GE',
                'note_generale' => 0,
                'note_citoyenne' => 0,
                'note_commune' => 0
            ],
            [
                'siren' => '542051180',
                'nom' => 'TotalEnergies SE',
                'type_entreprise' => 'GE',
                'note_generale' => 0,
                'note_citoyenne' => 0,
                'note_commune' => 0
            ],
            [
                'siren' => '712042456',
                'nom' => 'Dassault Aviation',
                'type_entreprise' => 'GE',
                'note_generale' => 0,
                'note_citoyenne' => 0,
                'note_commune' => 0
            ]
        ];
        
        foreach ($entreprises as $data) {
            $entreprise = Entreprise::firstOrCreate($data);
        }

        $citoyenRole = Role::firstOrCreate([
            'name' => 'citoyen',
        ], [
            'canDelete' => false,
            'canCreate' => false,
            'canComment' => true,
            'canGrade' => false
        ]);

        // Création des rôles
        $adminRole = Role::firstOrCreate([
            'name' => 'administrator',
        ], [
            'canDelete' => true,
            'canCreate' => true,
            'canComment' => true,
            'canGrade' => true
        ]);

        $communauteRole = Role::firstOrCreate([
            'name' => 'communaute',
        ], [
            'canDelete' => false,
            'canCreate' => true,
            'canComment' => true,
            'canGrade' => false
        ]);

        $entrepriseRole = Role::firstOrCreate([
            'name' => 'entreprise',
        ], [
            'canDelete' => false,
            'canCreate' => true,
            'canComment' => true,
            'canGrade' => false
        ]);

        // Création des utilisateurs par défaut avec leurs rôles
        $admin = User::create([
            'name' => 'Admin',
            'email' => 'admin@example.com',
            'password' => Hash::make('password'),
            'role_id' => $adminRole->id,
            'entreprise_id' => null
            
        ]);

        $citoyen = User::create([
            'name' => 'Citoyen',
            'email' => 'citoyen@example.com',
            'password' => Hash::make('password'),
            'role_id' => $citoyenRole->id,
            'entreprise_id' => null
        ]);
        
        $communaute = User::create([
            'name' => 'Communaute',
            'email' => 'communaute@example.com',
            'password' => Hash::make('password'),
            'role_id' => $communauteRole->id,
            'entreprise_id' => null
        ]);
        
        $entreprise = User::create([
            'name' => 'Entreprise',
            'email' => 'entreprise@example.com',
            'password' => Hash::make('password'),
            'role_id' => $entrepriseRole->id,
            'entreprise_id' => 4
        ]);
        
        
        echo "Les utilisateurs par défaut ont été créés avec succès !\n";
        $projects = [
            [
                'name' => 'Expansion industrielle EDF',
                'department' => 'Hauts-de-Seine',
                'city' => 'Nanterre',
                'description' => 'Développement de nouvelles infrastructures énergétiques pour répondre aux besoins croissants.',
                'latitude' => 48.892, 
                'longitude' => 2.206,
                'user_id' => 4,
                'entreprise_id' => 4,
                'volet_relance' => 'Énergie et transition écologique',
                'mesure' => 'Développement durable',
                'mesure_light' => 'Énergie renouvelable',
                'filiere' => 'Énergie',
                'notation_general' => null,
                'notation_commune' => null,
                'notation_citoyen' => null,
                'status' => 'En cours',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Usine de semi-conducteurs',
                'department' => 'Paris',
                'city' => 'Paris',
                'description' => 'Nouvelle unité de production pour la fabrication de composants électroniques avancés.',
                'latitude' => 48.8566,
                'longitude' => 2.3522,
                'user_id' => 4,
                'entreprise_id' => 4,
                'volet_relance' => 'Indépendance / Compétitivité',
                'mesure' => 'Relocalisation industrielle',
                'mesure_light' => 'Électronique',
                'filiere' => 'Electronique',
                'notation_general' => null,
                'notation_commune' => null,
                'notation_citoyen' => null,
                'status' => 'En préparation',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Capgemini - Plateforme d’intelligence artificielle',
                'department' => 'Seine-Saint-Denis',
                'city' => 'Le Bourget',
                'description' => 'Implantation d’un centre de données éco-responsable avec des technologies de pointe.',
                'latitude' => 48.9675,
                'longitude' => 2.4393,
                'user_id' => 4,
                'entreprise_id' => 4,
                'volet_relance' => 'Innovation technologique',
                'mesure' => 'Cloud hybride',
                'mesure_light' => 'Technologies vertes',
                'filiere' => 'Cloud Computing',
                'notation_general' => null,
                'notation_commune' => null,
                'notation_citoyen' => null,
                'status' => 'En préparation',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            
            [
                'name' => 'Développement durable TotalEnergies',
                'department' => 'Bouches-du-Rhône',
                'city' => 'Marseille',
                'description' => 'Programme de transition énergétique pour la réduction des émissions de CO2.',
                'latitude' => 43.2965,
                'longitude' => 5.3698,
                'user_id' => 4,
                'entreprise_id' => 4,
                'volet_relance' => 'Énergie et transition écologique',
                'mesure' => 'Efficacité énergétique',
                'mesure_light' => 'Décarbonation',
                'filiere' => 'Énergie',
                'notation_general' => null,
                'notation_commune' => null,
                'notation_citoyen' => null,
                'status' => 'En contestation',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Nouveaux avions Dassault',
                'department' => 'Gironde',
                'city' => 'Mérignac',
                'description' => 'Développement d’un nouvel avion éco-responsable.',
                'latitude' => 44.843,
                'longitude' => -0.701,
                'user_id' => 4,
                'entreprise_id' => 4,
                'volet_relance' => 'Innovation technologique',
                'mesure' => 'Recherche & Développement',
                'mesure_light' => 'Aéronautique',
                'filiere' => 'Aéronautique',
                'notation_general' => null,
                'notation_commune' => null,
                'notation_citoyen' => null,
                'status' => 'Terminé',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Modernisation des infrastructures Safran',
                'department' => 'Essonne',
                'city' => 'Évry',
                'description' => 'Projet de modernisation des équipements industriels pour la fabrication de moteurs.',
                'latitude' => 48.634,
                'longitude' => 2.445,
                'user_id' => 4,
                'entreprise_id' => 4,
                'volet_relance' => 'Industrie 4.0',
                'mesure' => 'Automatisation',
                'mesure_light' => 'Innovation',
                'filiere' => 'Aéronautique',
                'notation_general' => null,
                'notation_commune' => null,
                'notation_citoyen' => null,
                'status' => 'En cours',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Infrastructure numérique Capgemini',
                'department' => 'Hauts-de-Seine',
                'city' => 'Issy-les-Moulineaux',
                'description' => 'Déploiement d’un centre de données à faible impact environnemental.',
                'latitude' => 48.8231,
                'longitude' => 2.2711,
                'user_id' => 4,
                'entreprise_id' => 4,
                'volet_relance' => 'Transformation digitale',
                'mesure' => 'Cloud souverain',
                'mesure_light' => 'Numérique',
                'filiere' => 'Informatique',
                'notation_general' => null,
                'notation_commune' => null,
                'notation_citoyen' => null,
                'status' => 'En cours',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'TotalEnergies - Production d’énergie solaire',
                'department' => 'Bouches-du-Rhône',
                'city' => 'Marseille',
                'description' => 'Lancement d’un projet d’installation de fermes solaires pour produire de l’énergie propre et renouvelable, visant à fournir une énergie durable à des communautés locales et à réduire la dépendance aux énergies fossiles. Ce programme s’inscrit dans une stratégie plus large de décarbonation de l’industrie énergétique de TotalEnergies, en augmentant la part de l’énergie solaire dans le mix énergétique global de l’entreprise.',
                'latitude' => 43.2965,
                'longitude' => 5.3698,
                'user_id' => 4,
                'entreprise_id' => 4,
                'volet_relance' => 'Énergie et transition écologique',
                'mesure' => 'Énergies renouvelables',
                'mesure_light' => 'Solaire',
                'filiere' => 'Énergie verte',
                'notation_general' => null,
                'notation_commune' => null,
                'notation_citoyen' => null,
                'status' => 'En préparation',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Centre R&D Dassault',
                'department' => 'Gironde',
                'city' => 'Mérignac',
                'description' => 'Construction d’un centre de recherche pour l’innovation aéronautique.',
                'latitude' => 44.843,
                'longitude' => -0.701,
                'user_id' => 4,
                'entreprise_id' => 4,
                'volet_relance' => 'Innovation technologique',
                'mesure' => 'Recherche & Développement',
                'mesure_light' => 'Aéronautique',
                'filiere' => 'Aéronautique',
                'notation_general' => null,
                'notation_commune' => null,
                'notation_citoyen' => null,
                'status' => 'En préparation',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Construction d’usines décarbonées',
                'department' => 'Nord',
                'city' => 'Lille',
                'description' => 'Mise en place d’unités industrielles bas carbone pour l’énergie renouvelable.',
                'latitude' => 50.6292,
                'longitude' => 3.0573,
                'user_id' => 4,
                'entreprise_id' => 4,
                'volet_relance' => 'Transition écologique',
                'mesure' => 'Énergies renouvelables',
                'mesure_light' => 'Décarbonation',
                'filiere' => 'Énergie',
                'notation_general' => null,
                'notation_commune' => null,
                'notation_citoyen' => null,
                'status' => 'En cours',
                'created_at' => now(),
                'updated_at' => now(),
            ]
        ];
        foreach ($projects as $data) {
            $projects = Project::firstOrCreate($data);
        }
        echo "Les projets par défaut ont été créés avec succès !\n";

    }
}
