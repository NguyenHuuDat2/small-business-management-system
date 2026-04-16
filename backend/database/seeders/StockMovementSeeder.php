<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\StockMovement;
use Illuminate\Support\Facades\DB;

class StockMovementSeeder extends Seeder
{
    public function run(): void
    {
        // Từ phiếu nhập
        $receiptItems = DB::table('goods_receipt_items')->get();

        foreach ($receiptItems as $item) {
            StockMovement::updateOrCreate(
                [
                    'reference_type' => 'goods_receipt',
                    'reference_id' => $item->id,
                    'product_id' => $item->product_id,
                ],
                [
                    'location_id' => $item->location_id,
                    'quantity' => $item->quantity,
                    'movement_type' => 'IN',
                ]
            );
        }

        // Từ giao hàng
        $deliveryItems = DB::table('delivery_items')->get();

        foreach ($deliveryItems as $item) {
            $inventoryLocationId = DB::table('inventory')
                ->where('product_id', $item->product_id)
                ->value('location_id');

            $fallbackLocationId = DB::table('locations')->value('id');

            StockMovement::updateOrCreate(
                [
                    'reference_type' => 'delivery',
                    'reference_id' => $item->id,
                    'product_id' => $item->product_id,
                ],
                [
                    'location_id' => $inventoryLocationId ?? $fallbackLocationId,
                    'quantity' => $item->quantity,
                    'movement_type' => 'OUT',
                ]
            );
        }

        // Từ điều chỉnh kho
        $adjustments = DB::table('stock_adjustments')->get();

        foreach ($adjustments as $adj) {
            StockMovement::updateOrCreate(
                [
                    'reference_type' => 'stock_adjustment',
                    'reference_id' => $adj->id,
                    'product_id' => $adj->product_id,
                ],
                [
                    'location_id' => $adj->location_id,
                    'quantity' => abs($adj->difference),
                    'movement_type' => $adj->difference >= 0 ? 'ADJUST_IN' : 'ADJUST_OUT',
                ]
            );
        }
    }
}