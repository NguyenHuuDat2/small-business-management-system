<?php

use Illuminate\Support\Facades\Route;

Route::get('/health', function () {
    return response('ok', 200)
        ->header('Content-Type', 'text/plain');
});

Route::get('/', function () {
    return response('ok', 200)
        ->header('Content-Type', 'text/plain');
});