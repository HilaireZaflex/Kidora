<?php

use App\Http\Middleware\EditorialHeaders;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\HttpException;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(web: __DIR__.'/../routes/web.php', api: __DIR__.'/../routes/api.php', commands: __DIR__.'/../routes/console.php', health: '/up')
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->redirectGuestsTo('/administration/connexion');
        $middleware->append(EditorialHeaders::class);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->render(function (AuthenticationException $e, Request $request) {
            if ($request->is('administration', 'administration/*') && ! $request->expectsJson()) {
                return redirect()->away('/administration/connexion');
            }
        });
        $exceptions->render(function (ValidationException $e, Request $request) {
            if (! $request->is('administration', 'administration/*') || $request->expectsJson()) {
                return null;
            }
            $target = match (true) {
                $request->routeIs('editorial.login.store') => '/administration/connexion',
                $request->routeIs('editorial.articles.store') => '/administration/articles/nouveau',
                $request->routeIs('editorial.revisions.update') => '/administration/versions/'.$request->route('revision')->id.'/modifier',
                $request->routeIs('editorial.revisions.transition') => '/administration/versions/'.$request->route('revision')->id,
                $request->routeIs('editorial.universes.*') => '/administration/univers',
                default => '/administration',
            };

            return redirect()->away($target, 303)->withErrors($e->errors())->withInput($request->except(array_merge(['password', 'password_confirmation', 'current_password', '_token'], array_keys($e->errors()))));
        });
        $exceptions->render(function (HttpException $e, Request $request) {
            if ($request->is('administration', 'administration/*') && ! $request->expectsJson() && in_array($e->getStatusCode(), [403, 409, 419, 429], true)) {
                return response()->view('editorial.error', ['statusCode' => $e->getStatusCode()], $e->getStatusCode());
            }
        });
        $exceptions->shouldRenderJsonWhen(fn (Request $request, Throwable $e) => $request->is('api/*') || $request->expectsJson());
    })->create();
