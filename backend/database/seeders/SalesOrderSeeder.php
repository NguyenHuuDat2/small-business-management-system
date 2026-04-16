<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\SalesOrder;
use Illuminate\Support\Facades\DB;

class SalesOrderSeeder extends Seeder
{
    public function run(): void
    {
        $customerIds = DB::table('customers')->orderBy('id')->pluck('id')->toArray();

        $salesDepartmentId = DB::table('departments')->where('department_code', 'SALES')->value('id');
        $csDepartmentId = DB::table('departments')->where('department_code', 'CS')->value('id');

        $employeeIds = DB::table('employees')
            ->whereIn('department_id', array_filter([$salesDepartmentId, $csDepartmentId]))
            ->orderBy('id')
            ->pluck('id')
            ->toArray();

        $statuses = [
            'draft',
            'confirmed',
            'waiting_delivery',
            'delivered',
            'completed',
        ];

        for ($i = 1; $i <= 20; $i++) {
            SalesOrder::updateOrCreate(
                ['order_no' => 'SO' . str_pad($i, 5, '0', STR_PAD_LEFT)],
                [
                    'customer_id' => $customerIds[($i - 1) % count($customerIds)],
                    'employee_id' => $employeeIds[($i - 1) % count($employeeIds)],
                    'total_amount' => 0,
                    'status' => $statuses[$i % count($statuses)],
                ]
            );
        }
    }
}