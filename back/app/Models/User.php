<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasFactory, Notifiable, HasApiTokens;

    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    // Relation avec les projets
    public function projects()
    {
        return $this->hasMany(Project::class); // Un utilisateur peut avoir plusieurs projets
    }

    /**
     * Récupérer le rôle associé à l'utilisateur
     */
    public function role()
    {
        return $this->belongsTo(Role::class); // Un utilisateur a un seul rôle
    }
    
    public function entreprise()
    {
        return $this->belongsTo(Entreprise::class);
    }
}
