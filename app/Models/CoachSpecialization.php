<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CoachSpecialization extends Model
{
    use HasFactory;

    protected $fillable = [
        'coach_id',
        'game_id',
        'level',
    ];

    public function coach()
    {
        return $this->belongsTo(User::class, 'coach_id');
    }

    public function game()
    {
        return $this->belongsTo(Game::class);
    }
}
