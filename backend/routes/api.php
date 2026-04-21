<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\RoleController;

use App\Http\Controllers\Api\Hr\EmployeeController as HrEmployeeController;
use App\Http\Controllers\Api\Hr\DashboardController as HrDashboardController;

use App\Http\Controllers\Api\Sales\SalesReferenceController;
use App\Http\Controllers\Api\Sales\SalesOrderController;
use App\Http\Controllers\Api\Sales\CustomerController;
use App\Http\Controllers\Api\Sales\SalesDashboardController;
use App\Http\Controllers\Api\Sales\SalesProductController;
use App\Http\Controllers\Api\Sales\SalesReportController;

use App\Http\Controllers\Api\Accounting\InvoiceController;

/*
|--------------------------------------------------------------------------
| AUTH
|--------------------------------------------------------------------------
*/
Route::prefix('auth')->group(function () {
    Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:5,1');
    Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/me', [AuthController::class, 'me']);
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::post('/change-password', [AuthController::class, 'changePassword']);
    });
});

/*
|--------------------------------------------------------------------------
| USERS / ROLE
|--------------------------------------------------------------------------
*/
Route::middleware(['auth:sanctum', 'admin'])->apiResource('users', UserController::class);
Route::middleware(['auth:sanctum', 'admin'])->get('/roles', [RoleController::class, 'index']);

/*
|--------------------------------------------------------------------------
| SALES
|--------------------------------------------------------------------------
*/
Route::middleware(['auth:sanctum'])->prefix('sales')->group(function () {

    Route::get('/dashboard/stats', [SalesDashboardController::class, 'stats']);

    Route::get('/reference/customers', [SalesReferenceController::class, 'customers']);
    Route::get('/reference/products', [SalesReferenceController::class, 'products']);

    Route::get('/customers', [CustomerController::class, 'index']);
    Route::post('/customers', [CustomerController::class, 'store']);
    Route::put('/customers/{id}', [CustomerController::class, 'update']);

    Route::get('/orders', [SalesOrderController::class, 'index']);
    Route::get('/orders/{id}', [SalesOrderController::class, 'show']);
    Route::post('/orders', [SalesOrderController::class, 'store']);
    Route::put('/orders/{id}', [SalesOrderController::class, 'update']);

    Route::post('/orders/{id}/submit', [SalesOrderController::class, 'submit']);
    Route::post('/orders/{id}/approve', [SalesOrderController::class, 'approve']);
    Route::post('/orders/{id}/reject', [SalesOrderController::class, 'reject']);
    Route::post('/orders/{id}/cancel', [SalesOrderController::class, 'cancel']);

    Route::get('/products', [SalesProductController::class, 'index']);
    Route::get('/reports/overview', [SalesReportController::class, 'overview']);
});

/*
|--------------------------------------------------------------------------
| HR
|--------------------------------------------------------------------------
*/
Route::prefix('hr')->middleware('auth:sanctum')->group(function () {

    Route::get('/dashboard', [HrDashboardController::class, 'index']);

    Route::get('/employees', [HrEmployeeController::class, 'index']);
    Route::post('/employees', [HrEmployeeController::class, 'store']);
    Route::get('/employees/{employee}', [HrEmployeeController::class, 'show']);
    Route::put('/employees/{employee}', [HrEmployeeController::class, 'update']);
    Route::delete('/employees/{employee}', [HrEmployeeController::class, 'destroy']);

    Route::get('/department-options', [HrEmployeeController::class, 'departmentOptions']);
});

/*
|--------------------------------------------------------------------------
| ACCOUNTING
|--------------------------------------------------------------------------
*/
Route::middleware(['auth:sanctum'])->prefix('accounting')->group(function () {

    Route::get('/invoices', [InvoiceController::class, 'index']);
    Route::post('/invoices', [InvoiceController::class, 'store']);
    Route::get('/invoices/{id}', [InvoiceController::class, 'show']);
    Route::patch('/invoices/{id}/status', [InvoiceController::class, 'updateStatus']);
    Route::delete('/invoices/{id}', [InvoiceController::class, 'destroy']);

    Route::get('/receivables', [InvoiceController::class, 'receivables']);
    Route::get('/payments', [InvoiceController::class, 'payments']);
});