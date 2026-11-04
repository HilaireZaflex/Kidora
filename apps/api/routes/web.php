<?php

use Illuminate\Support\Facades\Route;

Route::get('/', fn () => ['service' => 'KIDORA API', 'version' => 'v1', 'catalog' => '/api/v1/universes']);
