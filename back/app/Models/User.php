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

    /**
     * Relationship with projects.
     * A user can have many projects.
     */
    public function projects()
    {
        return $this->hasMany(Project::class);
    }

    /**
     * Retrieve the role associated with the user.
     * A user has one role.
     */
    public function role()
    {
        return $this->belongsTo(Role::class);
    }
    
    /**
     * Relationship with the company (Entreprise).
     * A user belongs to one company.
     */
    public function entreprise()
    {
        return $this->belongsTo(Entreprise::class);
    }

    /**
     * Relationship with favorites.
     * A user can have many favorite items.
     */
    public function favorites()
    {
        return $this->hasMany(Favorite::class);
    }

    public function ratings()
    {
        return $this->hasMany(Rating::class);  
    }
}
