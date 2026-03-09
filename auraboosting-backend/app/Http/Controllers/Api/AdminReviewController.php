<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ReviewResource;
use App\Models\Review;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminReviewController extends Controller
{
    use ApiResponse;

    public function index(Request $request): JsonResponse
    {
        $reviews = Review::query()
            ->with(['student', 'coach', 'class'])
            ->when($request->rating, fn($q) => $q->where('rating', $request->rating))
            ->when($request->coach_id, fn($q) => $q->where('coach_id', $request->coach_id))
            ->when($request->class_id, fn($q) => $q->where('class_id', $request->class_id))
            ->orderByDesc('created_at')
            ->paginate(15);

        return $this->paginated($reviews->setCollection(
            $reviews->getCollection()->map(fn($review) => new ReviewResource($review))
        ));
    }

    public function show(Review $review): JsonResponse
    {
        return $this->success(new ReviewResource($review->load(['student', 'coach', 'class'])));
    }

    public function destroy(Review $review): JsonResponse
    {
        $review->delete();

        return $this->success(null, 'Reseña eliminada correctamente');
    }
}
