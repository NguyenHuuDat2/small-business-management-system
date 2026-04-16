<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Delivery;
use Illuminate\Support\Facades\DB;

class DeliverySeeder extends Seeder
{
    public function run(): void
    {
        $vehicleIds = DB::table('vehicles')->orderBy('id')->pluck('id')->toArray();
        $warehouseIds = DB::table('ware_house')->orderBy('id')->pluck('id')->toArray();

        $whDepartmentId = DB::table('departments')->where('department_code', 'WH')->value('id');
        $employeeIds = DB::table('employees')
            ->where('department_id', $whDepartmentId)
            ->orderBy('id')
            ->pluck('id')
            ->toArray();

        $statuses = ['planned', 'delivering', 'completed'];

        for ($i = 1; $i <= 20; $i++) {
            Delivery::updateOrCreate(
                ['delivery_no' => 'DO' . str_pad($i, 5, '0', STR_PAD_LEFT)],
                [
                    'vehicle_id' => $vehicleIds[($i - 1) % count($vehicleIds)],
                    'employee_id' => $employeeIds[($i - 1) % count($employeeIds)],
                    'warehouse_id' => $warehouseIds[($i - 1) % count($warehouseIds)],
                    'status' => $statuses[$i % count($statuses)],
                    'note' => 'Phiếu giao hàng mẫu #' . $i,
                ]
            );
        }
    }
}