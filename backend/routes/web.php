<?php

use Illuminate\Support\Facades\Route;

Route::get('/health', function () {
    return response('ok', 200);
});

Route::get('/', function () {
    return response('ok', 200);
});