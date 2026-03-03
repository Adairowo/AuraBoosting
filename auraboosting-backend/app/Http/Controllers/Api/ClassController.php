<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Class\StoreClassRequest;
use App\Http\Requests\Class\UpdateClassRequest;
use App\Http\Resources\ClassResource;
use App\Models\ClassModel;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ClassController extends Controller
{
    use ApiResponse;

    /**
     * Display a listing of classes
     */
    public function index(Request $request): JsonResponse
    {
        $classes = ClassModel::query()
            ->with(['coach', 'game'])
            ->when($request->game_id, fn($q) => $q->where('game_id', $request->game_id))
            ->when($request->coach_id, fn($q) => $q->where('coach_id', $request->coach_id))
            ->when($request->status, fn($q) => $q->where('status', $request->status))
            ->when($request->upcoming, fn($q) => $q->where('scheduled_at', '>=', now()))
            ->orderBy('scheduled_at', $request->order ?? 'asc')
            ->paginate(15);

        return $this->paginated($classes->setCollection(
            $classes->getCollection()->map(fn($class) => new ClassResource($class))
        ));
    }

    /**
     * Store a newly created class
     */
    public function store(StoreClassRequest $request): JsonResponse
    {
        // Verificar especialización del coach
        if (!$request->user()->specializations()->where('game_id', $request->game_id)->exists()) {
            return $this->error('No tienes especialización en este juego', 403);
        }

        $class = $request->user()->classes()->create([
            ...$request->validated(),
            'coach_id' => $request->user()->id,
        ]);

        return $this->success(
            new ClassResource($class->load(['coach', 'game'])),
            'Clase creada exitosamente',
            201
        );
    }

    /**
     * Display the specified class
     */
    public function show(ClassModel $class): JsonResponse
    {
        $class->load(['coach', 'game', 'enrollments.student']);

        return $this->success(new ClassResource($class));
    }

    /**
     * Update the specified class
     */
    public function update(UpdateClassRequest $request, ClassModel $class): JsonResponse
    {
        $this->authorize('update', $class);

        $class->update($request->validated());

        return $this->success(
            new ClassResource($class->load(['coach', 'game'])),
            'Clase actualizada exitosamente'
        );
    }

    /**
     * Remove the specified class
     */
    public function destroy(Request $request, ClassModel $class): JsonResponse
    {
        $this->authorize('delete', $class);

        if ($class->enrollments()->where('payment_status', 'paid')->count() > 0) {
            return $this->error('No se puede eliminar una clase con inscripciones pagadas', 400);
        }

        $class->delete();

        return $this->success(null, 'Clase eliminada exitosamente');
    }

    /**
     * Get classes of authenticated coach
     */
    public function myClasses(Request $request): JsonResponse
    {
        if (!$request->user()->isCoach()) {
            return $this->error('Solo los coaches pueden acceder a esta ruta', 403);
        }

        $classes = $request->user()->classes()
            ->with(['game', 'enrollments.student'])
            ->orderBy('scheduled_at', 'desc')
            ->paginate(15);

        return $this->paginated($classes->setCollection(
            $classes->getCollection()->map(fn($class) => new ClassResource($class))
        ));
    }

    /**
     * Update class status
     */
    public function updateStatus(Request $request, ClassModel $class): JsonResponse
    {
        $this->authorize('update', $class);

        $request->validate([
            'status' => 'required|in:scheduled,in_progress,completed,cancelled',
        ]);

        $class->update(['status' => $request->status]);

        return $this->success(
            new ClassResource($class->load(['coach', 'game'])),
            'Estado actualizado exitosamente'
        );
    }
}
