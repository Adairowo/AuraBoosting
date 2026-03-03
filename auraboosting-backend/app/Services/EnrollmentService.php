<?php

namespace App\Services;

use App\Models\ClassEnrollment;
use App\Models\ClassModel;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class EnrollmentService
{
    /**
     * Enroll a student in a class
     */
    public function enrollStudent(User $student, ClassModel $class): ClassEnrollment
    {
        // Validaciones
        $this->validateEnrollment($student, $class);

        return DB::transaction(function () use ($student, $class) {
            return ClassEnrollment::create([
                'class_id' => $class->id,
                'student_id' => $student->id,
                'enrolled_at' => now(),
                'status' => 'enrolled',
                'payment_status' => 'pending',
            ]);
        });
    }

    /**
     * Mark student as attended
     */
    public function markAsAttended(ClassEnrollment $enrollment): void
    {
        $enrollment->update(['status' => 'attended']);
    }

    /**
     * Mark student as missed
     */
    public function markAsMissed(ClassEnrollment $enrollment): void
    {
        $enrollment->update(['status' => 'missed']);
    }

    /**
     * Validate enrollment conditions
     */
    private function validateEnrollment(User $student, ClassModel $class): void
    {
        // Verificar cupos disponibles
        $currentEnrollments = $class->enrollments()->count();
        if ($currentEnrollments >= $class->max_students) {
            throw new \Exception('No hay cupos disponibles para esta clase');
        }

        // Verificar que la clase no haya empezado
        if ($class->scheduled_at->isPast()) {
            throw new \Exception('No puedes inscribirte a una clase que ya empezó');
        }

        // Verificar que la clase no esté cancelada
        if ($class->status === 'cancelled') {
            throw new \Exception('No puedes inscribirte a una clase cancelada');
        }

        // Verificar que el estudiante no esté ya inscrito
        $existingEnrollment = ClassEnrollment::where('class_id', $class->id)
            ->where('student_id', $student->id)
            ->whereIn('status', ['enrolled', 'attended'])
            ->exists();

        if ($existingEnrollment) {
            throw new \Exception('Ya estás inscrito en esta clase');
        }
    }
}
