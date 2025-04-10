<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Project extends Model {
    use HasFactory;

    // Allow mass assignment for the following fields
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
     * A project belongs to a user.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * A project belongs to a company.
     */
    public function entreprise()
    {
        return $this->belongsTo(Entreprise::class);
    }

    /**
     * A project has many reports.
     */
    public function reports()
    {
        return $this->hasMany(Report::class);
    }

}
