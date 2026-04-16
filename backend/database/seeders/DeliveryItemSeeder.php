<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\DeliveryItem;
use Illuminate\Support\Facades\DB;

class DeliveryItemSeeder extends Seeder
{
    public function run(): void
    {
        $deliveryOrders = DB::table('delivery_orders')->get();

        foreach ($deliveryOrders as $deliveryOrder) {
            $salesOrderItems = DB::table('sales_order_items')
                ->where('sales_order_id', $deliveryOrder->sales_order_id)
                ->get();

            foreach ($salesOrderItems as $item) {
                DeliveryItem::updateOrCreate(
                    [
                        'delivery_order_id' => $deliveryOrder->id,
                        'product_id' => $item->product_id,
                    ],
                    [
                        'quantity' => $item->quantity,
                    ]
                );
            }
        }
    }
}