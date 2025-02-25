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
        Schema::create('upgrade-request', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users'); // Relation between table projects and users 
            $table->enum('role', ['industriel', 'collectivité']); // Restrict role to specific values
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
