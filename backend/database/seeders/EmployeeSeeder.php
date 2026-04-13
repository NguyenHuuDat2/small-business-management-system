<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Employee;
use Illuminate\Support\Facades\DB;

class EmployeeSeeder extends Seeder
{
    public function run(): void
    {
        $departments = DB::table('departments')->pluck('id', 'department_code');

        $employees = [
            [
                'employee_code' => 'EMP-HR-001',
                'name' => 'Nguyễn Thị Nhân Sự',
                'department_code' => 'HR',
                'salary' => 15000000,
                'phone' => '0901000001',
                'status' => true,
            ],
            [
                'employee_code' => 'EMP-SALES-001',
                'name' => 'Nguyễn Văn Sales',
                'department_code' => 'SALES',
                'salary' => 12000000,
                'phone' => '0901000002',
                'status' => true,
            ],
            [
                'employee_code' => 'EMP-WH-001',
                'name' => 'Trần Văn Kho',
                'department_code' => 'WH',
                'salary' => 11000000,
                'phone' => '0901000003',
                'status' => true,
            ],
            [
                'employee_code' => 'EMP-ACC-001',
                'name' => 'Lê Thị Kế Toán',
                'department_code' => 'ACC',
                'salary' => 14000000,
                'phone' => '0901000004',
                'status' => true,
            ],
            [
                'employee_code' => 'EMP-HR-002',
                'name' => 'Phạm Thị Tuyển Dụng',
                'department_code' => 'HR',
                'salary' => 13000000,
                'phone' => '0901000005',
                'status' => true,
            ],
        ];

        foreach ($employees as $employee) {
            Employee::updateOrCreate(
                ['employee_code' => $employee['employee_code']],
                [
                    'name' => $employee['name'],
                    'department_id' => $departments[$employee['department_code']] ?? null,
                    'salary' => $employee['salary'],
                    'phone' => $employee['phone'],
                    'status' => $employee['status'],
                ]
            );
        }
    }
}