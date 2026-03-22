<?php

return [
    [
        'label' => 'Dashboard',
        'route' => 'admin.dashboard',
        'icon'  => 'home',
    ],
    [
        'label' => 'Tài khoản',
        'route' => 'admin.users',
        'icon'  => 'users',
    ],
    [
        'label' => 'Nhân sự',
        'icon'  => 'briefcase',
        'children' => [
            [
                'label' => 'Danh sách nhân viên',
                'route' => 'admin.employees.index',
            ],
            [
                'label' => 'Phòng ban',
                'route' => 'admin.departments.index',
            ],
        ],
    ],
    [
        'label' => 'Bán hàng',
        'icon'  => 'shopping-cart',
        'children' => [
            [
                'label' => 'Đơn hàng',
                'route' => 'admin.orders.index',
            ],
            [
                'label' => 'Khách hàng',
                'route' => 'admin.customers.index',
            ],
        ],
    ],
    [
        'label' => 'Kho',
        'icon'  => 'package',
        'children' => [
            [
                'label' => 'Sản phẩm',
                'route' => 'admin.products.index',
            ],
            [
                'label' => 'Nhập kho',
                'route' => 'admin.stock-ins.index',
            ],
        ],
    ],
];