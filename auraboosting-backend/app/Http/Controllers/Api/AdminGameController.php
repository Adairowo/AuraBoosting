<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\GameResource;
use App\Models\Game;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminGameController extends Controller
{
    use ApiResponse;

    public function index(Request $request): JsonResponse
    {
        $games = Game::query()
            ->withCount(['classes', 'coaches'])
            ->when($request->is_active, fn($q) => $q->where('is_active', filter_var($request->is_active, FILTER_VALIDATE_BOOL)))
            ->orderBy('name')
            ->paginate(15);

        return $this->paginated($games->setCollection(
            $games->getCollection()->map(fn($game) => new GameResource($game))
        ));
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'image' => ['nullable', 'url'],
            'is_active' => ['boolean'],
        ]);

        $game = Game::create($data);

        return $this->success(new GameResource($game), 'Juego creado correctamente', 201);
    }

    public function show(Game $game): JsonResponse
    {
        return $this->success(new GameResource($game->loadCount(['classes', 'coaches'])));
    }

    public function update(Request $request, Game $game): JsonResponse
    {
        $data = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'image' => ['nullable', 'url'],
            'is_active' => ['boolean'],
        ]);

        $game->update($data);

        return $this->success(new GameResource($game->loadCount(['classes', 'coaches'])), 'Juego actualizado correctamente');
    }

    public function destroy(Game $game): JsonResponse
    {
        if ($game->classes()->exists()) {
            return $this->error('No se puede eliminar un juego con clases asociadas', 400);
        }

        $game->delete();

        return $this->success(null, 'Juego eliminado correctamente');
    }
}
