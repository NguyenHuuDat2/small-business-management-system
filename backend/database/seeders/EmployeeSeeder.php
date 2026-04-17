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
            ['employee_code' => 'EMP-BOD-001', 'name' => 'Nguyễn Hữu Đạt',         'department_code' => 'BOD',   'salary' => 35000000, 'phone' => '0901000001', 'status' => true],
            ['employee_code' => 'EMP-BOD-002', 'name' => 'Lý Thu Thảo',            'department_code' => 'BOD',   'salary' => 28000000, 'phone' => '0901000002', 'status' => true],

            ['employee_code' => 'EMP-ADM-001', 'name' => 'Võ Gia Hưng',            'department_code' => 'ADM',   'salary' => 15000000, 'phone' => '0901000003', 'status' => true],
            ['employee_code' => 'EMP-ADM-002', 'name' => 'Phạm Văn Sơn',           'department_code' => 'ADM',   'salary' => 14000000, 'phone' => '0901000004', 'status' => true],

            ['employee_code' => 'EMP-HR-001',  'name' => 'Nguyễn Thị Nhân Sự',     'department_code' => 'HR',    'salary' => 15000000, 'phone' => '0901000005', 'status' => true],
            ['employee_code' => 'EMP-HR-002',  'name' => 'Phạm Thị Tuyển Dụng',    'department_code' => 'HR',    'salary' => 14000000, 'phone' => '0901000006', 'status' => true],
            ['employee_code' => 'EMP-HR-003',  'name' => 'Lê Thị Hồ Sơ',           'department_code' => 'HR',    'salary' => 13500000, 'phone' => '0901000007', 'status' => true],

            ['employee_code' => 'EMP-SALES-001','name' => 'Nguyễn Văn Sales',      'department_code' => 'SALES', 'salary' => 13000000, 'phone' => '0901000008', 'status' => true],
            ['employee_code' => 'EMP-SALES-002','name' => 'Trần Văn Kinh Doanh',   'department_code' => 'SALES', 'salary' => 12500000, 'phone' => '0901000009', 'status' => true],
            ['employee_code' => 'EMP-SALES-003','name' => 'Đỗ Minh Châu',          'department_code' => 'SALES', 'salary' => 12800000, 'phone' => '0901000010', 'status' => true],
            ['employee_code' => 'EMP-SALES-004','name' => 'Bùi Gia Bảo',           'department_code' => 'SALES', 'salary' => 13200000, 'phone' => '0901000011', 'status' => true],

            ['employee_code' => 'EMP-CS-001',  'name' => 'Hoàng Thị Hỗ Trợ',       'department_code' => 'CS',    'salary' => 11000000, 'phone' => '0901000012', 'status' => true],
            ['employee_code' => 'EMP-CS-002',  'name' => 'Mai Khánh Linh',         'department_code' => 'CS',    'salary' => 11200000, 'phone' => '0901000013', 'status' => true],

            ['employee_code' => 'EMP-WH-001',  'name' => 'Trần Văn Kho',           'department_code' => 'WH',    'salary' => 11500000, 'phone' => '0901000014', 'status' => true],
            ['employee_code' => 'EMP-WH-002',  'name' => 'Lê Văn Xuất Nhập',       'department_code' => 'WH',    'salary' => 11800000, 'phone' => '0901000015', 'status' => true],
            ['employee_code' => 'EMP-WH-003',  'name' => 'Ngô Minh Tuấn',          'department_code' => 'WH',    'salary' => 11600000, 'phone' => '0901000016', 'status' => true],
            ['employee_code' => 'EMP-WH-004',  'name' => 'Dương Quốc Anh',         'department_code' => 'WH',    'salary' => 11900000, 'phone' => '0901000017', 'status' => true],

            ['employee_code' => 'EMP-PUR-001', 'name' => 'Phan Thu Mua',           'department_code' => 'PUR',   'salary' => 12500000, 'phone' => '0901000018', 'status' => true],
            ['employee_code' => 'EMP-PUR-002', 'name' => 'Tạ Hoàng Nam',           'department_code' => 'PUR',   'salary' => 12300000, 'phone' => '0901000019', 'status' => true],

            ['employee_code' => 'EMP-ACC-001', 'name' => 'Lê Thị Kế Toán',         'department_code' => 'ACC',   'salary' => 14500000, 'phone' => '0901000020', 'status' => true],
            ['employee_code' => 'EMP-ACC-002', 'name' => 'Nguyễn Minh Hằng',       'department_code' => 'ACC',   'salary' => 14200000, 'phone' => '0901000021', 'status' => true],
            ['employee_code' => 'EMP-ACC-003', 'name' => 'Trịnh Quốc Bảo',         'department_code' => 'ACC',   'salary' => 13800000, 'phone' => '0901000022', 'status' => true],
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