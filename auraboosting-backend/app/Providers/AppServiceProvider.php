<?php

namespace App\Providers;

use App\Models\ClassEnrollment;
use App\Models\ClassModel;
use App\Models\Review;
use App\Policies\ClassPolicy;
use App\Policies\EnrollmentPolicy;
use App\Policies\ReviewPolicy;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Cache\RateLimiting\Limit;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Register policies
        Gate::policy(ClassModel::class, ClassPolicy::class);
        Gate::policy(ClassEnrollment::class, EnrollmentPolicy::class);
        Gate::policy(Review::class, ReviewPolicy::class);

        RateLimiter::for('api', function (Request $request) {
            return Limit::perMinute(60)->by($request->user()?->id ?: $request->ip());
        });
    }
}
