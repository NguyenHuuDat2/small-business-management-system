<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Unit;

class UnitSeeder extends Seeder
{
    public function run(): void
    {
        $units = [
            ['unit_code' => 'PCS',     'name' => 'Cái'],
            ['unit_code' => 'BOX',     'name' => 'Hộp'],
            ['unit_code' => 'PACK',    'name' => 'Gói'],
            ['unit_code' => 'BAG',     'name' => 'Bao'],
            ['unit_code' => 'BOTTLE',  'name' => 'Chai'],
            ['unit_code' => 'CAN',     'name' => 'Lon'],
            ['unit_code' => 'SET',     'name' => 'Bộ'],
            ['unit_code' => 'REAM',    'name' => 'Ream'],
            ['unit_code' => 'ROLL',    'name' => 'Cuộn'],
            ['unit_code' => 'KG',      'name' => 'Kg'],
            ['unit_code' => 'LITER',   'name' => 'Lít'],
            ['unit_code' => 'CARTON',  'name' => 'Thùng'],
            ['unit_code' => 'PAIR',    'name' => 'Đôi'],
            ['unit_code' => 'BINH',    'name' => 'Bình'],
            ['unit_code' => 'TUBE',    'name' => 'Tuýp'],
            ['unit_code' => 'JAR',     'name' => 'Hũ'],
            ['unit_code' => 'SACK',    'name' => 'Bao lớn'],
        ];

        foreach ($units as $unit) {
            Unit::updateOrCreate(
                ['unit_code' => $unit['unit_code']],
                $unit
            );
        }
    }
}