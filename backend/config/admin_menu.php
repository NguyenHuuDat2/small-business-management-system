<?php

return [
    [
        'label' => 'Dashboard',
        'route' => 'admin.dashboard',
        'icon'  => 'home',
    ],

    [
        'label' => 'Hệ thống',
        'icon'  => 'settings',
        'children' => [
            [
                'label' => 'Tài khoản',
                'route' => 'admin.users',
            ],
            [
                'label' => 'Vai trò',
                'route' => 'admin.roles',
            ],
            [
                'label' => 'Menu',
                'route' => 'admin.menus',
            ],
            [
                'label' => 'Phân quyền',
                'route' => 'admin.role-permissions',
            ],
        ],
    ],

    [
        'label' => 'Nhân sự',
        'icon'  => 'users',
        'children' => [
            [
                'label' => 'Nhân viên',
                'route' => 'admin.employees',
            ],
            [
                'label' => 'Phòng ban',
                'route' => 'admin.departments',
            ],
        ],
    ],

    [
        'label' => 'Bán hàng',
        'icon'  => 'shopping-cart',
        'children' => [
            [
                'label' => 'Khách hàng',
                'route' => 'admin.customers',
            ],
            [
                'label' => 'Đơn bán hàng',
                'route' => 'admin.sales-orders',
            ],
        ],
    ],

    [
        'label' => 'Kho',
        'icon'  => 'cube',
        'children' => [
            [
                'label' => 'Phiếu nhập',
                'route' => 'admin.goods-receipts',
            ],
            [
                'label' => 'Giao hàng',
                'route' => 'admin.deliveries',
            ],
            [
                'label' => 'Tồn kho',
                'route' => 'admin.inventory',
            ],
        ],
    ],

    [
        'label' => 'Kế toán',
        'icon'  => 'credit-card',
        'children' => [
            [
                'label' => 'Hóa đơn',
                'route' => 'admin.invoices',
            ],
            [
                'label' => 'Thanh toán',
                'route' => 'admin.payments',
            ],
            [
                'label' => 'Công nợ',
                'route' => 'admin.receivables',
            ],
        ],
    ],

    [
        'label' => 'Tài sản',
        'icon'  => 'archive-box',
        'children' => [
            [
                'label' => 'Tồn tài sản',
                'route' => 'admin.asset-inventory',
            ],
            [
                'label' => 'Tài sản khách giữ',
                'route' => 'admin.customer-assets',
            ],
            [
                'label' => 'Giao dịch tài sản',
                'route' => 'admin.asset-transactions',
            ],
        ],
    ],
];