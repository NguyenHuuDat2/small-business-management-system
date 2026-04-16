<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        // Xóa dữ liệu cũ để tránh trùng lặp category_code (vì có index UNIQUE)
        DB::table('categories')->delete();

        DB::table('categories')->insert([
            [
                'id' => 1,
                'category_code' => 'CAT-GEN',
                'name' => 'Danh mục chung',
                'parent_id' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 2,
                'category_code' => 'CAT-ELEC',
                'name' => 'Điện tử',
                'parent_id' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}