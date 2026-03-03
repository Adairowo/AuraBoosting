<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Game extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'image',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function classes()
    {
        return $this->hasMany(ClassModel::class);
    }

    public function coaches()
    {
        return $this->belongsToMany(User::class, 'coach_specializations', 'game_id', 'coach_id');
    }

    public function specializations()
    {
        return $this->hasMany(CoachSpecialization::class);
    }
}
