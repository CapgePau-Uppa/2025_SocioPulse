<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Report extends Model
{
    protected $fillable = [
        'name',
        'path',
        'project_id',
        'category_id', // Ajout ici pour pouvoir utiliser create() avec cette valeur
    ];

    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    public function category()
    {
        return $this->belongsTo(CategoryReport::class, 'category_id');
    }
}
