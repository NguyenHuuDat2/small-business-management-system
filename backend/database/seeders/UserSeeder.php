<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $roles = DB::table('roles')->pluck('id', 'role_code');
        $employees = DB::table('employees')->pluck('id', 'employee_code');

        $users = [
            ['name' => 'Nguyễn Hữu Đạt',       'email' => 'huudat2694tp@gmail.com',      'phone' => '0902000001', 'role_code' => 'ADMIN',      'employee_code' => 'EMP-BOD-001'],
            ['name' => 'Lý Thu Thảo',          'email' => 'thuthao@gmail.com',      'phone' => '0902000002', 'role_code' => 'ADMIN',      'employee_code' => 'EMP-BOD-002'],

            ['name' => 'Võ Gia Hưng',          'email' => 'giahung@gmail.com','phone' => '0902000003', 'role_code' => 'ADMIN',      'employee_code' => 'EMP-ADM-001'],
            ['name' => 'Phạm Văn Sơn',         'email' => 'vanson@gmail.com',   'phone' => '0902000004', 'role_code' => 'ADMIN',      'employee_code' => 'EMP-ADM-002'],

            ['name' => 'Nguyễn Thị Nhân Sự',   'email' => 'hr1@gmail.com',         'phone' => '0902000005', 'role_code' => 'HR',         'employee_code' => 'EMP-HR-001'],
            ['name' => 'Phạm Thị Tuyển Dụng',  'email' => 'hr2@gmail.com',         'phone' => '0902000006', 'role_code' => 'HR',         'employee_code' => 'EMP-HR-002'],
            ['name' => 'Lê Thị Hồ Sơ',         'email' => 'hr3@gmail.com',         'phone' => '0902000007', 'role_code' => 'HR',         'employee_code' => 'EMP-HR-003'],

            ['name' => 'Nguyễn Văn Sales',     'email' => 'sales1@gmail.com',      'phone' => '0902000008', 'role_code' => 'SALES',      'employee_code' => 'EMP-SALES-001'],
            ['name' => 'Trần Văn Kinh Doanh',  'email' => 'sales2@gmail.com',      'phone' => '0902000009', 'role_code' => 'SALES',      'employee_code' => 'EMP-SALES-002'],
            ['name' => 'Đỗ Minh Châu',         'email' => 'sales3@gmail.com',      'phone' => '0902000010', 'role_code' => 'SALES',      'employee_code' => 'EMP-SALES-003'],
            ['name' => 'Bùi Gia Bảo',          'email' => 'sales4@gmail.com',      'phone' => '0902000011', 'role_code' => 'SALES',      'employee_code' => 'EMP-SALES-004'],

            ['name' => 'Hoàng Thị Hỗ Trợ',     'email' => 'cs1@gmail.com',         'phone' => '0902000012', 'role_code' => 'SALES',      'employee_code' => 'EMP-CS-001'],
            ['name' => 'Mai Khánh Linh',       'email' => 'cs2@gmail.com',         'phone' => '0902000013', 'role_code' => 'SALES',      'employee_code' => 'EMP-CS-002'],

            ['name' => 'Trần Văn Kho',         'email' => 'wh1@gmail.com',         'phone' => '0902000014', 'role_code' => 'WAREHOUSE',  'employee_code' => 'EMP-WH-001'],
            ['name' => 'Lê Văn Xuất Nhập',     'email' => 'wh2@gmail.com',         'phone' => '0902000015', 'role_code' => 'WAREHOUSE',  'employee_code' => 'EMP-WH-002'],
            ['name' => 'Ngô Minh Tuấn',        'email' => 'wh3@gmail.com',         'phone' => '0902000016', 'role_code' => 'WAREHOUSE',  'employee_code' => 'EMP-WH-003'],
            ['name' => 'Dương Quốc Anh',       'email' => 'wh4@gmail.com',         'phone' => '0902000017', 'role_code' => 'WAREHOUSE',  'employee_code' => 'EMP-WH-004'],

            ['name' => 'Phan Thu Mua',         'email' => 'pur1@gmail.com',        'phone' => '0902000018', 'role_code' => 'WAREHOUSE',  'employee_code' => 'EMP-PUR-001'],
            ['name' => 'Tạ Hoàng Nam',         'email' => 'pur2@gmail.com',        'phone' => '0902000019', 'role_code' => 'WAREHOUSE',  'employee_code' => 'EMP-PUR-002'],

            ['name' => 'Lê Thị Kế Toán',       'email' => 'acc1@gmail.com',        'phone' => '0902000020', 'role_code' => 'ACCOUNTANT', 'employee_code' => 'EMP-ACC-001'],
            ['name' => 'Nguyễn Minh Hằng',     'email' => 'acc2@gmail.com',        'phone' => '0902000021', 'role_code' => 'ACCOUNTANT', 'employee_code' => 'EMP-ACC-002'],
            ['name' => 'Trịnh Quốc Bảo',       'email' => 'acc3@gmail.com',        'phone' => '0902000022', 'role_code' => 'ACCOUNTANT', 'employee_code' => 'EMP-ACC-003'],
        ];

        foreach ($users as $u) {
            User::updateOrCreate(
                ['email' => $u['email']],
                [
                    'name' => $u['name'],
                    'phone' => $u['phone'],
                    'password' => Hash::make('12345678'),
                    'role_id' => $roles[$u['role_code']] ?? null,
                    'employee_id' => $employees[$u['employee_code']] ?? null,
                    'status' => true,
                    'must_change_password' => false,
                ]
            );
        }
    }
}