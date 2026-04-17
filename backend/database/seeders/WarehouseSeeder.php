<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Warehouse;

class WarehouseSeeder extends Seeder
{
    public function run(): void
    {
        $warehouses = [
            ['warehouse_code' => 'WH001', 'name' => 'Kho trung tâm TP.HCM', 'address' => '120 Xa lộ Hà Nội, Thủ Đức, TP.HCM'],
            ['warehouse_code' => 'WH002', 'name' => 'Kho Bình Dương',       'address' => '88 Đại lộ Bình Dương, Dĩ An, Bình Dương'],
            ['warehouse_code' => 'WH003', 'name' => 'Kho Long An',          'address' => '35 Quốc lộ 1A, Tân An, Long An'],
            ['warehouse_code' => 'WH004', 'name' => 'Kho giao nhanh',       'address' => '21 Nguyễn Văn Linh, Quận 7, TP.HCM'],
        ];

        foreach ($warehouses as $warehouse) {
            Warehouse::updateOrCreate(
                ['warehouse_code' => $warehouse['warehouse_code']],
                $warehouse
            );
        }
    }
}