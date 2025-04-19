<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Rating extends Model
{
    protected $fillable = [
        'user_id',
        'project_id',
        'engagement_rating',
        'societal_value_rating',
        'ecological_impact_rating',
        'job_creation_rating',
    ];
    
    public function user()
    {
        return $this->belongsTo(User::class);
    }
    
    public function project()
    {
        return $this->belongsTo(Project::class);
    }
    
}
