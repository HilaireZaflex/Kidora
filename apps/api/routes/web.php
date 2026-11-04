<?php

use App\Http\Controllers\Editorial\ArticleController;
use App\Http\Controllers\Editorial\AuthController;
use App\Http\Controllers\Editorial\RevisionController;
use App\Http\Controllers\Editorial\UniverseController;
use Illuminate\Support\Facades\Route;

Route::get('/', fn () => ['service' => 'KIDORA API', 'version' => 'v1', 'catalog' => '/api/v1/universes']);

Route::prefix('administration')->name('editorial.')->group(function () {
    Route::get('/assets/editorial.css', fn () => response()->file(public_path('editorial/editorial.css'), ['Content-Type' => 'text/css']));
    Route::get('/connexion', [AuthController::class, 'create'])->name('login');
    Route::post('/connexion', [AuthController::class, 'store'])->middleware('throttle:editorial-login')->name('login.store');
    Route::middleware(['auth', 'can:accessEditorial'])->group(function () {
        Route::post('/deconnexion', [AuthController::class, 'destroy'])->name('logout');
        Route::get('/', [ArticleController::class, 'index'])->name('home');
        Route::get('/articles', [ArticleController::class, 'index'])->name('articles.index');
        Route::get('/articles/nouveau', [ArticleController::class, 'create'])->name('articles.create');
        Route::post('/articles', [ArticleController::class, 'store'])->name('articles.store');
        Route::get('/articles/{article}', [ArticleController::class, 'show'])->whereNumber('article')->name('articles.show');
        Route::post('/articles/{article}/reviser', [ArticleController::class, 'revise'])->whereNumber('article')->name('articles.revise');
        Route::post('/articles/{article}/retirer', [ArticleController::class, 'archive'])->whereNumber('article')->name('articles.archive');
        Route::get('/versions/{revision}', [RevisionController::class, 'show'])->whereNumber('revision')->name('revisions.show');
        Route::get('/versions/{revision}/modifier', [RevisionController::class, 'edit'])->whereNumber('revision')->name('revisions.edit');
        Route::post('/versions/{revision}', [RevisionController::class, 'update'])->whereNumber('revision')->name('revisions.update');
        Route::post('/versions/{revision}/transition', [RevisionController::class, 'transition'])->whereNumber('revision')->name('revisions.transition');
        Route::middleware('can:manageUniverses')->group(function () {
            Route::get('/univers', [UniverseController::class, 'index'])->name('universes.index');
            Route::post('/univers', [UniverseController::class, 'save'])->name('universes.store');
            Route::post('/univers/{universe}', [UniverseController::class, 'save'])->whereNumber('universe')->name('universes.update');
        });
    });
});
