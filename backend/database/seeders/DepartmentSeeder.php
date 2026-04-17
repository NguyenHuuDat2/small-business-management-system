<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Department;

class DepartmentSeeder extends Seeder
{
    public function run(): void
    {
        $departments = [
            ['department_code' => 'BOD',   'name' => 'Ban giám đốc',      'description' => 'Điều hành và ra quyết định chiến lược'],
            ['department_code' => 'ADM',   'name' => 'Hành chính',        'description' => 'Vận hành hành chính nội bộ'],
            ['department_code' => 'HR',    'name' => 'Nhân sự',           'description' => 'Quản lý hồ sơ và nghiệp vụ nhân sự'],
            ['department_code' => 'SALES', 'name' => 'Bán hàng',          'description' => 'Quản lý khách hàng và đơn hàng'],
            ['department_code' => 'CS',    'name' => 'Chăm sóc khách hàng','description' => 'Hỗ trợ sau bán hàng và chăm sóc khách hàng'],
            ['department_code' => 'WH',    'name' => 'Kho',               'description' => 'Quản lý tồn kho và xuất nhập kho'],
            ['department_code' => 'PUR',   'name' => 'Thu mua',           'description' => 'Làm việc với nhà cung cấp và nhập hàng'],
            ['department_code' => 'ACC',   'name' => 'Kế toán',           'description' => 'Quản lý hóa đơn, thanh toán, công nợ'],
        ];

        foreach ($departments as $department) {
            Department::updateOrCreate(
                ['department_code' => $department['department_code']],
                $department
            );
        }
    }
}