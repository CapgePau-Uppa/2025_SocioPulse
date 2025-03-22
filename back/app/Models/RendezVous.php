<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RendezVous extends Model {
    use HasFactory;

    protected $table = 'rendez_vous';

    protected $fillable = [
        'project_id',
        'user_id',
        'date_heure',
        'message',
        'status',
    ];

    public function project() {
        return $this->belongsTo(Project::class);
    }

    public function user() {
        return $this->belongsTo(User::class);
    }
}

