<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    public function run()
    {
        Category::insert([
            [
                'name' => 'Điện tử',
                'category_code' => 'DT'
            ],
            [
                'name' => 'Thực phẩm',
                'category_code' => 'TP'
            ],
            [
                'name' => 'Gia dụng',
                'category_code' => 'GD'
            ],
            [
                'name' => 'Văn phòng phẩm',
                'category_code' => 'VPP'
            ],
            [
                'name' => 'Mỹ phẩm',
                'category_code' => 'MP'
            ],
        ]);
    }
}