<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\EnrollmentResource;
use App\Models\ClassEnrollment;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminEnrollmentController extends Controller
{
    use ApiResponse;

    public function index(Request $request): JsonResponse
    {
        $enrollments = ClassEnrollment::query()
            ->with(['class.game', 'student', 'payment'])
            ->when($request->status, fn($q) => $q->where('status', $request->status))
            ->when($request->payment_status, fn($q) => $q->where('payment_status', $request->payment_status))
            ->when($request->class_id, fn($q) => $q->where('class_id', $request->class_id))
            ->when($request->student_id, fn($q) => $q->where('student_id', $request->student_id))
            ->orderByDesc('created_at')
            ->paginate(15);

        return $this->paginated($enrollments->setCollection(
            $enrollments->getCollection()->map(fn($enrollment) => new EnrollmentResource($enrollment))
        ));
    }

    public function show(ClassEnrollment $enrollment): JsonResponse
    {
        return $this->success(new EnrollmentResource($enrollment->load(['class.game', 'student', 'payment'])));
    }

    public function updateStatus(Request $request, ClassEnrollment $enrollment): JsonResponse
    {
        $data = $request->validate([
            'status' => ['required', 'in:enrolled,attended,missed'],
            'payment_status' => ['sometimes', 'in:pending,paid,refunded'],
        ]);

        $enrollment->update($data);

        return $this->success(new EnrollmentResource($enrollment->load(['class.game', 'student', 'payment'])), 'Inscripción actualizada correctamente');
    }
}
