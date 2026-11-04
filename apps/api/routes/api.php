<?php

use App\Http\Controllers\CatalogController;
use App\Http\Controllers\QuizController;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->middleware('throttle:catalog')->group(function () {
    Route::get('/health', function () {
        DB::select('SELECT 1');

        return ['status' => 'ok', 'database' => 'connected'];
    });
    Route::get('/universes', [CatalogController::class, 'universes']);
    Route::get('/universes/{slug}', [CatalogController::class, 'universe']);
    Route::get('/articles', [CatalogController::class, 'articles']);
    Route::get('/articles/{slug}', [CatalogController::class, 'article']);
    Route::post('/quizzes/{id}/submit', [QuizController::class, 'submit'])->whereNumber('id')->middleware('throttle:quiz');
});
