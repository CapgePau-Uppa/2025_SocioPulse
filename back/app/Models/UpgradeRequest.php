<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UpgradeRequest extends Model
{
    protected $table = 'upgrade_request';
    protected $fillable = [
        'role_id',
        'user_id'
    ];
    public function user()
    {
        return $this->belongsTo(User::class); // A project belongs to a user
    }
}
