<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */

    //HasApiToken permet à Larave ld'attribuer des tokens à l'utilisateur.
    use HasFactory, Notifiable, HasApiTokens;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Relation with projects
     */
    public function projects()
    {
        return $this->hasMany(Project::class); // A user can have many projects
    }

    /**
     * Get the roles associated with the user.
     */
    public function roles()
    {
        return $this->belongsToMany(Role::class, 'roles_users');
    }
    
    
    /**
     * Get a unique collection of permission names associated with the user's roles.
     *
     * This method retrieves the user's roles along with their associated permissions,
     * flattens the permissions collection, and returns a unique list of permission names.
     *
     * @return \Illuminate\Support\Collection A collection of unique permission names.
     */
    public function permissions()
    {
        return $this->roles()->with('permissions')->get()->pluck('permissions')->flatten()->pluck('name')->unique();
    }

    /**
     * Summary of permissions method
     * A user can have many permissions
     */
    public function hasPermission($permission)
    {
        return $this->permissions()->contains($permission);
    }
}
