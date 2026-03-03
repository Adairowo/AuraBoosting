<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Enrollment\StoreEnrollmentRequest;
use App\Http\Resources\EnrollmentResource;
use App\Models\ClassEnrollment;
use App\Models\ClassModel;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class EnrollmentController extends Controller
{
    use ApiResponse;

    /**
     * Store a newly created enrollment
     */
    public function store(StoreEnrollmentRequest $request): JsonResponse
    {
        $class = ClassModel::findOrFail($request->class_id);

        // Verificar cupos disponibles
        $currentEnrollments = $class->enrollments()->count();
        if ($currentEnrollments >= $class->max_students) {
            return $this->error('No hay cupos disponibles para esta clase', 400);
        }

        // Verificar que la clase no haya empezado
        if ($class->scheduled_at->isPast()) {
            return $this->error('No puedes inscribirte a una clase que ya empezó', 400);
        }

        // Verificar que la clase no esté cancelada
        if ($class->status === 'cancelled') {
            return $this->error('No puedes inscribirte a una clase cancelada', 400);
        }

        $enrollment = ClassEnrollment::create([
            'class_id' => $request->class_id,
            'student_id' => $request->user()->id,
            'enrolled_at' => now(),
            'status' => 'enrolled',
            'payment_status' => 'pending',
        ]);

        return $this->success(
            new EnrollmentResource($enrollment->load(['class.coach', 'class.game'])),
            'Inscripción realizada exitosamente. Procede con el pago.',
            201
        );
    }

    /**
     * Get enrollments of authenticated student
     */
    public function myEnrollments(Request $request): JsonResponse
    {
        $enrollments = $request->user()->enrollments()
            ->with(['class.coach', 'class.game', 'payment'])
            ->when($request->status, fn($q) => $q->where('status', $request->status))
            ->when($request->payment_status, fn($q) => $q->where('payment_status', $request->payment_status))
            ->orderBy('enrolled_at', 'desc')
            ->paginate(15);

        return $this->paginated($enrollments->setCollection(
            $enrollments->getCollection()->map(fn($enrollment) => new EnrollmentResource($enrollment))
        ));
    }

    /**
     * Cancel an enrollment
     */
    public function cancel(Request $request, ClassEnrollment $enrollment): JsonResponse
    {
        // Verificar que el estudiante sea el dueño
        if ($enrollment->student_id !== $request->user()->id) {
            return $this->error('No tienes permiso para cancelar esta inscripción', 403);
        }

        // Verificar que no haya sido pagada
        if ($enrollment->payment_status === 'paid') {
            return $this->error('No puedes cancelar una inscripción ya pagada. Solicita un reembolso.', 400);
        }

        $enrollment->delete();

        return $this->success(null, 'Inscripción cancelada exitosamente');
    }
}
