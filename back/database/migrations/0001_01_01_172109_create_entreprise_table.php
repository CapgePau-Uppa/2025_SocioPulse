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
        Schema::create('entreprise', function (Blueprint $table) {
            $table->id();
            $table->string('siren')->unique();
            $table->string('nom');
            $table->enum('type_entreprise', [
                'TPE/PME', 'GE', 'ETI', 'Association', 'Organisme de recherche', 
                'EPIC', 'Etablissement public', 'GIE', 'Organisme de formation', 'Autre'
            ]);
            $table->integer('note_generale')->nullable();
            $table->integer('note_citoyenne')->nullable();
            $table->integer('note_commune')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('entreprise');
    }
};