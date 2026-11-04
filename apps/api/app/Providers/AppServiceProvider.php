<?php

namespace App\Providers;

use App\Models\User;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;

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
        Model::preventLazyLoading(! app()->isProduction());
        Gate::define('accessEditorial', fn (User $user) => $user->canAccessEditorial());
        Gate::define('manageUniverses', fn (User $user) => $user->hasEditorialRole(['super_admin', 'admin']));
        RateLimiter::for('editorial-login', fn (Request $request) => [Limit::perMinute(20)->by('login-ip:'.$request->ip()), Limit::perMinute(5)->by('login-account:'.(is_string($request->input('email')) ? mb_strtolower($request->input('email')) : 'invalid').'|'.$request->ip())]);
        RateLimiter::for('catalog', fn (Request $request) => Limit::perMinute(120)->by('catalog:'.$request->ip()));
        RateLimiter::for('quiz', fn (Request $request) => Limit::perMinute(30)->by('quiz:'.$request->ip()));
    }
}
