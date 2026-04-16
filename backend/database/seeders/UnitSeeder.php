<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Unit;

class UnitSeeder extends Seeder
{
    public function run()
    {
        Unit::insert([
            [
                'name' => 'Cái',
                'unit_code' => 'CAI'
            ],
            [
                'name' => 'Hộp',
                'unit_code' => 'HOP'
            ],
            [
                'name' => 'Kg',
                'unit_code' => 'KG'
            ],
            [
                'name' => 'Chai',
                'unit_code' => 'CHAI'
            ],
            [
                'name' => 'Gói',
                'unit_code' => 'GOI'
            ],
        ]);
    }
}