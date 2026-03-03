<?php

namespace App\Policies;

use App\Models\ClassModel;
use App\Models\User;

class ClassPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(?User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(?User $user, ClassModel $class): bool
    {
        return true;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->isCoach();
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, ClassModel $class): bool
    {
        return $user->id === $class->coach_id;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, ClassModel $class): bool
    {
        // Solo puede eliminar si no tiene inscripciones pagadas
        return $user->id === $class->coach_id;
    }
}
