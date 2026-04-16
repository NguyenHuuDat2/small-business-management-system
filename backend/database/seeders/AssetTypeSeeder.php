<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\AssetType;

class AssetTypeSeeder extends Seeder
{
    public function run(): void
    {
        $types = [
            ['asset_type_code' => 'AST-BOTTLE20', 'name' => 'Vỏ bình 20L', 'description' => 'Tài sản quay vòng giao cho khách'],
            ['asset_type_code' => 'AST-RACK',     'name' => 'Kệ trưng bày', 'description' => 'Kệ trưng bày tại điểm bán'],
            ['asset_type_code' => 'AST-FRIDGE',   'name' => 'Tủ mát',       'description' => 'Tủ mát hỗ trợ bán hàng'],
            ['asset_type_code' => 'AST-UMBRELLA', 'name' => 'Dù che',       'description' => 'Dù quảng bá thương hiệu'],
            ['asset_type_code' => 'AST-SIGN',     'name' => 'Bảng hiệu',    'description' => 'Bảng hiệu tại đại lý'],
            ['asset_type_code' => 'AST-CRATE',    'name' => 'Khay nhựa',    'description' => 'Khay chứa hàng quay vòng'],
            ['asset_type_code' => 'AST-STAND',    'name' => 'Standee',      'description' => 'Standee marketing tại cửa hàng'],
            ['asset_type_code' => 'AST-SHELF',    'name' => 'Kệ phụ kiện',  'description' => 'Kệ phụ trưng bày sản phẩm'],
        ];

        foreach ($types as $type) {
            AssetType::updateOrCreate(
                ['asset_type_code' => $type['asset_type_code']],
                $type
            );
        }
    }
}