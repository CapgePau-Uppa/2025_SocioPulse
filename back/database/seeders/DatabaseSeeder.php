<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Role;
use App\Models\Entreprise;
use Illuminate\Support\Facades\Hash;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run()
    {   
        $entreprise = Entreprise::firstOrCreate([
            'siren' => '123456789',
            'nom' => 'Entreprise123',
            'type_entreprise' => 'TPE/PME',
            'note_generale' => 0,
            'note_citoyenne' => 0,
            'note_commune' => 0
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

        $citoyenRole = Role::firstOrCreate([
            'name' => 'citoyen',
        ], [
            'canDelete' => false,
            'canCreate' => false,
            'canComment' => true,
            'canGrade' => false
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
            'role_id' => $adminRole->id
        ]);

        $citoyen = User::create([
            'name' => 'Citoyen',
            'email' => 'citoyen@example.com',
            'password' => Hash::make('password'),
            'role_id' => $citoyenRole->id
        ]);

        $communaute = User::create([
            'name' => 'Communaute',
            'email' => 'communaute@example.com',
            'password' => Hash::make('password'),
            'role_id' => $communauteRole->id
        ]);

        $entreprise = User::create([
            'name' => 'Entreprise',
            'email' => 'entreprise@example.com',
            'password' => Hash::make('password'),
            'role_id' => $entrepriseRole->id
        ]);

        echo "Les utilisateurs par défaut ont été créés avec succès !\n";
    }
}
