<?php

namespace App\Policies;

use App\Models\ClassEnrollment;
use App\Models\User;

class EnrollmentPolicy
{
    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, ClassEnrollment $enrollment): bool
    {
        return $user->id === $enrollment->student_id || 
               $user->id === $enrollment->class->coach_id;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->isStudent();
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, ClassEnrollment $enrollment): bool
    {
        // Solo el coach puede actualizar el status (attended, missed)
        return $user->id === $enrollment->class->coach_id;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, ClassEnrollment $enrollment): bool
    {
        // Solo el estudiante puede cancelar si no está pagada
        return $user->id === $enrollment->student_id && 
               $enrollment->payment_status !== 'paid';
    }
}
