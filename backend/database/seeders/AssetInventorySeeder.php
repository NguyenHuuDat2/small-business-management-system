<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\AssetInventory;
use Illuminate\Support\Facades\DB;

class AssetInventorySeeder extends Seeder
{
    public function run(): void
    {
        $types = DB::table('asset_types')->orderBy('id')->pluck('id')->toArray();

        foreach ($types as $index => $typeId) {
            AssetInventory::updateOrCreate(
                ['asset_type_id' => $typeId],
                ['quantity' => 20 + ($index * 5)]
            );
        }
    }
}