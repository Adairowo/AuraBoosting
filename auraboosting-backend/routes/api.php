<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ClassController;
use App\Http\Controllers\Api\CoachController;
use App\Http\Controllers\Api\EnrollmentController;
use App\Http\Controllers\Api\GameController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\ReviewController;
use App\Http\Controllers\Api\AdminDashboardController;
use App\Http\Controllers\Api\AdminUserController;
use App\Http\Controllers\Api\AdminGameController;
use App\Http\Controllers\Api\AdminClassController;
use App\Http\Controllers\Api\AdminEnrollmentController;
use App\Http\Controllers\Api\AdminPaymentController;
use App\Http\Controllers\Api\AdminReviewController;
use App\Http\Controllers\Api\AdminSpecializationController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// API v1
Route::prefix('v1')->group(function () {
    
    // Public routes
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    
    // Games
    Route::get('/games', [GameController::class, 'index']);
    Route::get('/games/{game}', [GameController::class, 'show']);
    
    // Classes (public listing)
    Route::get('/classes', [ClassController::class, 'index']);
    Route::get('/classes/{class}', [ClassController::class, 'show']);
    
    // Coaches (public listing)
    Route::get('/coaches', [CoachController::class, 'index']);
    Route::get('/coaches/{coach}', [CoachController::class, 'show']);
    
    // Protected routes (require authentication)
    Route::middleware('auth:sanctum')->group(function () {
        
        // Auth
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/me', [AuthController::class, 'me']);
        
        // Classes (Coach only)
        Route::middleware('coach')->group(function () {
            Route::post('/classes', [ClassController::class, 'store']);
            Route::put('/classes/{class}', [ClassController::class, 'update']);
            Route::delete('/classes/{class}', [ClassController::class, 'destroy']);
            Route::patch('/classes/{class}/status', [ClassController::class, 'updateStatus']);
            Route::get('/my-classes', [ClassController::class, 'myClasses']);
        });
        
        // Enrollments (Student)
        Route::post('/enrollments', [EnrollmentController::class, 'store']);
        Route::get('/my-enrollments', [EnrollmentController::class, 'myEnrollments']);
        Route::delete('/enrollments/{enrollment}', [EnrollmentController::class, 'cancel']);
        
        // Payments
        Route::post('/payments', [PaymentController::class, 'store']);
        Route::get('/payments/{payment}', [PaymentController::class, 'show']);
        Route::post('/payments/{payment}/confirm', [PaymentController::class, 'confirm']);
        
        // Reviews (Student)
        Route::post('/reviews', [ReviewController::class, 'store']);
        Route::put('/reviews/{review}', [ReviewController::class, 'update']);
        Route::delete('/reviews/{review}', [ReviewController::class, 'destroy']);
    });

    // Admin routes
    Route::prefix('admin')->middleware(['auth:sanctum', 'admin'])->group(function () {
        // Dashboard
        Route::get('/dashboard', [AdminDashboardController::class, 'index']);

        // Users
        Route::get('/users', [AdminUserController::class, 'index']);
        Route::post('/users', [AdminUserController::class, 'store']);
        Route::get('/users/{user}', [AdminUserController::class, 'show']);
        Route::put('/users/{user}', [AdminUserController::class, 'update']);
        Route::delete('/users/{user}', [AdminUserController::class, 'destroy']);

        // Games
        Route::get('/games', [AdminGameController::class, 'index']);
        Route::post('/games', [AdminGameController::class, 'store']);
        Route::get('/games/{game}', [AdminGameController::class, 'show']);
        Route::put('/games/{game}', [AdminGameController::class, 'update']);
        Route::delete('/games/{game}', [AdminGameController::class, 'destroy']);

        // Classes
        Route::get('/classes', [AdminClassController::class, 'index']);
        Route::get('/classes/{class}', [AdminClassController::class, 'show']);
        Route::put('/classes/{class}', [AdminClassController::class, 'update']);
        Route::delete('/classes/{class}', [AdminClassController::class, 'destroy']);

        // Enrollments
        Route::get('/enrollments', [AdminEnrollmentController::class, 'index']);
        Route::get('/enrollments/{enrollment}', [AdminEnrollmentController::class, 'show']);
        Route::patch('/enrollments/{enrollment}/status', [AdminEnrollmentController::class, 'updateStatus']);

        // Payments
        Route::get('/payments', [AdminPaymentController::class, 'index']);
        Route::get('/payments/{payment}', [AdminPaymentController::class, 'show']);
        Route::post('/payments/{payment}/confirm', [AdminPaymentController::class, 'confirm']);
        Route::post('/payments/{payment}/refund', [AdminPaymentController::class, 'refund']);

        // Reviews
        Route::get('/reviews', [AdminReviewController::class, 'index']);
        Route::get('/reviews/{review}', [AdminReviewController::class, 'show']);
        Route::delete('/reviews/{review}', [AdminReviewController::class, 'destroy']);

        // Coach specializations
        Route::get('/specializations', [AdminSpecializationController::class, 'index']);
        Route::post('/specializations', [AdminSpecializationController::class, 'store']);
        Route::delete('/specializations/{specialization}', [AdminSpecializationController::class, 'destroy']);
    });
});
