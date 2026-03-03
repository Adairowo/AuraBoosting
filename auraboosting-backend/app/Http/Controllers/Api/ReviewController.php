<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Review\StoreReviewRequest;
use App\Http\Requests\Review\UpdateReviewRequest;
use App\Http\Resources\ReviewResource;
use App\Models\ClassEnrollment;
use App\Models\Review;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    use ApiResponse;

    /**
     * Store a newly created review
     */
    public function store(StoreReviewRequest $request): JsonResponse
    {
        // Verificar que el estudiante haya asistido a la clase
        $enrollment = ClassEnrollment::where('class_id', $request->class_id)
            ->where('student_id', $request->user()->id)
            ->where('status', 'attended')
            ->first();

        if (!$enrollment) {
            return $this->error('Solo puedes dejar reseñas de clases a las que asististe', 403);
        }

        // Verificar que no haya dejado ya una reseña
        $existingReview = Review::where('class_id', $request->class_id)
            ->where('student_id', $request->user()->id)
            ->first();

        if ($existingReview) {
            return $this->error('Ya has dejado una reseña para esta clase', 400);
        }

        $review = Review::create([
            'class_id' => $request->class_id,
            'student_id' => $request->user()->id,
            'coach_id' => $request->coach_id,
            'rating' => $request->rating,
            'comment' => $request->comment,
        ]);

        // Actualizar rating del coach
        $this->updateCoachRating($request->coach_id);

        return $this->success(
            new ReviewResource($review->load(['class', 'student', 'coach'])),
            'Reseña creada exitosamente',
            201
        );
    }

    /**
     * Update the specified review
     */
    public function update(UpdateReviewRequest $request, Review $review): JsonResponse
    {
        if ($review->student_id !== $request->user()->id) {
            return $this->error('No tienes permiso para editar esta reseña', 403);
        }

        $review->update($request->validated());

        // Actualizar rating del coach
        $this->updateCoachRating($review->coach_id);

        return $this->success(
            new ReviewResource($review->load(['class', 'student', 'coach'])),
            'Reseña actualizada exitosamente'
        );
    }

    /**
     * Remove the specified review
     */
    public function destroy(Request $request, Review $review): JsonResponse
    {
        if ($review->student_id !== $request->user()->id) {
            return $this->error('No tienes permiso para eliminar esta reseña', 403);
        }

        $coachId = $review->coach_id;
        $review->delete();

        // Actualizar rating del coach
        $this->updateCoachRating($coachId);

        return $this->success(null, 'Reseña eliminada exitosamente');
    }

    /**
     * Update coach average rating
     */
    private function updateCoachRating(int $coachId): void
    {
        $averageRating = Review::where('coach_id', $coachId)->avg('rating');
        
        \App\Models\User::find($coachId)->update([
            'rating' => $averageRating ? round($averageRating, 1) : null,
        ]);
    }
}
