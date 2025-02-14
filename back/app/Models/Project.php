<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Project extends Model {
    use HasFactory;
// this table protects the model from masive assignations
    protected $fillable = [
        'name',
        'department',
        'city',
        'description',
        'latitude',
        'longitude',
        'user_id'
    ];
    public function user()
    {
        return $this->belongsTo(User::class); // A project belongs to a user
    }
}

