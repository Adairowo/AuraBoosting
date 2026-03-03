<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasApiTokens;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'bio',
        'avatar',
        'rating',
        'is_verified',
        'experience_years',
        'specialties',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_verified' => 'boolean',
            'rating' => 'decimal:1',
            'specialties' => 'array',
        ];
    }

    // Relationships as Coach
    public function classes()
    {
        return $this->hasMany(ClassModel::class, 'coach_id');
    }

    public function specializations()
    {
        return $this->hasMany(CoachSpecialization::class, 'coach_id');
    }

    public function reviewsReceived()
    {
        return $this->hasMany(Review::class, 'coach_id');
    }

    public function games()
    {
        return $this->belongsToMany(Game::class, 'coach_specializations', 'coach_id', 'game_id')
            ->withPivot('level')
            ->withTimestamps();
    }

    // Relationships as Student
    public function enrollments()
    {
        return $this->hasMany(ClassEnrollment::class, 'student_id');
    }

    public function enrolledClasses()
    {
        return $this->belongsToMany(ClassModel::class, 'class_enrollments', 'student_id', 'class_id')
            ->withPivot('enrolled_at', 'status', 'payment_status')
            ->withTimestamps();
    }

    public function reviewsGiven()
    {
        return $this->hasMany(Review::class, 'student_id');
    }

    // Helper methods
    public function isCoach()
    {
        return $this->role === 'coach';
    }

    public function isStudent()
    {
        return $this->role === 'student';
    }

    public function isAdmin()
    {
        return $this->role === 'admin';
    }
}
