<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'name' => 'Nguyễn Hữu Đạt',
            'email' => 'huudat@gmail.com',
            'phone' => '0900000001',
            'password' => Hash::make('123456')
        ]);

        User::create([
            'name' => 'Lý Thu Thảo',
            'email' => 'thuthao@gmail.com',
            'phone' => '0900000002',
            'password' => Hash::make('123456')
        ]);

        User::create([
            'name' => 'Võ Nguyễn Gia Hưng',
            'email' => 'giahung@gmail.com',
            'phone' => '0900000003',
            'password' => Hash::make('123456')
        ]);

        User::create([
            'name' => 'Phạm Văn Sơn',
            'email' => 'vanson@gmail.com',
            'phone' => '0900000004',
            'password' => Hash::make('123456')
        ]);
    }
}