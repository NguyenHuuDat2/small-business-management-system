<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Menu;

class MenuSeeder extends Seeder
{
    public function run(): void
    {
        // Workspace chung
        Menu::updateOrCreate(
            ['permission_key' => 'workspace.view'],
            [
                'name' => 'Khu vực làm việc',
                'path' => '/workspace',
                'page_code' => 'workspace.index',
                'icon' => 'FiGrid',
                'parent_id' => null,
                'order_index' => 1,
                'status' => true,
                'menu_type' => 'sidebar',
            ]
        );

        // =========================
        // HR
        // =========================
        $hrModule = Menu::updateOrCreate(
            ['permission_key' => 'hr.module'],
            [
                'name' => 'Nhân sự',
                'path' => null,
                'page_code' => null,
                'icon' => 'FiUsers',
                'parent_id' => null,
                'order_index' => 10,
                'status' => true,
                'menu_type' => 'sidebar',
            ]
        );

        $hrDashboard = Menu::updateOrCreate(
            ['permission_key' => 'hr.dashboard.view'],
            [
                'name' => 'Tổng quan nhân sự',
                'path' => '/hr/dashboard',
                'page_code' => 'hr.dashboard.index',
                'icon' => 'FiHome',
                'parent_id' => $hrModule->id,
                'order_index' => 11,
                'status' => true,
                'menu_type' => 'sidebar',
            ]
        );

        $employees = Menu::updateOrCreate(
            ['permission_key' => 'hr.employees.view'],
            [
                'name' => 'Nhân viên',
                'path' => '/hr/employees',
                'page_code' => 'hr.employees.index',
                'icon' => 'FiUser',
                'parent_id' => $hrModule->id,
                'order_index' => 12,
                'status' => true,
                'menu_type' => 'sidebar',
            ]
        );

        Menu::updateOrCreate(
            ['permission_key' => 'hr.employees.create'],
            [
                'name' => 'Tạo nhân viên',
                'path' => null,
                'page_code' => null,
                'icon' => null,
                'parent_id' => $employees->id,
                'order_index' => 13,
                'status' => true,
                'menu_type' => 'action',
            ]
        );

        Menu::updateOrCreate(
            ['permission_key' => 'hr.employees.update'],
            [
                'name' => 'Sửa nhân viên',
                'path' => null,
                'page_code' => null,
                'icon' => null,
                'parent_id' => $employees->id,
                'order_index' => 14,
                'status' => true,
                'menu_type' => 'action',
            ]
        );



        // =========================
        // SALES
        // =========================
        $salesModule = Menu::updateOrCreate(
            ['permission_key' => 'sales.module'],
            [
                'name' => 'Bán hàng',
                'path' => null,
                'page_code' => null,
                'icon' => 'FiShoppingCart',
                'parent_id' => null,
                'order_index' => 20,
                'status' => true,
                'menu_type' => 'sidebar',
            ]
        );

        Menu::updateOrCreate(
            ['permission_key' => 'sales.dashboard.view'],
            [
                'name' => 'Tổng quan bán hàng',
                'path' => '/sales/dashboard',
                'page_code' => 'sales.dashboard.index',
                'icon' => 'FiHome',
                'parent_id' => $salesModule->id,
                'order_index' => 21,
                'status' => true,
                'menu_type' => 'sidebar',
            ]
        );

        $customers = Menu::updateOrCreate(
            ['permission_key' => 'sales.customers.view'],
            [
                'name' => 'Khách hàng',
                'path' => '/sales/customers',
                'page_code' => 'sales.customers.index',
                'icon' => 'FiUsers',
                'parent_id' => $salesModule->id,
                'order_index' => 22,
                'status' => true,
                'menu_type' => 'sidebar',
            ]
        );

        Menu::updateOrCreate(
            ['permission_key' => 'sales.customers.create'],
            [
                'name' => 'Tạo khách hàng',
                'path' => null,
                'page_code' => null,
                'icon' => null,
                'parent_id' => $customers->id,
                'order_index' => 23,
                'status' => true,
                'menu_type' => 'action',
            ]
        );

        Menu::updateOrCreate(
            ['permission_key' => 'sales.customers.update'],
            [
                'name' => 'Sửa khách hàng',
                'path' => null,
                'page_code' => null,
                'icon' => null,
                'parent_id' => $customers->id,
                'order_index' => 24,
                'status' => true,
                'menu_type' => 'action',
            ]
        );

        $salesOrders = Menu::updateOrCreate(
            ['permission_key' => 'sales.orders.view'],
            [
                'name' => 'Đơn bán hàng',
                'path' => '/sales/orders',
                'page_code' => 'sales.orders.index',
                'icon' => 'FiFileText',
                'parent_id' => $salesModule->id,
                'order_index' => 25,
                'status' => true,
                'menu_type' => 'sidebar',
            ]
        );

        Menu::updateOrCreate(
            ['permission_key' => 'sales.orders.create'],
            [
                'name' => 'Tạo đơn bán hàng',
                'path' => null,
                'page_code' => null,
                'icon' => null,
                'parent_id' => $salesOrders->id,
                'order_index' => 26,
                'status' => true,
                'menu_type' => 'action',
            ]
        );

        Menu::updateOrCreate(
            ['permission_key' => 'sales.orders.update'],
            [
                'name' => 'Sửa đơn bán hàng',
                'path' => null,
                'page_code' => null,
                'icon' => null,
                'parent_id' => $salesOrders->id,
                'order_index' => 27,
                'status' => true,
                'menu_type' => 'action',
            ]
        );

        Menu::updateOrCreate(
            ['permission_key' => 'sales.orders.submit_to_warehouse'],
            [
                'name' => 'Gửi kho',
                'path' => null,
                'page_code' => null,
                'icon' => null,
                'parent_id' => $salesOrders->id,
                'order_index' => 28,
                'status' => true,
                'menu_type' => 'action',
            ]
        );

        // =========================
        // WAREHOUSE
        // =========================
        $warehouseModule = Menu::updateOrCreate(
            ['permission_key' => 'warehouse.module'],
            [
                'name' => 'Kho',
                'path' => null,
                'page_code' => null,
                'icon' => 'FiBox',
                'parent_id' => null,
                'order_index' => 30,
                'status' => true,
                'menu_type' => 'sidebar',
            ]
        );

        Menu::updateOrCreate(
            ['permission_key' => 'warehouse.dashboard.view'],
            [
                'name' => 'Tổng quan kho',
                'path' => '/warehouse/dashboard',
                'page_code' => 'warehouse.dashboard.index',
                'icon' => 'FiHome',
                'parent_id' => $warehouseModule->id,
                'order_index' => 31,
                'status' => true,
                'menu_type' => 'sidebar',
            ]
        );

        $receipts = Menu::updateOrCreate(
            ['permission_key' => 'warehouse.receipts.view'],
            [
                'name' => 'Phiếu nhập',
                'path' => '/warehouse/receipts',
                'page_code' => 'warehouse.receipts.index',
                'icon' => 'FiDownload',
                'parent_id' => $warehouseModule->id,
                'order_index' => 32,
                'status' => true,
                'menu_type' => 'sidebar',
            ]
        );

        Menu::updateOrCreate(
            ['permission_key' => 'warehouse.receipts.create'],
            [
                'name' => 'Tạo phiếu nhập',
                'path' => null,
                'page_code' => null,
                'icon' => null,
                'parent_id' => $receipts->id,
                'order_index' => 33,
                'status' => true,
                'menu_type' => 'action',
            ]
        );

        $deliveries = Menu::updateOrCreate(
            ['permission_key' => 'warehouse.deliveries.view'],
            [
                'name' => 'Phiếu giao / xuất kho',
                'path' => '/warehouse/deliveries',
                'page_code' => 'warehouse.deliveries.index',
                'icon' => 'FiTruck',
                'parent_id' => $warehouseModule->id,
                'order_index' => 34,
                'status' => true,
                'menu_type' => 'sidebar',
            ]
        );

        Menu::updateOrCreate(
            ['permission_key' => 'warehouse.deliveries.create'],
            [
                'name' => 'Tạo phiếu giao',
                'path' => null,
                'page_code' => null,
                'icon' => null,
                'parent_id' => $deliveries->id,
                'order_index' => 35,
                'status' => true,
                'menu_type' => 'action',
            ]
        );

        Menu::updateOrCreate(
            ['permission_key' => 'warehouse.deliveries.confirm'],
            [
                'name' => 'Xác nhận giao hàng',
                'path' => null,
                'page_code' => null,
                'icon' => null,
                'parent_id' => $deliveries->id,
                'order_index' => 36,
                'status' => true,
                'menu_type' => 'action',
            ]
        );

        $inventory = Menu::updateOrCreate(
            ['permission_key' => 'warehouse.inventory.view'],
            [
                'name' => 'Tồn kho',
                'path' => '/warehouse/inventory',
                'page_code' => 'warehouse.inventory.index',
                'icon' => 'FiArchive',
                'parent_id' => $warehouseModule->id,
                'order_index' => 37,
                'status' => true,
                'menu_type' => 'sidebar',
            ]
        );

        Menu::updateOrCreate(
            ['permission_key' => 'warehouse.inventory.adjust'],
            [
                'name' => 'Điều chỉnh tồn kho',
                'path' => null,
                'page_code' => null,
                'icon' => null,
                'parent_id' => $inventory->id,
                'order_index' => 38,
                'status' => true,
                'menu_type' => 'action',
            ]
        );

        // =========================
        // ACCOUNTING
        // =========================
        $accountingModule = Menu::updateOrCreate(
            ['permission_key' => 'accounting.module'],
            [
                'name' => 'Kế toán',
                'path' => null,
                'page_code' => null,
                'icon' => 'FiDollarSign',
                'parent_id' => null,
                'order_index' => 40,
                'status' => true,
                'menu_type' => 'sidebar',
            ]
        );

        Menu::updateOrCreate(
            ['permission_key' => 'accounting.dashboard.view'],
            [
                'name' => 'Tổng quan kế toán',
                'path' => '/accounting/dashboard',
                'page_code' => 'accounting.dashboard.index',
                'icon' => 'FiHome',
                'parent_id' => $accountingModule->id,
                'order_index' => 41,
                'status' => true,
                'menu_type' => 'sidebar',
            ]
        );

        $invoices = Menu::updateOrCreate(
            ['permission_key' => 'accounting.invoices.view'],
            [
                'name' => 'Hóa đơn',
                'path' => '/accounting/invoices',
                'page_code' => 'accounting.invoices.index',
                'icon' => 'FiFileText',
                'parent_id' => $accountingModule->id,
                'order_index' => 42,
                'status' => true,
                'menu_type' => 'sidebar',
            ]
        );

        Menu::updateOrCreate(
            ['permission_key' => 'accounting.invoices.create'],
            [
                'name' => 'Tạo hóa đơn',
                'path' => null,
                'page_code' => null,
                'icon' => null,
                'parent_id' => $invoices->id,
                'order_index' => 43,
                'status' => true,
                'menu_type' => 'action',
            ]
        );

        $payments = Menu::updateOrCreate(
            ['permission_key' => 'accounting.payments.view'],
            [
                'name' => 'Thanh toán',
                'path' => '/accounting/payments',
                'page_code' => 'accounting.payments.index',
                'icon' => 'FiCreditCard',
                'parent_id' => $accountingModule->id,
                'order_index' => 44,
                'status' => true,
                'menu_type' => 'sidebar',
            ]
        );

        Menu::updateOrCreate(
            ['permission_key' => 'accounting.payments.create'],
            [
                'name' => 'Ghi nhận thanh toán',
                'path' => null,
                'page_code' => null,
                'icon' => null,
                'parent_id' => $payments->id,
                'order_index' => 45,
                'status' => true,
                'menu_type' => 'action',
            ]
        );

        Menu::updateOrCreate(
            ['permission_key' => 'accounting.receivables.view'],
            [
                'name' => 'Công nợ',
                'path' => '/accounting/receivables',
                'page_code' => 'accounting.receivables.index',
                'icon' => 'FiBookOpen',
                'parent_id' => $accountingModule->id,
                'order_index' => 46,
                'status' => true,
                'menu_type' => 'sidebar',
            ]
        );
    }
}