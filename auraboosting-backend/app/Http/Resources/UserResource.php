<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'role' => $this->role,
            'bio' => $this->bio,
            'avatar' => $this->avatar,
            'rating' => $this->rating ? (float) $this->rating : null,
            'is_verified' => $this->is_verified,
            'experience_years' => $this->when($this->isCoach(), $this->experience_years),
            'specialties' => $this->when($this->isCoach(), $this->specialties),
            'specializations' => SpecializationResource::collection($this->whenLoaded('specializations')),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
