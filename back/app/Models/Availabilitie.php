<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Availabilitie extends Model {
    use HasFactory;

    protected $fillable = ['entreprise_id', 'project_id', 'availability_date', 'start_time', 'end_time'];

    public function entreprise() {
        return $this->belongsTo(Entreprise::class);
    }

    public function project() {
        return $this->belongsTo(Project::class);
    }
}
