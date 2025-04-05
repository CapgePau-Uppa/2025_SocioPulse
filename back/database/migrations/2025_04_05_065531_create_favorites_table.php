<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateFavoritesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('favorites', function (Blueprint $table) {
            $table->id(); // Colonne d'identifiant auto-incrémentée
            $table->unsignedBigInteger('user_id'); // Identifiant de l'utilisateur
            $table->unsignedBigInteger('project_id'); // Identifiant du projet
            $table->timestamps(); // Colonnes created_at et updated_at

            // Ajouter des clés étrangères si nécessaire
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('project_id')->references('id')->on('projects')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('favorites');
    }
}
