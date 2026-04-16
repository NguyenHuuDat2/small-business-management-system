<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Xử lý Danh mục - Dùng updateOrInsert để không bị lỗi UNIQUE
        $categoryData = [
            'category_code' => 'CAT-GEN',
            'name'          => 'Danh mục chung',
            'updated_at'    => now(),
        ];

        DB::table('categories')->updateOrInsert(
            ['category_code' => 'CAT-GEN'], // Điều kiện kiểm tra
            array_merge($categoryData, ['created_at' => now()]) // Dữ liệu chèn/cập nhật
        );
        $categoryId = DB::table('categories')->where('category_code', 'CAT-GEN')->value('id');

        // 2. Xử lý Đơn vị tính - Tương tự dùng updateOrInsert
        $unitData = [
            'unit_code'  => 'PCS',
            'name'       => 'Cái',
            'updated_at' => now(),
        ];

        DB::table('units')->updateOrInsert(
            ['unit_code' => 'PCS'],
            array_merge($unitData, ['created_at' => now()])
        );
        $unitId = DB::table('units')->where('unit_code', 'PCS')->value('id');

        // 3. Xử lý Sản phẩm
        // Xóa sạch bảng products trước khi nạp để đảm bảo đồng nhất ID 1 và 2
        DB::table('products')->delete();

        DB::table('products')->insert([
            [
                'id'           => 1,
                'name'         => 'Sản phẩm mẫu A',
                'product_code' => 'PROD-A',
                'price'        => 500000,
                'category_id'  => $categoryId,
                'unit_id'      => $unitId,
                'created_at'   => now(),
                'updated_at'   => now(),
            ],
            [
                'id'           => 2,
                'name'         => 'Sản phẩm mẫu B',
                'product_code' => 'PROD-B',
                'price'        => 500000,
                'category_id'  => $categoryId,
                'unit_id'      => $unitId,
                'created_at'   => now(),
                'updated_at'   => now(),
            ],
        ]);
    }
}