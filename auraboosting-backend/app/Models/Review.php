<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Review extends Model
{
    use HasFactory;

    protected $fillable = [
        'class_id',
        'student_id',
        'coach_id',
        'rating',
        'comment',
    ];

    public function class()
    {
        return $this->belongsTo(ClassModel::class);
    }

    public function student()
    {
        return $this->belongsTo(User::class, 'student_id');
    }

    public function coach()
    {
        return $this->belongsTo(User::class, 'coach_id');
    }
}
