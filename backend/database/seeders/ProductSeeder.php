<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;
use App\Models\Category;
use App\Models\Unit;

class ProductSeeder extends Seeder
{
    public function run()
    {
        $categories = Category::all();
        $units = Unit::all();

        Product::insert([
            [
                'name' => 'iPhone 15',
                'product_code' => 'IP15',
                'price' => 25000000,
                'category_id' => $categories->where('name', 'Điện tử')->first()->id,
                'unit_id' => $units->where('name', 'Cái')->first()->id,
            ],
            [
                'name' => 'Mì tôm',
                'product_code' => 'MITOM',
                'price' => 5000,
                'category_id' => $categories->where('name', 'Thực phẩm')->first()->id,
                'unit_id' => $units->where('name', 'Gói')->first()->id,
            ],
            [
                'name' => 'Nồi cơm điện',
                'product_code' => 'NOICD',
                'price' => 1200000,
                'category_id' => $categories->where('name', 'Gia dụng')->first()->id,
                'unit_id' => $units->where('name', 'Cái')->first()->id,
            ],
        ]);
    }
}