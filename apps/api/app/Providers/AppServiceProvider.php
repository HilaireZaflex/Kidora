<?php

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
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
        RateLimiter::for('catalog', fn (Request $request) => Limit::perMinute(120)->by('catalog:'.$request->ip()));
        RateLimiter::for('quiz', fn (Request $request) => Limit::perMinute(30)->by('quiz:'.$request->ip()));
    }
}
