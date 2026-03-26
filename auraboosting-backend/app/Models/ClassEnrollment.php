<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ClassEnrollment extends Model
{
    use HasFactory;

    protected $fillable = [
        'class_id',
        'student_id',
        'enrolled_at',
        'status',
        'payment_status',
    ];

    protected $casts = [
        'enrolled_at' => 'datetime',
    ];

    public function class()
    {
        return $this->belongsTo(ClassModel::class);
    }

    public function student()
    {
        return $this->belongsTo(User::class, 'student_id');
    }

    public function payment()
    {
        return $this->hasOne(Payment::class, 'enrollment_id');
    }
}
