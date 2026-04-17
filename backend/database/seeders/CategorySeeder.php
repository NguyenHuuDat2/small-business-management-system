<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $parents = [
            ['category_code' => 'BEV',  'name' => 'Đồ uống'],
            ['category_code' => 'FOOD', 'name' => 'Thực phẩm'],
            ['category_code' => 'GROC', 'name' => 'Tạp hoá'],
            ['category_code' => 'HOME', 'name' => 'Đồ dân dụng'],
            ['category_code' => 'ELEC', 'name' => 'Điện nước & gas'],
            ['category_code' => 'FURN', 'name' => 'Nội thất & đồ gỗ'],
            ['category_code' => 'MED',  'name' => 'Thuốc men & y tế'],
            ['category_code' => 'FEED', 'name' => 'Thức ăn chăn nuôi'],
            ['category_code' => 'OFF',  'name' => 'Văn phòng phẩm'],
            ['category_code' => 'CLN',  'name' => 'Vệ sinh'],
            ['category_code' => 'PKG',  'name' => 'Bao bì'],
        ];

        foreach ($parents as $parent) {
            Category::updateOrCreate(
                ['category_code' => $parent['category_code']],
                [
                    'name' => $parent['name'],
                    'parent_id' => null,
                ]
            );
        }

        $categoryIds = Category::pluck('id', 'category_code');

        $children = [
            // Đồ uống
            ['category_code' => 'BEV-WATER',   'name' => 'Nước uống',                'parent_code' => 'BEV'],
            ['category_code' => 'BEV-MILK',    'name' => 'Sữa & dinh dưỡng',         'parent_code' => 'BEV'],
            ['category_code' => 'BEV-COFFEE',  'name' => 'Cà phê & trà',             'parent_code' => 'BEV'],
            ['category_code' => 'BEV-SOFT',    'name' => 'Nước ngọt',                'parent_code' => 'BEV'],

            // Thực phẩm
            ['category_code' => 'FOOD-INSTANT', 'name' => 'Mì, cháo, phở ăn liền',   'parent_code' => 'FOOD'],
            ['category_code' => 'FOOD-CANNED',  'name' => 'Đồ hộp',                  'parent_code' => 'FOOD'],
            ['category_code' => 'FOOD-SNACK',   'name' => 'Bánh kẹo & snack',        'parent_code' => 'FOOD'],
            ['category_code' => 'FOOD-SEASON',  'name' => 'Gia vị',                  'parent_code' => 'FOOD'],
            ['category_code' => 'FOOD-DRY',     'name' => 'Thực phẩm khô',           'parent_code' => 'FOOD'],

            // Tạp hoá
            ['category_code' => 'GROC-OIL',     'name' => 'Dầu ăn & nước chấm',      'parent_code' => 'GROC'],
            ['category_code' => 'GROC-DAILY',   'name' => 'Hàng tạp hoá hằng ngày',  'parent_code' => 'GROC'],

            // Dân dụng
            ['category_code' => 'HOME-KITCHEN', 'name' => 'Đồ bếp dân dụng',         'parent_code' => 'HOME'],
            ['category_code' => 'HOME-PLASTIC', 'name' => 'Nhựa gia dụng',           'parent_code' => 'HOME'],
            ['category_code' => 'HOME-HOUSE',   'name' => 'Đồ dùng gia đình',        'parent_code' => 'HOME'],

            // Điện nước & gas
            ['category_code' => 'ELEC-GAS',     'name' => 'Gas & phụ kiện gas',      'parent_code' => 'ELEC'],
            ['category_code' => 'ELEC-WATER',   'name' => 'Thiết bị điện nước',      'parent_code' => 'ELEC'],

            // Nội thất
            ['category_code' => 'FURN-WOOD',    'name' => 'Đồ gỗ',                   'parent_code' => 'FURN'],
            ['category_code' => 'FURN-CABINET', 'name' => 'Tủ, kệ nội thất',         'parent_code' => 'FURN'],

            // Thuốc men
            ['category_code' => 'MED-OTC',      'name' => 'Thuốc thông dụng',        'parent_code' => 'MED'],
            ['category_code' => 'MED-FIRSTAID', 'name' => 'Y tế & sơ cứu',           'parent_code' => 'MED'],

            // Cám
            ['category_code' => 'FEED-PET',      'name' => 'Thức ăn thú cưng',       'parent_code' => 'FEED'],
            ['category_code' => 'FEED-LIVESTOCK','name' => 'Cám chăn nuôi',          'parent_code' => 'FEED'],

            // Văn phòng phẩm
            ['category_code' => 'OFF-PAPER',      'name' => 'Giấy in & tập vở',      'parent_code' => 'OFF'],
            ['category_code' => 'OFF-STATIONERY', 'name' => 'Bút & dụng cụ học tập', 'parent_code' => 'OFF'],

            // Vệ sinh
            ['category_code' => 'CLN-DETERGENT',  'name' => 'Chất tẩy rửa',          'parent_code' => 'CLN'],
            ['category_code' => 'CLN-TOOL',       'name' => 'Dụng cụ vệ sinh',       'parent_code' => 'CLN'],

            // Bao bì
            ['category_code' => 'PKG-CARTON',     'name' => 'Thùng carton',          'parent_code' => 'PKG'],
            ['category_code' => 'PKG-BAG',        'name' => 'Túi & bao bì',          'parent_code' => 'PKG'],
        ];

        foreach ($children as $child) {
            Category::updateOrCreate(
                ['category_code' => $child['category_code']],
                [
                    'name' => $child['name'],
                    'parent_id' => $categoryIds[$child['parent_code']] ?? null,
                ]
            );
        }
    }
}