<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Vehicle;

class VehicleSeeder extends Seeder
{
    public function run(): void
    {
        $vehicles = [
            ['vehicle_code' => 'VH001', 'name' => 'Xe tải 1 tấn',      'license_plate' => '51D-100.01', 'description' => 'Phục vụ giao hàng nội thành'],
            ['vehicle_code' => 'VH002', 'name' => 'Xe tải 1.5 tấn',    'license_plate' => '51D-100.02', 'description' => 'Phục vụ giao hàng khu vực lân cận'],
            ['vehicle_code' => 'VH003', 'name' => 'Xe van giao hàng',  'license_plate' => '51D-100.03', 'description' => 'Giao hàng linh hoạt'],
            ['vehicle_code' => 'VH004', 'name' => 'Xe tải 2.5 tấn',    'license_plate' => '51D-100.04', 'description' => 'Giao hàng số lượng lớn'],
            ['vehicle_code' => 'VH005', 'name' => 'Xe bán tải',        'license_plate' => '51D-100.05', 'description' => 'Phục vụ đơn gấp'],
            ['vehicle_code' => 'VH006', 'name' => 'Xe tải nhẹ',        'license_plate' => '61C-200.01', 'description' => 'Kho Bình Dương'],
            ['vehicle_code' => 'VH007', 'name' => 'Xe tải trung',      'license_plate' => '61C-200.02', 'description' => 'Giao liên tỉnh ngắn'],
            ['vehicle_code' => 'VH008', 'name' => 'Xe van lạnh',       'license_plate' => '51D-100.08', 'description' => 'Hàng cần điều kiện đặc biệt'],
            ['vehicle_code' => 'VH009', 'name' => 'Xe tải dự phòng',   'license_plate' => '51D-100.09', 'description' => 'Dự phòng vận hành'],
            ['vehicle_code' => 'VH010', 'name' => 'Xe giao hàng nhanh','license_plate' => '51D-100.10', 'description' => 'Đơn nội thành tốc độ cao'],
        ];

        foreach ($vehicles as $vehicle) {
            Vehicle::updateOrCreate(
                ['vehicle_code' => $vehicle['vehicle_code']],
                $vehicle
            );
        }
    }
}