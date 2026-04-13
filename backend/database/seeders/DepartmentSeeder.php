<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Department;

class DepartmentSeeder extends Seeder
{
    public function run(): void
    {
        $departments = [
            [
                'department_code' => 'HR',
                'name' => 'Nhân sự',
                'description' => 'Quản lý hồ sơ và nghiệp vụ nhân sự',
            ],
            [
                'department_code' => 'SALES',
                'name' => 'Bán hàng',
                'description' => 'Quản lý đơn hàng và khách hàng',
            ],
            [
                'department_code' => 'WH',
                'name' => 'Kho',
                'description' => 'Quản lý tồn kho và xuất nhập kho',
            ],
            [
                'department_code' => 'ACC',
                'name' => 'Kế toán',
                'description' => 'Quản lý hóa đơn, thanh toán, công nợ',
            ],
            [
                'department_code' => 'ADM',
                'name' => 'Hành chính',
                'description' => 'Quản trị và điều phối nội bộ',
            ],
        ];

        foreach ($departments as $department) {
            Department::updateOrCreate(
                ['department_code' => $department['department_code']],
                $department
            );
        }
    }
}