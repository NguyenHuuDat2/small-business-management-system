<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class CustomerSeeder extends Seeder
{
    public function run()
    {
        DB::table('customers')->insert([
            [
                'customer_code' => 'CUS001',
                'name' => 'Nguyễn Văn A',
                'phone' => '0901234567',
                'address' => 'Hà Nội',
                'customer_type' => 'VIP',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'customer_code' => 'CUS002',
                'name' => 'Trần Thị B',
                'phone' => '0908888999',
                'address' => 'TP.HCM',
                'customer_type' => 'Regular',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
        ]);
    }
}