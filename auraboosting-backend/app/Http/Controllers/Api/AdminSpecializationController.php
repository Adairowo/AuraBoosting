<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\SpecializationResource;
use App\Models\CoachSpecialization;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class AdminSpecializationController extends Controller
{
    use ApiResponse;

    public function index(Request $request): JsonResponse
    {
        $specializations = CoachSpecialization::query()
            ->with(['coach', 'game'])
            ->when($request->coach_id, fn($q) => $q->where('coach_id', $request->coach_id))
            ->when($request->game_id, fn($q) => $q->where('game_id', $request->game_id))
            ->orderByDesc('created_at')
            ->paginate(15);

        return $this->paginated($specializations->setCollection(
            $specializations->getCollection()->map(fn($spec) => new SpecializationResource($spec))
        ));
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'coach_id' => ['required', Rule::exists('users', 'id')->where('role', 'coach')],
            'game_id' => ['required', 'exists:games,id'],
            'level' => ['required', Rule::in(['beginner', 'intermediate', 'expert'])],
        ]);

        $exists = CoachSpecialization::where('coach_id', $data['coach_id'])
            ->where('game_id', $data['game_id'])
            ->exists();

        if ($exists) {
            return $this->error('El coach ya tiene esta especialización', 409);
        }

        $specialization = CoachSpecialization::create($data);

        return $this->success(new SpecializationResource($specialization->load(['coach', 'game'])), 'Especialización creada correctamente', 201);
    }

    public function destroy(CoachSpecialization $specialization): JsonResponse
    {
        $specialization->delete();

        return $this->success(null, 'Especialización eliminada correctamente');
    }
}
