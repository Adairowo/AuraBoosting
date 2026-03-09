<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\EnrollmentResource;
use App\Http\Resources\GameResource;
use App\Http\Resources\ReviewResource;
use App\Http\Resources\UserResource;
use App\Models\ClassEnrollment;
use App\Models\ClassModel;
use App\Models\Game;
use App\Models\Payment;
use App\Models\Review;
use App\Models\User;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;

class AdminDashboardController extends Controller
{
    use ApiResponse;

    public function index(): JsonResponse
    {
        $usersByRole = User::selectRaw('role, COUNT(*) as total')->groupBy('role')->pluck('total', 'role');
        $classesByStatus = ClassModel::selectRaw('status, COUNT(*) as total')->groupBy('status')->pluck('total', 'status');
        $enrollmentsByStatus = ClassEnrollment::selectRaw('status, COUNT(*) as total')->groupBy('status')->pluck('total', 'status');

        $totalRevenue = Payment::where('status', 'completed')->sum('amount');

        $recentEnrollments = ClassEnrollment::with(['student', 'class.game'])
            ->orderByDesc('created_at')
            ->take(5)
            ->get();

        $recentReviews = Review::with(['student', 'coach', 'class'])
            ->orderByDesc('created_at')
            ->take(5)
            ->get();

        $topCoaches = User::where('role', 'coach')
            ->orderByDesc('rating')
            ->orderByDesc('is_verified')
            ->take(5)
            ->get();

        $popularGames = Game::withCount('classes')
            ->orderByDesc('classes_count')
            ->take(5)
            ->get();

        return $this->success([
            'users' => [
                'total' => User::count(),
                'by_role' => [
                    'coach' => $usersByRole['coach'] ?? 0,
                    'student' => $usersByRole['student'] ?? 0,
                    'admin' => $usersByRole['admin'] ?? 0,
                ],
            ],
            'classes' => [
                'total' => ClassModel::count(),
                'by_status' => $classesByStatus,
            ],
            'enrollments' => [
                'total' => ClassEnrollment::count(),
                'by_status' => $enrollmentsByStatus,
            ],
            'payments' => [
                'total_revenue' => (float) $totalRevenue,
                'completed' => Payment::where('status', 'completed')->count(),
                'pending' => Payment::where('status', 'pending')->count(),
                'refunded' => Payment::where('status', 'refunded')->count(),
            ],
            'recent_enrollments' => EnrollmentResource::collection($recentEnrollments),
            'recent_reviews' => ReviewResource::collection($recentReviews),
            'top_coaches' => UserResource::collection($topCoaches),
            'popular_games' => GameResource::collection($popularGames),
        ], 'Resumen del panel de administración');
    }
}
