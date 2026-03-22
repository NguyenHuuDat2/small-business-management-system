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

        $users = [
            ['name' => 'Nguyễn Hữu Đạt', 'email' => 'huudat2694tp@gmail.com', 'phone' => '0900000001', 'role_code' => 'ADMIN'],
            ['name' => 'Lý Thu Thảo', 'email' => 'thuthao@gmail.com', 'phone' => '0900000002', 'role_code' => 'ADMIN'],
            ['name' => 'Võ Nguyễn Gia Hưng', 'email' => 'giahung@gmail.com', 'phone' => '0900000003', 'role_code' => 'ADMIN'],
            ['name' => 'Phạm Văn Sơn', 'email' => 'vanson@gmail.com', 'phone' => '0900000004', 'role_code' => 'ADMIN'],

            ['name' => 'Nguyễn Văn Sales', 'email' => 'sales@gmail.com', 'phone' => '0900000011', 'role_code' => 'SALES'],
            ['name' => 'Trần Văn Kho', 'email' => 'kho@gmail.com', 'phone' => '0900000012', 'role_code' => 'WAREHOUSE'],
            ['name' => 'Lê Thị Kế Toán', 'email' => 'ketoan@gmail.com', 'phone' => '0900000013', 'role_code' => 'ACCOUNTANT'],
        ];

        foreach ($users as $u) {
            User::updateOrCreate(
                ['email' => $u['email']],
                [
                    'name' => $u['name'],
                    'phone' => $u['phone'],
                    'password' => Hash::make('12345678'),
                    'role_id' => $roles[$u['role_code']] ?? null,
                    'employee_id' => null, // tạm thời, phase sau sẽ map employee thật
                    'status' => true,
                    'must_change_password' => true,
                ]
            );
        }
    }
}