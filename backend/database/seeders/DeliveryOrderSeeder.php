<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\DeliveryOrder;
use Illuminate\Support\Facades\DB;

class DeliveryOrderSeeder extends Seeder
{
    public function run(): void
    {
        $deliveries = DB::table('deliveries')->orderBy('id')->pluck('id')->toArray();
        $salesOrders = DB::table('sales_orders')->orderBy('id')->pluck('id')->toArray();
        $statuses = ['waiting', 'picked', 'delivered'];

        $count = min(count($deliveries), count($salesOrders), 20);

        for ($i = 0; $i < $count; $i++) {
            DeliveryOrder::updateOrCreate(
                [
                    'delivery_id' => $deliveries[$i],
                    'sales_order_id' => $salesOrders[$i],
                ],
                [
                    'status' => $statuses[$i % count($statuses)],
                ]
            );
        }
    }
}