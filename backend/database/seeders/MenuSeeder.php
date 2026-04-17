<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Menu;

class MenuSeeder extends Seeder
{
    public function run(): void
    {
        $dashboard = Menu::updateOrCreate(
            ['permission_key' => 'workspace.view'],
            [
                'name' => 'Dashboard',
                'path' => '/dashboard',
                'icon' => 'FiHome',
                'parent_id' => null,
                'order_index' => 1,
                'status' => true,
                'menu_type' => 'sidebar',
            ]
        );

        $sales = Menu::updateOrCreate(
            ['permission_key' => 'sales.module'],
            [
                'name' => 'Bán hàng',
                'path' => null,
                'icon' => 'FiShoppingCart',
                'parent_id' => null,
                'order_index' => 2,
                'status' => true,
                'menu_type' => 'sidebar',
            ]
        );

        $warehouse = Menu::updateOrCreate(
            ['permission_key' => 'warehouse.module'],
            [
                'name' => 'Kho',
                'path' => null,
                'icon' => 'FiArchive',
                'parent_id' => null,
                'order_index' => 3,
                'status' => true,
                'menu_type' => 'sidebar',
            ]
        );

        $accounting = Menu::updateOrCreate(
            ['permission_key' => 'accounting.module'],
            [
                'name' => 'Kế toán',
                'path' => null,
                'icon' => 'FiDollarSign',
                'parent_id' => null,
                'order_index' => 4,
                'status' => true,
                'menu_type' => 'sidebar',
            ]
        );

        $hr = Menu::updateOrCreate(
            ['permission_key' => 'hr.module'],
            [
                'name' => 'Nhân sự',
                'path' => null,
                'icon' => 'FiUsers',
                'parent_id' => null,
                'order_index' => 5,
                'status' => true,
                'menu_type' => 'sidebar',
            ]
        );

        $system = Menu::updateOrCreate(
            ['permission_key' => 'system.module'],
            [
                'name' => 'Hệ thống',
                'path' => null,
                'icon' => 'FiSettings',
                'parent_id' => null,
                'order_index' => 6,
                'status' => true,
                'menu_type' => 'sidebar',
            ]
        );

        $menus = [
            /*
            |--------------------------------------------------------------------------
            | SALES PAGES
            |--------------------------------------------------------------------------
            */
            [
                'name' => 'Khách hàng',
                'path' => '/customers',
                'icon' => 'FiUserCheck',
                'parent_id' => $sales->id,
                'order_index' => 1,
                'status' => true,
                'permission_key' => 'sales.customers.view',
                'menu_type' => 'sidebar',
            ],
            [
                'name' => 'Đơn bán hàng',
                'path' => '/sales-orders',
                'icon' => 'FiFileText',
                'parent_id' => $sales->id,
                'order_index' => 2,
                'status' => true,
                'permission_key' => 'sales.orders.view',
                'menu_type' => 'sidebar',
            ],
            [
                'name' => 'Sản phẩm',
                'path' => '/sales-products',
                'icon' => 'FiPackage',
                'parent_id' => $sales->id,
                'order_index' => 3,
                'status' => true,
                'permission_key' => 'sales.products.view',
                'menu_type' => 'sidebar',
            ],
            [
                'name' => 'Báo cáo',
                'path' => '/sales-reports',
                'icon' => 'FiBarChart2',
                'parent_id' => $sales->id,
                'order_index' => 4,
                'status' => true,
                'permission_key' => 'sales.reports.view',
                'menu_type' => 'sidebar',
            ],

            /*
            |--------------------------------------------------------------------------
            | WAREHOUSE PAGES
            |--------------------------------------------------------------------------
            */
            [
                'name' => 'Phiếu nhập',
                'path' => '/goods-receipts',
                'icon' => 'FiDownload',
                'parent_id' => $warehouse->id,
                'order_index' => 1,
                'status' => true,
                'permission_key' => 'warehouse.receipts.view',
                'menu_type' => 'sidebar',
            ],
            [
                'name' => 'Giao hàng',
                'path' => '/deliveries',
                'icon' => 'FiTruck',
                'parent_id' => $warehouse->id,
                'order_index' => 2,
                'status' => true,
                'permission_key' => 'warehouse.deliveries.view',
                'menu_type' => 'sidebar',
            ],
            [
                'name' => 'Tồn kho',
                'path' => '/inventory',
                'icon' => 'FiLayers',
                'parent_id' => $warehouse->id,
                'order_index' => 3,
                'status' => true,
                'permission_key' => 'warehouse.inventory.view',
                'menu_type' => 'sidebar',
            ],
            [
                'name' => 'Điều chỉnh kho',
                'path' => '/stock-adjustments',
                'icon' => 'FiRefreshCcw',
                'parent_id' => $warehouse->id,
                'order_index' => 4,
                'status' => true,
                'permission_key' => 'warehouse.adjustments.view',
                'menu_type' => 'sidebar',
            ],

            /*
            |--------------------------------------------------------------------------
            | ACCOUNTING PAGES
            |--------------------------------------------------------------------------
            */
            [
                'name' => 'Hóa đơn',
                'path' => '/invoices',
                'icon' => 'FiFile',
                'parent_id' => $accounting->id,
                'order_index' => 1,
                'status' => true,
                'permission_key' => 'accounting.invoices.view',
                'menu_type' => 'sidebar',
            ],
            [
                'name' => 'Thanh toán',
                'path' => '/payments',
                'icon' => 'FiCreditCard',
                'parent_id' => $accounting->id,
                'order_index' => 2,
                'status' => true,
                'permission_key' => 'accounting.payments.view',
                'menu_type' => 'sidebar',
            ],
            [
                'name' => 'Công nợ',
                'path' => '/receivables',
                'icon' => 'FiBookOpen',
                'parent_id' => $accounting->id,
                'order_index' => 3,
                'status' => true,
                'permission_key' => 'accounting.receivables.view',
                'menu_type' => 'sidebar',
            ],

            /*
            |--------------------------------------------------------------------------
            | HR PAGES
            |--------------------------------------------------------------------------
            */
            [
                'name' => 'Nhân viên',
                'path' => '/employees',
                'icon' => 'FiUsers',
                'parent_id' => $hr->id,
                'order_index' => 1,
                'status' => true,
                'permission_key' => 'hr.employees.view',
                'menu_type' => 'sidebar',
            ],
            [
                'name' => 'Phòng ban HR',
                'path' => '/hr/departments',
                'icon' => 'FiGrid',
                'parent_id' => $hr->id,
                'order_index' => 2,
                'status' => true,
                'permission_key' => 'hr.departments.view',
                'menu_type' => 'sidebar',
            ],
            [
                'name' => 'Chấm công',
                'path' => '/attendance',
                'icon' => 'FiClock',
                'parent_id' => $hr->id,
                'order_index' => 3,
                'status' => true,
                'permission_key' => 'hr.attendance.view',
                'menu_type' => 'sidebar',
            ],

            /*
            |--------------------------------------------------------------------------
            | SYSTEM PAGES
            |--------------------------------------------------------------------------
            */
            [
                'name' => 'Tài khoản',
                'path' => '/users',
                'icon' => 'FiUser',
                'parent_id' => $system->id,
                'order_index' => 1,
                'status' => true,
                'permission_key' => 'system.users.view',
                'menu_type' => 'sidebar',
            ],
            [
                'name' => 'Menu',
                'path' => '/menus',
                'icon' => 'FiMenu',
                'parent_id' => $system->id,
                'order_index' => 2,
                'status' => true,
                'permission_key' => 'system.menus.view',
                'menu_type' => 'sidebar',
            ],
            [
                'name' => 'Phân quyền',
                'path' => '/role-permissions',
                'icon' => 'FiShield',
                'parent_id' => $system->id,
                'order_index' => 3,
                'status' => true,
                'permission_key' => 'system.permissions.view',
                'menu_type' => 'sidebar',
            ],

            /*
            |--------------------------------------------------------------------------
            | SALES ACTIONS
            |--------------------------------------------------------------------------
            */
            [
                'name' => 'Xem dashboard bán hàng',
                'path' => null,
                'icon' => null,
                'parent_id' => $sales->id,
                'order_index' => 100,
                'status' => true,
                'permission_key' => 'sales.dashboard.view',
                'menu_type' => 'action',
            ],
            [
                'name' => 'Tạo khách hàng',
                'path' => null,
                'icon' => null,
                'parent_id' => $sales->id,
                'order_index' => 101,
                'status' => true,
                'permission_key' => 'sales.customers.create',
                'menu_type' => 'action',
            ],
            [
                'name' => 'Cập nhật khách hàng',
                'path' => null,
                'icon' => null,
                'parent_id' => $sales->id,
                'order_index' => 102,
                'status' => true,
                'permission_key' => 'sales.customers.update',
                'menu_type' => 'action',
            ],
            [
                'name' => 'Tạo đơn hàng',
                'path' => null,
                'icon' => null,
                'parent_id' => $sales->id,
                'order_index' => 103,
                'status' => true,
                'permission_key' => 'sales.orders.create',
                'menu_type' => 'action',
            ],
            [
                'name' => 'Cập nhật đơn hàng',
                'path' => null,
                'icon' => null,
                'parent_id' => $sales->id,
                'order_index' => 104,
                'status' => true,
                'permission_key' => 'sales.orders.update',
                'menu_type' => 'action',
            ],
            [
                'name' => 'Gửi kho',
                'path' => null,
                'icon' => null,
                'parent_id' => $sales->id,
                'order_index' => 105,
                'status' => true,
                'permission_key' => 'sales.orders.submit_to_warehouse',
                'menu_type' => 'action',
            ],

            /*
            |--------------------------------------------------------------------------
            | WAREHOUSE ACTIONS
            |--------------------------------------------------------------------------
            */
            [
                'name' => 'Tạo phiếu nhập',
                'path' => null,
                'icon' => null,
                'parent_id' => $warehouse->id,
                'order_index' => 201,
                'status' => true,
                'permission_key' => 'warehouse.receipts.create',
                'menu_type' => 'action',
            ],
            [
                'name' => 'Tạo giao hàng',
                'path' => null,
                'icon' => null,
                'parent_id' => $warehouse->id,
                'order_index' => 202,
                'status' => true,
                'permission_key' => 'warehouse.deliveries.create',
                'menu_type' => 'action',
            ],
            [
                'name' => 'Xác nhận giao hàng',
                'path' => null,
                'icon' => null,
                'parent_id' => $warehouse->id,
                'order_index' => 203,
                'status' => true,
                'permission_key' => 'warehouse.deliveries.confirm',
                'menu_type' => 'action',
            ],
            [
                'name' => 'Điều chỉnh tồn kho',
                'path' => null,
                'icon' => null,
                'parent_id' => $warehouse->id,
                'order_index' => 204,
                'status' => true,
                'permission_key' => 'warehouse.inventory.adjust',
                'menu_type' => 'action',
            ],

            /*
            |--------------------------------------------------------------------------
            | ACCOUNTING ACTIONS
            |--------------------------------------------------------------------------
            */
            [
                'name' => 'Tạo hóa đơn',
                'path' => null,
                'icon' => null,
                'parent_id' => $accounting->id,
                'order_index' => 301,
                'status' => true,
                'permission_key' => 'accounting.invoices.create',
                'menu_type' => 'action',
            ],
            [
                'name' => 'Tạo thanh toán',
                'path' => null,
                'icon' => null,
                'parent_id' => $accounting->id,
                'order_index' => 302,
                'status' => true,
                'permission_key' => 'accounting.payments.create',
                'menu_type' => 'action',
            ],

            /*
            |--------------------------------------------------------------------------
            | HR ACTIONS
            |--------------------------------------------------------------------------
            */
            [
                'name' => 'Tạo nhân viên',
                'path' => null,
                'icon' => null,
                'parent_id' => $hr->id,
                'order_index' => 401,
                'status' => true,
                'permission_key' => 'hr.employees.create',
                'menu_type' => 'action',
            ],
            [
                'name' => 'Cập nhật nhân viên',
                'path' => null,
                'icon' => null,
                'parent_id' => $hr->id,
                'order_index' => 402,
                'status' => true,
                'permission_key' => 'hr.employees.update',
                'menu_type' => 'action',
            ],
        ];

        foreach ($menus as $menu) {
            Menu::updateOrCreate(
                ['permission_key' => $menu['permission_key']],
                $menu
            );
        }
    }
}