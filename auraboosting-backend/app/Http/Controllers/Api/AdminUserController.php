<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\User;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class AdminUserController extends Controller
{
    use ApiResponse;

    public function index(Request $request): JsonResponse
    {
        $users = User::query()
            ->with(['specializations.game'])
            ->when($request->role, fn($q) => $q->where('role', $request->role))
            ->when($request->verified, function ($q) use ($request) {
                $value = filter_var($request->verified, FILTER_VALIDATE_BOOL, FILTER_NULL_ON_FAILURE);
                if ($value !== null) {
                    $q->where('is_verified', $value);
                }
            })
            ->when($request->search, function ($q) use ($request) {
                $q->where(function ($query) use ($request) {
                    $query->where('name', 'like', "%{$request->search}%")
                        ->orWhere('email', 'like', "%{$request->search}%");
                });
            })
            ->orderByDesc('created_at')
            ->paginate(15);

        return $this->paginated($users->setCollection(
            $users->getCollection()->map(fn($user) => new UserResource($user))
        ));
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8'],
            'role' => ['required', Rule::in(['admin', 'coach', 'student'])],
            'bio' => ['nullable', 'string'],
            'avatar' => ['nullable', 'url'],
            'rating' => ['nullable', 'numeric', 'min:0', 'max:5'],
            'is_verified' => ['boolean'],
            'experience_years' => ['nullable', 'integer', 'min:0'],
            'specialties' => ['nullable', 'array'],
        ]);

        $user = User::create($data);

        return $this->success(
            new UserResource($user->load('specializations.game')),
            'Usuario creado correctamente',
            201
        );
    }

    public function show(User $user): JsonResponse
    {
        return $this->success(new UserResource($user->load('specializations.game')));
    }

    public function update(Request $request, User $user): JsonResponse
    {
        $data = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'email' => ['sometimes', 'email', Rule::unique('users', 'email')->ignore($user->id)],
            'password' => ['sometimes', 'string', 'min:8'],
            'role' => ['sometimes', Rule::in(['admin', 'coach', 'student'])],
            'bio' => ['nullable', 'string'],
            'avatar' => ['nullable', 'url'],
            'rating' => ['nullable', 'numeric', 'min:0', 'max:5'],
            'is_verified' => ['boolean'],
            'experience_years' => ['nullable', 'integer', 'min:0'],
            'specialties' => ['nullable', 'array'],
        ]);

        if (empty($data['password'])) {
            unset($data['password']);
        }

        $user->update($data);

        return $this->success(new UserResource($user->load('specializations.game')), 'Usuario actualizado correctamente');
    }

    public function destroy(Request $request, User $user): JsonResponse
    {
        if ($request->user()->id === $user->id) {
            return $this->error('No puedes eliminar tu propio usuario', 400);
        }

        $user->delete();

        return $this->success(null, 'Usuario eliminado correctamente');
    }
}
