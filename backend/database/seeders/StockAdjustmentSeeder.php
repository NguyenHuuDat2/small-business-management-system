<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\StockAdjustment;
use Illuminate\Support\Facades\DB;

class StockAdjustmentSeeder extends Seeder
{
    public function run(): void
    {
        $productIds = DB::table('products')->orderBy('id')->pluck('id')->toArray();
        $locationIds = DB::table('locations')->orderBy('id')->pluck('id')->toArray();

        for ($i = 1; $i <= 20; $i++) {
            $systemQty = 80 + ($i * 3);
            $actualQty = $systemQty + (($i % 2 === 0) ? 5 : -3);

            StockAdjustment::updateOrCreate(
                ['adjustment_no' => 'ADJ' . str_pad($i, 5, '0', STR_PAD_LEFT)],
                [
                    'product_id' => $productIds[($i - 1) % count($productIds)],
                    'location_id' => $locationIds[($i - 1) % count($locationIds)],
                    'system_quantity' => $systemQty,
                    'actual_quantity' => $actualQty,
                    'difference' => $actualQty - $systemQty,
                ]
            );
        }
    }
}