<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        $roles = [
            [
                'role_code' => 'ADMIN',
                'name' => 'Admin',
                'description' => 'Quản trị hệ thống'
            ],
            [
                'role_code' => 'HR',
                'name' => 'Nhân sự',
                'description' => 'Quản lý nghiệp vụ nhân sự'
            ],
            [
                'role_code' => 'SALES',
                'name' => 'Nhân viên bán hàng',
                'description' => 'Quản lý đơn hàng'
            ],
            [
                'role_code' => 'WAREHOUSE',
                'name' => 'Nhân viên kho',
                'description' => 'Quản lý kho'
            ],
            [
                'role_code' => 'ACCOUNTANT',
                'name' => 'Kế toán',
                'description' => 'Quản lý tài chính'
            ],
        ];

        foreach ($roles as $role) {
            DB::table('roles')->updateOrInsert(
                ['role_code' => $role['role_code']],
                $role
            );
        }
    }
}