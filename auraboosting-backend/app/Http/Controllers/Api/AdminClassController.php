<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ClassResource;
use App\Models\ClassModel;
use App\Models\User;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminClassController extends Controller
{
    use ApiResponse;

    public function index(Request $request): JsonResponse
    {
        $classes = ClassModel::query()
            ->with(['coach', 'game'])
            ->when($request->game_id, fn($q) => $q->where('game_id', $request->game_id))
            ->when($request->coach_id, fn($q) => $q->where('coach_id', $request->coach_id))
            ->when($request->status, fn($q) => $q->where('status', $request->status))
            ->orderByDesc('scheduled_at')
            ->paginate(15);

        return $this->paginated($classes->setCollection(
            $classes->getCollection()->map(fn($class) => new ClassResource($class))
        ));
    }

    public function show(ClassModel $class): JsonResponse
    {
        $class->load(['coach.specializations.game', 'game', 'enrollments.student', 'reviews.student']);

        return $this->success(new ClassResource($class));
    }

    public function update(Request $request, ClassModel $class): JsonResponse
    {
        $data = $request->validate([
            'coach_id' => ['sometimes', 'exists:users,id'],
            'game_id' => ['sometimes', 'exists:games,id'],
            'title' => ['sometimes', 'string', 'max:255'],
            'description' => ['sometimes', 'string'],
            'duration' => ['sometimes', 'integer', 'min:15', 'max:480'],
            'price' => ['sometimes', 'numeric', 'min:0', 'max:999999.99'],
            'max_students' => ['sometimes', 'integer', 'min:1', 'max:50'],
            'scheduled_at' => ['sometimes', 'date'],
            'status' => ['sometimes', 'in:scheduled,in_progress,completed,cancelled'],
            'meeting_link' => ['nullable', 'url'],
        ]);

        if (isset($data['coach_id'])) {
            $coach = User::where('id', $data['coach_id'])->where('role', 'coach')->first();
            if (!$coach) {
                return $this->error('El coach seleccionado no es válido', 400);
            }
        }

        $class->update($data);

        return $this->success(new ClassResource($class->load(['coach', 'game'])), 'Clase actualizada correctamente');
    }

    public function destroy(ClassModel $class): JsonResponse
    {
        if ($class->enrollments()->where('payment_status', 'paid')->count() > 0) {
            return $this->error('No se puede eliminar una clase con inscripciones pagadas', 400);
        }

        $class->delete();

        return $this->success(null, 'Clase eliminada correctamente');
    }
}
