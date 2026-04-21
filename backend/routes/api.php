<?php

use App\Http\Controllers\Api\Accounting\InvoiceController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\RoleController;
use App\Http\Controllers\Api\Hr\EmployeeController as HrEmployeeController;
use App\Http\Controllers\Api\Hr\DashboardController as HrDashboardController;

// auth
Route::prefix('auth')->group(function () {
    Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:5,1');
    Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/me', [AuthController::class, 'me']);
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::post('/change-password', [AuthController::class, 'changePassword']);
    });
});

Route::middleware(['auth:sanctum', 'admin'])->apiResource('users', UserController::class);

// role
Route::middleware(['auth:sanctum', 'admin'])->get('/roles', [RoleController::class, 'index']);

// hr
Route::prefix('hr')->middleware('auth:sanctum')->group(function () {
    Route::get('/dashboard', [HrDashboardController::class, 'index']);

    Route::get('/employees', [HrEmployeeController::class, 'index']);
    Route::post('/employees', [HrEmployeeController::class, 'store']);
    Route::get('/employees/{employee}', [HrEmployeeController::class, 'show']);
    Route::put('/employees/{employee}', [HrEmployeeController::class, 'update']);
    Route::delete('/employees/{employee}', [HrEmployeeController::class, 'destroy']);

    Route::get('/department-options', [HrEmployeeController::class, 'departmentOptions']);
});

// accounting
Route::prefix('accounting')->group(function () {
    Route::get('/invoices', [InvoiceController::class, 'index']);
    Route::post('/invoices', [InvoiceController::class, 'store']);
    Route::get('/invoices/{id}', [InvoiceController::class, 'show']);
    Route::patch('/invoices/{id}/status', [InvoiceController::class, 'updateStatus']);

    Route::get('/receivables', [InvoiceController::class, 'receivables']);
    Route::get('/payments', [InvoiceController::class, 'payments']);
});
