<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Inventory;
use Illuminate\Support\Facades\DB;

class InventorySeeder extends Seeder
{
    public function run(): void
    {
        $products = DB::table('products')->orderBy('id')->get();
        $locations = DB::table('locations')->orderBy('id')->pluck('id')->toArray();

        if ($products->isEmpty() || empty($locations)) {
            return;
        }

        foreach ($products as $index => $product) {
            $primaryLocation = $locations[$index % count($locations)];
            $secondaryLocation = $locations[($index + 5) % count($locations)];

            Inventory::updateOrCreate(
                [
                    'product_id' => $product->id,
                    'location_id' => $primaryLocation,
                ],
                [
                    'quantity' => 20 + (($index % 8) * 10),
                ]
            );

            if ($index % 3 === 0) {
                Inventory::updateOrCreate(
                    [
                        'product_id' => $product->id,
                        'location_id' => $secondaryLocation,
                    ],
                    [
                        'quantity' => 5 + (($index % 5) * 5),
                    ]
                );
            }
        }
    }
}