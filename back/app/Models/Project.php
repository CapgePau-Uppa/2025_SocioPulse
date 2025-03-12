<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Project extends Model {
    use HasFactory;

    // Autoriser l'assignation en masse pour ces champs
    protected $fillable = [
        'name',
        'department',
        'city',
        'description',
        'latitude',
        'longitude',
        'user_id',
        'entreprise_id',
        'volet_relance',
        'mesure',
        'mesure_light',
        'mise_a_jour',
        'filiere',
        'notation_general',
        'notation_commune',
        'notation_citoyen',
        'status'
    ];

    /**
     * Un projet appartient à un utilisateur.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Un projet appartient à une entreprise.
     */
    public function entreprise()
    {
        return $this->belongsTo(Entreprise::class);
    }

    public function reports()
    {
        return $this->hasMany(Report::class);
    }

}
