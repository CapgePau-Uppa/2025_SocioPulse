<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RendezVous extends Model
{
    use HasFactory;

    protected $table = 'rendez_vous';

    protected $fillable = [
        'project_id',
        'user_id',
        'date',
        'hour',
        'message',
        'status',
    ];

    protected $casts = [
        'date' => 'date',
    ];

    // Accessor pour l'heure
    public function getHourAttribute($value)
    {
        return \Carbon\Carbon::parse($value)->format('H:i:s');
    }

    // Mutator pour l'heure
    public function setHourAttribute($value)
    {
        $this->attributes['hour'] = \Carbon\Carbon::parse($value)->format('H:i:s');
    }

    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

}
