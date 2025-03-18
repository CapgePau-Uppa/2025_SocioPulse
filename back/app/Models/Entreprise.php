<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Entreprise extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'entreprise';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'siren',
        'nom',
        'type_entreprise',
        'note_generale',
        'note_citoyenne',
        'note_commune',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'note_generale' => 'integer',
        'note_citoyenne' => 'integer',
        'note_commune' => 'integer',
    ];

    /**
     * Get the projects for the entreprise.
     */
    public function projects()
    {
        return $this->hasMany(Project::class);
    }

    public function user()
    {
        return $this->hasOne(User::class);
    }    
}
