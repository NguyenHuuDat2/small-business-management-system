<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Role;
use App\Models\Menu;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        $admin = Role::where('role_code', 'ADMIN')->firstOrFail();
        $hr = Role::where('role_code', 'HR')->firstOrFail();
        $sales = Role::where('role_code', 'SALES')->firstOrFail();
        $warehouse = Role::where('role_code', 'WAREHOUSE')->firstOrFail();
        $accountant = Role::where('role_code', 'ACCOUNTANT')->firstOrFail();

        $admin->menus()->sync(Menu::pluck('id')->toArray());

        $hr->menus()->sync(
            Menu::whereIn('permission_key', [
                'workspace.view',
                'hr.module',
                'hr.employees.view',
                'hr.employees.create',
                'hr.employees.update',
                'hr.departments.view',
                'hr.attendance.view',
            ])->pluck('id')->toArray()
        );

        $sales->menus()->sync(
            Menu::whereIn('permission_key', [
                'workspace.view',
                'sales.module',
                'sales.customers.view',
                'sales.customers.create',
                'sales.customers.update',
                'sales.orders.view',
                'sales.orders.create',
                'sales.orders.update',
                'sales.orders.submit_to_warehouse',
            ])->pluck('id')->toArray()
        );

        $warehouse->menus()->sync(
            Menu::whereIn('permission_key', [
                'workspace.view',
                'warehouse.module',
                'warehouse.receipts.view',
                'warehouse.receipts.create',
                'warehouse.deliveries.view',
                'warehouse.deliveries.create',
                'warehouse.deliveries.confirm',
                'warehouse.inventory.view',
                'warehouse.inventory.adjust',
                'warehouse.adjustments.view',
            ])->pluck('id')->toArray()
        );

        $accountant->menus()->sync(
            Menu::whereIn('permission_key', [
                'workspace.view',
                'accounting.module',
                'accounting.invoices.view',
                'accounting.invoices.create',
                'accounting.payments.view',
                'accounting.payments.create',
                'accounting.receivables.view',
            ])->pluck('id')->toArray()
        );
    }
}