<?php

use Illuminate\Support\Facades\Route;
use App\Livewire\Admin\Users;

// Route::get('/admin/users', Users::class)->name('admin.users');

Route::get('/', Users::class)->name('admin.users');