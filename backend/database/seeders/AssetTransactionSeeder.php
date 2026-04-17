<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\AssetTransaction;
use Illuminate\Support\Facades\DB;

class AssetTransactionSeeder extends Seeder
{
    public function run(): void
    {
        $customerAssets = DB::table('customer_assets')->orderBy('id')->get();

        foreach ($customerAssets as $index => $row) {
            AssetTransaction::updateOrCreate(
                [
                    'asset_type_id' => $row->asset_type_id,
                    'customer_id' => $row->customer_id,
                    'transaction_type' => $index % 3 === 0 ? 'return' : 'borrow',
                ],
                [
                    'quantity' => max(1, min(3, $row->quantity)),
                    'note' => $index % 3 === 0
                        ? 'Thu hồi tài sản mẫu #' . ($index + 1)
                        : 'Giao tài sản mẫu #' . ($index + 1),
                ]
            );
        }
    }
}