<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\GameResource;
use App\Models\Game;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class GameController extends Controller
{
    use ApiResponse;

    /**
     * Display a listing of games
     */
    public function index(Request $request): JsonResponse
    {
        $games = Game::query()
            ->when($request->is_active, fn($q) => $q->where('is_active', true))
            ->withCount(['classes', 'coaches'])
            ->orderBy('name')
            ->paginate(15);

        return $this->paginated($games->setCollection(
            $games->getCollection()->map(fn($game) => new GameResource($game))
        ));
    }

    /**
     * Display the specified game
     */
    public function show(Game $game): JsonResponse
    {
        $game->loadCount(['classes', 'coaches']);

        return $this->success(new GameResource($game));
    }
}
