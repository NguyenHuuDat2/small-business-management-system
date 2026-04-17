<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Location;
use Illuminate\Support\Facades\DB;

class LocationSeeder extends Seeder
{
    public function run(): void
    {
        $warehouses = DB::table('ware_house')->pluck('id', 'warehouse_code');

        $locations = [
            ['location_code' => 'LOC-WH001-A01', 'warehouse_code' => 'WH001', 'name' => 'Kệ A01'],
            ['location_code' => 'LOC-WH001-A02', 'warehouse_code' => 'WH001', 'name' => 'Kệ A02'],
            ['location_code' => 'LOC-WH001-B01', 'warehouse_code' => 'WH001', 'name' => 'Kệ B01'],
            ['location_code' => 'LOC-WH001-B02', 'warehouse_code' => 'WH001', 'name' => 'Kệ B02'],
            ['location_code' => 'LOC-WH001-C01', 'warehouse_code' => 'WH001', 'name' => 'Kệ C01'],

            ['location_code' => 'LOC-WH002-A01', 'warehouse_code' => 'WH002', 'name' => 'Kệ A01'],
            ['location_code' => 'LOC-WH002-A02', 'warehouse_code' => 'WH002', 'name' => 'Kệ A02'],
            ['location_code' => 'LOC-WH002-B01', 'warehouse_code' => 'WH002', 'name' => 'Kệ B01'],
            ['location_code' => 'LOC-WH002-B02', 'warehouse_code' => 'WH002', 'name' => 'Kệ B02'],
            ['location_code' => 'LOC-WH002-C01', 'warehouse_code' => 'WH002', 'name' => 'Kệ C01'],

            ['location_code' => 'LOC-WH003-A01', 'warehouse_code' => 'WH003', 'name' => 'Kệ A01'],
            ['location_code' => 'LOC-WH003-A02', 'warehouse_code' => 'WH003', 'name' => 'Kệ A02'],
            ['location_code' => 'LOC-WH003-B01', 'warehouse_code' => 'WH003', 'name' => 'Kệ B01'],
            ['location_code' => 'LOC-WH003-B02', 'warehouse_code' => 'WH003', 'name' => 'Kệ B02'],
            ['location_code' => 'LOC-WH003-C01', 'warehouse_code' => 'WH003', 'name' => 'Kệ C01'],

            ['location_code' => 'LOC-WH004-A01', 'warehouse_code' => 'WH004', 'name' => 'Kệ A01'],
            ['location_code' => 'LOC-WH004-A02', 'warehouse_code' => 'WH004', 'name' => 'Kệ A02'],
            ['location_code' => 'LOC-WH004-B01', 'warehouse_code' => 'WH004', 'name' => 'Kệ B01'],
            ['location_code' => 'LOC-WH004-B02', 'warehouse_code' => 'WH004', 'name' => 'Kệ B02'],
            ['location_code' => 'LOC-WH004-C01', 'warehouse_code' => 'WH004', 'name' => 'Kệ C01'],
        ];

        foreach ($locations as $location) {
            Location::updateOrCreate(
                ['location_code' => $location['location_code']],
                [
                    'warehouse_id' => $warehouses[$location['warehouse_code']] ?? null,
                    'name' => $location['name'],
                ]
            );
        }
    }
}