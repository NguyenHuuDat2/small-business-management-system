<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\GoodsReceipt;
use Illuminate\Support\Facades\DB;

class GoodsReceiptSeeder extends Seeder
{
    public function run(): void
    {
        $supplierIds = DB::table('suppliers')->orderBy('id')->pluck('id')->toArray();
        $warehouseIds = DB::table('ware_house')->orderBy('id')->pluck('id')->toArray();

        $statuses = ['draft', 'approved', 'completed'];

        for ($i = 1; $i <= 20; $i++) {
            GoodsReceipt::updateOrCreate(
                ['receipt_no' => 'GRN' . str_pad($i, 5, '0', STR_PAD_LEFT)],
                [
                    'supplier_id' => $supplierIds[($i - 1) % count($supplierIds)],
                    'warehouse_id' => $warehouseIds[($i - 1) % count($warehouseIds)],
                    'total_amount' => 0,
                    'status' => $statuses[$i % count($statuses)],
                ]
            );
        }
    }
}