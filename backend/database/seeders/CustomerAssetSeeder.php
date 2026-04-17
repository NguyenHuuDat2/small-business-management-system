<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\CustomerAsset;
use Illuminate\Support\Facades\DB;

class CustomerAssetSeeder extends Seeder
{
    public function run(): void
    {
        $customerIds = DB::table('customers')->orderBy('id')->pluck('id')->take(20)->toArray();
        $assetTypeIds = DB::table('asset_types')->orderBy('id')->pluck('id')->toArray();

        foreach ($customerIds as $index => $customerId) {
            CustomerAsset::updateOrCreate(
                [
                    'customer_id' => $customerId,
                    'asset_type_id' => $assetTypeIds[$index % count($assetTypeIds)],
                ],
                [
                    'quantity' => ($index % 5) + 1,
                ]
            );
        }
    }
}