<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CategoryReport extends Model
{
    use HasFactory;

    protected $table = 'table_category_report';

    protected $fillable = [
        'project_id',
        'name',
    ];

    // Relation with Project
    public function project()
    {
        return $this->belongsTo(Project::class);
    }
}
