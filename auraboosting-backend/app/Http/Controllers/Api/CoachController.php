<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\User;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CoachController extends Controller
{
    use ApiResponse;

    /**
     * Display a listing of coaches
     */
    public function index(Request $request): JsonResponse
    {
        $coaches = User::query()
            ->where('role', 'coach')
            ->when($request->game_id, function($q) use ($request) {
                $q->whereHas('specializations', function($query) use ($request) {
                    $query->where('game_id', $request->game_id);
                });
            })
            ->when($request->is_verified, fn($q) => $q->where('is_verified', true))
            ->when($request->min_rating, fn($q) => $q->where('rating', '>=', $request->min_rating))
            ->with(['specializations.game'])
            ->withCount('classes')
            ->orderBy('rating', 'desc')
            ->paginate(15);

        return $this->paginated($coaches->setCollection(
            $coaches->getCollection()->map(fn($coach) => new UserResource($coach))
        ));
    }

    /**
     * Display the specified coach
     */
    public function show(User $coach): JsonResponse
    {
        if (!$coach->isCoach()) {
            return $this->error('El usuario no es un coach', 404);
        }

        $coach->load([
            'specializations.game',
            'classes' => fn($q) => $q->where('status', 'completed')->latest()->take(5),
            'reviewsReceived.student',
        ]);

        $coach->loadCount('classes');

        return $this->success(new UserResource($coach));
    }
}
