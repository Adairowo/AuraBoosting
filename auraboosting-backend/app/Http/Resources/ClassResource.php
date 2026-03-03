<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ClassResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $enrollmentsCount = $this->enrollments()->count();
        
        return [
            'id' => $this->id,
            'title' => $this->title,
            'description' => $this->description,
            'duration' => $this->duration,
            'price' => (float) $this->price,
            'max_students' => $this->max_students,
            'available_spots' => $this->max_students - $enrollmentsCount,
            'enrolled_students' => $enrollmentsCount,
            'scheduled_at' => $this->scheduled_at?->toISOString(),
            'status' => $this->status,
            'meeting_link' => $this->when(
                $request->user()?->id === $this->coach_id || 
                $this->enrollments()->where('student_id', $request->user()?->id)->exists(),
                $this->meeting_link
            ),
            'coach' => new UserResource($this->whenLoaded('coach')),
            'game' => new GameResource($this->whenLoaded('game')),
            'enrollments' => EnrollmentResource::collection($this->whenLoaded('enrollments')),
            'reviews' => ReviewResource::collection($this->whenLoaded('reviews')),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
