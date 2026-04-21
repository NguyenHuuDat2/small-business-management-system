<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Admin\AdminAuthController;
use App\Livewire\Admin\Dashboard;
use App\Livewire\Admin\Users\Index as UsersIndex;
use App\Livewire\Admin\Roles\Index as RolesIndex;
use App\Livewire\Admin\Menus\Index as MenusIndex;
use App\Livewire\Admin\RolePermissions\Index as RolePermissionsIndex;
use App\Livewire\Admin\Employees\Index as EmployeesIndex;
use App\Livewire\Admin\Departments\Index as DepartmentsIndex;
use App\Livewire\Admin\Invoices\Index as InvoicesIndex;
use App\Livewire\Admin\Payments\Index as PaymentsIndex;
use App\Livewire\Admin\Receivables\Index as ReceivablesIndex;

Route::get('/health', function () {
    return response('ok', 200)->header('Content-Type', 'text/plain');
});

Route::get('/', function () {
    return Auth::check()
        ? redirect()->route('admin.dashboard')
        : redirect()->route('admin.login');
});

Route::prefix('admin')->group(function () {
    Route::middleware('guest')->group(function () {
        Route::get('/login', [AdminAuthController::class, 'showLogin'])
            ->name('admin.login');

        Route::post('/login', [AdminAuthController::class, 'login'])
            ->name('admin.login.submit');
    });

    Route::middleware(['auth', 'admin'])->group(function () {
        Route::get('/dashboard', Dashboard::class)
            ->name('admin.dashboard');

        Route::get('/users', UsersIndex::class)
            ->name('admin.users');

        Route::get('/roles', RolesIndex::class)
            ->name('admin.roles');

        Route::get('/menus', MenusIndex::class)
            ->name('admin.menus');

        Route::get('/role-permissions', RolePermissionsIndex::class)
            ->name('admin.role-permissions');

        Route::get('/employees', EmployeesIndex::class)
            ->name('admin.employees');

        Route::get('/departments', DepartmentsIndex::class)
            ->name('admin.departments');
        
        Route::get('/invoices', InvoicesIndex::class)
            ->name('admin.invoices');

        Route::get('/payments', PaymentsIndex::class)
            ->name('admin.payments');
            
        Route::get('/receivables', ReceivablesIndex::class)
            ->name('admin.receivables');

        Route::post('/logout', [AdminAuthController::class, 'logout'])
            ->name('admin.logout');
    });
});