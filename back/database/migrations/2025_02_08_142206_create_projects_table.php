<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('department');
            $table->string('city');
            $table->text('description');
            $table->decimal('latitude', 10, 8); // Ajout de la colonne latitude
            $table->decimal('longitude', 10, 8); // Ajout de la colonne longitude
            $table->foreignId('user_id')->constrained('users'); // Relation entre la table projects et users
            $table->foreignId('entreprise_id')->constrained('entreprise'); // Définir la clé étrangère
            $table->string('volet_relance')->nullable();
            $table->string('mesure')->nullable();
            $table->string('mesure_light')->nullable();
            $table->string('filiere')->nullable();
            $table->integer('notation_general')->nullable();
            $table->integer('notation_commune')->nullable();
            $table->integer('notation_citoyen')->nullable();
            $table->enum('status', ['En cours', 'Terminé', 'En préparation', 'En contestation']); // Ajout de la colonne status
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};