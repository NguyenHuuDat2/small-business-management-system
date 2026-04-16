<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;
use Illuminate\Support\Facades\DB;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $categories = DB::table('categories')->pluck('id', 'category_code');
        $units = DB::table('units')->pluck('id', 'unit_code');

        $products = [
            // =====================================================
            // 1) ĐỒ UỐNG - tăng mạnh
            // =====================================================
            ['name' => 'Nước suối 500ml',                 'category_code' => 'BEV-WATER',  'unit_code' => 'BOTTLE', 'price' => 7000,   'is_returnable' => false],
            ['name' => 'Nước khoáng 1.5L',                'category_code' => 'BEV-WATER',  'unit_code' => 'BOTTLE', 'price' => 12000,  'is_returnable' => false],
            ['name' => 'Bình nước 20L',                   'category_code' => 'BEV-WATER',  'unit_code' => 'BINH',   'price' => 65000,  'is_returnable' => true],
            ['name' => 'Thùng nước suối 24 chai',         'category_code' => 'BEV-WATER',  'unit_code' => 'CARTON', 'price' => 115000, 'is_returnable' => false],
            ['name' => 'Nước ion kiềm 500ml',             'category_code' => 'BEV-WATER',  'unit_code' => 'BOTTLE', 'price' => 11000,  'is_returnable' => false],

            ['name' => 'Sữa tươi 180ml',                  'category_code' => 'BEV-MILK',   'unit_code' => 'BOX',    'price' => 9000,   'is_returnable' => false],
            ['name' => 'Sữa hộp 1L',                      'category_code' => 'BEV-MILK',   'unit_code' => 'BOX',    'price' => 34000,  'is_returnable' => false],
            ['name' => 'Sữa chua uống lốc 4 chai',        'category_code' => 'BEV-MILK',   'unit_code' => 'PACK',   'price' => 32000,  'is_returnable' => false],
            ['name' => 'Sữa đậu nành hộp',                'category_code' => 'BEV-MILK',   'unit_code' => 'BOX',    'price' => 8000,   'is_returnable' => false],

            ['name' => 'Cà phê hòa tan 3in1',             'category_code' => 'BEV-COFFEE', 'unit_code' => 'BOX',    'price' => 65000,  'is_returnable' => false],
            ['name' => 'Cà phê rang xay 500g',            'category_code' => 'BEV-COFFEE', 'unit_code' => 'BAG',    'price' => 120000, 'is_returnable' => false],
            ['name' => 'Trà xanh chai 450ml',             'category_code' => 'BEV-COFFEE', 'unit_code' => 'BOTTLE', 'price' => 12000,  'is_returnable' => false],
            ['name' => 'Trà đen túi lọc',                 'category_code' => 'BEV-COFFEE', 'unit_code' => 'BOX',    'price' => 45000,  'is_returnable' => false],

            ['name' => 'Nước ngọt cola lon',              'category_code' => 'BEV-SOFT',   'unit_code' => 'CAN',    'price' => 11000,  'is_returnable' => false],
            ['name' => 'Nước cam lon',                    'category_code' => 'BEV-SOFT',   'unit_code' => 'CAN',    'price' => 10000,  'is_returnable' => false],
            ['name' => 'Nước tăng lực lon',               'category_code' => 'BEV-SOFT',   'unit_code' => 'CAN',    'price' => 14000,  'is_returnable' => false],

            // =====================================================
            // 2) THỰC PHẨM - tăng mạnh
            // =====================================================
            ['name' => 'Mì gói vị tôm',                   'category_code' => 'FOOD-INSTANT', 'unit_code' => 'PACK', 'price' => 4500,   'is_returnable' => false],
            ['name' => 'Mì ly hải sản',                   'category_code' => 'FOOD-INSTANT', 'unit_code' => 'PCS',  'price' => 13000,  'is_returnable' => false],
            ['name' => 'Phở bò ăn liền',                  'category_code' => 'FOOD-INSTANT', 'unit_code' => 'PACK', 'price' => 8500,   'is_returnable' => false],
            ['name' => 'Cháo gói thịt bằm',               'category_code' => 'FOOD-INSTANT', 'unit_code' => 'PACK', 'price' => 7000,   'is_returnable' => false],

            ['name' => 'Cá hộp sốt cà',                   'category_code' => 'FOOD-CANNED',  'unit_code' => 'CAN',  'price' => 28000,  'is_returnable' => false],
            ['name' => 'Thịt hộp',                        'category_code' => 'FOOD-CANNED',  'unit_code' => 'CAN',  'price' => 42000,  'is_returnable' => false],
            ['name' => 'Bắp hộp',                         'category_code' => 'FOOD-CANNED',  'unit_code' => 'CAN',  'price' => 24000,  'is_returnable' => false],

            ['name' => 'Bánh quy bơ',                     'category_code' => 'FOOD-SNACK',   'unit_code' => 'BOX',  'price' => 42000,  'is_returnable' => false],
            ['name' => 'Snack khoai tây',                 'category_code' => 'FOOD-SNACK',   'unit_code' => 'PACK', 'price' => 12000,  'is_returnable' => false],
            ['name' => 'Kẹo gừng',                        'category_code' => 'FOOD-SNACK',   'unit_code' => 'PACK', 'price' => 18000,  'is_returnable' => false],
            ['name' => 'Bánh xốp socola',                 'category_code' => 'FOOD-SNACK',   'unit_code' => 'BOX',  'price' => 36000,  'is_returnable' => false],

            ['name' => 'Muối tinh 1kg',                   'category_code' => 'FOOD-SEASON',  'unit_code' => 'KG',   'price' => 18000,  'is_returnable' => false],
            ['name' => 'Đường trắng 1kg',                 'category_code' => 'FOOD-SEASON',  'unit_code' => 'KG',   'price' => 24000,  'is_returnable' => false],
            ['name' => 'Bột ngọt 454g',                   'category_code' => 'FOOD-SEASON',  'unit_code' => 'BAG',  'price' => 38000,  'is_returnable' => false],
            ['name' => 'Hạt nêm 400g',                    'category_code' => 'FOOD-SEASON',  'unit_code' => 'BAG',  'price' => 42000,  'is_returnable' => false],

            ['name' => 'Gạo thơm 5kg',                    'category_code' => 'FOOD-DRY',     'unit_code' => 'BAG',  'price' => 95000,  'is_returnable' => false],
            ['name' => 'Đậu xanh 1kg',                    'category_code' => 'FOOD-DRY',     'unit_code' => 'BAG',  'price' => 42000,  'is_returnable' => false],
            ['name' => 'Mì spaghetti 500g',               'category_code' => 'FOOD-DRY',     'unit_code' => 'BAG',  'price' => 28000,  'is_returnable' => false],

            // =====================================================
            // 3) TẠP HOÁ - tăng mạnh
            // =====================================================
            ['name' => 'Dầu ăn 1L',                       'category_code' => 'GROC-OIL',   'unit_code' => 'BOTTLE', 'price' => 52000,  'is_returnable' => false],
            ['name' => 'Nước mắm 500ml',                  'category_code' => 'GROC-OIL',   'unit_code' => 'BOTTLE', 'price' => 36000,  'is_returnable' => false],
            ['name' => 'Nước tương 650ml',                'category_code' => 'GROC-OIL',   'unit_code' => 'BOTTLE', 'price' => 28000,  'is_returnable' => false],
            ['name' => 'Tương ớt 500g',                   'category_code' => 'GROC-OIL',   'unit_code' => 'BOTTLE', 'price' => 24000,  'is_returnable' => false],

            ['name' => 'Bật lửa gas',                     'category_code' => 'GROC-DAILY', 'unit_code' => 'PCS',    'price' => 7000,   'is_returnable' => false],
            ['name' => 'Pin AA vỉ 4 viên',                'category_code' => 'GROC-DAILY', 'unit_code' => 'PACK',   'price' => 32000,  'is_returnable' => false],
            ['name' => 'Nến ly',                          'category_code' => 'GROC-DAILY', 'unit_code' => 'PCS',    'price' => 12000,  'is_returnable' => false],
            ['name' => 'Khăn giấy hộp',                   'category_code' => 'GROC-DAILY', 'unit_code' => 'BOX',    'price' => 22000,  'is_returnable' => false],
            ['name' => 'Giấy vệ sinh lốc 10 cuộn',        'category_code' => 'GROC-DAILY', 'unit_code' => 'PACK',   'price' => 85000,  'is_returnable' => false],

            // =====================================================
            // 4) ĐỒ DÂN DỤNG - tăng mạnh
            // =====================================================
            ['name' => 'Nồi inox 24cm',                   'category_code' => 'HOME-KITCHEN', 'unit_code' => 'PCS', 'price' => 220000, 'is_returnable' => false],
            ['name' => 'Chảo chống dính 26cm',            'category_code' => 'HOME-KITCHEN', 'unit_code' => 'PCS', 'price' => 280000, 'is_returnable' => false],
            ['name' => 'Bộ chén sứ 6 cái',                'category_code' => 'HOME-KITCHEN', 'unit_code' => 'SET', 'price' => 180000, 'is_returnable' => false],
            ['name' => 'Bình giữ nhiệt 1L',               'category_code' => 'HOME-KITCHEN', 'unit_code' => 'PCS', 'price' => 195000, 'is_returnable' => false],

            ['name' => 'Rổ nhựa lớn',                     'category_code' => 'HOME-PLASTIC', 'unit_code' => 'PCS', 'price' => 35000,  'is_returnable' => false],
            ['name' => 'Thau nhựa 30L',                   'category_code' => 'HOME-PLASTIC', 'unit_code' => 'PCS', 'price' => 55000,  'is_returnable' => false],
            ['name' => 'Hộp nhựa đựng thực phẩm',         'category_code' => 'HOME-PLASTIC', 'unit_code' => 'SET', 'price' => 89000,  'is_returnable' => false],

            ['name' => 'Móc áo nhựa 10 cái',              'category_code' => 'HOME-HOUSE',   'unit_code' => 'PACK','price' => 28000,  'is_returnable' => false],
            ['name' => 'Khay nhựa đựng hàng',             'category_code' => 'HOME-HOUSE',   'unit_code' => 'PCS', 'price' => 42000,  'is_returnable' => false],
            ['name' => 'Thùng đá mini',                   'category_code' => 'HOME-HOUSE',   'unit_code' => 'PCS', 'price' => 165000, 'is_returnable' => false],

            // =====================================================
            // 5) ĐIỆN NƯỚC & GAS - tăng mạnh
            // =====================================================
            ['name' => 'Bình gas 12kg',                   'category_code' => 'ELEC-GAS',   'unit_code' => 'BINH', 'price' => 430000, 'is_returnable' => true],
            ['name' => 'Bình gas mini du lịch',           'category_code' => 'ELEC-GAS',   'unit_code' => 'BINH', 'price' => 32000,  'is_returnable' => false],
            ['name' => 'Dây gas 1.5m',                    'category_code' => 'ELEC-GAS',   'unit_code' => 'PCS',  'price' => 65000,  'is_returnable' => false],
            ['name' => 'Van điều áp gas',                 'category_code' => 'ELEC-GAS',   'unit_code' => 'PCS',  'price' => 120000, 'is_returnable' => false],

            ['name' => 'Ống nước PVC phi 21',             'category_code' => 'ELEC-WATER', 'unit_code' => 'PCS',  'price' => 78000,  'is_returnable' => false],
            ['name' => 'Van khoá nước',                   'category_code' => 'ELEC-WATER', 'unit_code' => 'PCS',  'price' => 55000,  'is_returnable' => false],
            ['name' => 'Ổ cắm điện 3 lỗ',                 'category_code' => 'ELEC-WATER', 'unit_code' => 'PCS',  'price' => 48000,  'is_returnable' => false],
            ['name' => 'Bóng đèn LED 9W',                 'category_code' => 'ELEC-WATER', 'unit_code' => 'PCS',  'price' => 35000,  'is_returnable' => false],

            // =====================================================
            // CÁC LĨNH VỰC CÒN LẠI - giữ ít hơn như cũ
            // =====================================================
            ['name' => 'Bàn gỗ học sinh',                 'category_code' => 'FURN-WOOD',    'unit_code' => 'PCS',  'price' => 850000, 'is_returnable' => false],
            ['name' => 'Kệ sách 4 tầng',                  'category_code' => 'FURN-CABINET', 'unit_code' => 'PCS',  'price' => 650000, 'is_returnable' => false],

            ['name' => 'Paracetamol 500mg',               'category_code' => 'MED-OTC',      'unit_code' => 'BOX',  'price' => 28000,  'is_returnable' => false],
            ['name' => 'Băng cá nhân',                    'category_code' => 'MED-FIRSTAID', 'unit_code' => 'BOX',  'price' => 18000,  'is_returnable' => false],

            ['name' => 'Thức ăn chó trưởng thành 3kg',    'category_code' => 'FEED-PET',       'unit_code' => 'BAG',  'price' => 210000, 'is_returnable' => false],
            ['name' => 'Cám gà đẻ 25kg',                  'category_code' => 'FEED-LIVESTOCK', 'unit_code' => 'SACK', 'price' => 285000, 'is_returnable' => false],

            ['name' => 'Giấy A4 70gsm',                   'category_code' => 'OFF-PAPER',       'unit_code' => 'REAM', 'price' => 68000,  'is_returnable' => false],
            ['name' => 'Bút bi xanh hộp 20 cây',          'category_code' => 'OFF-STATIONERY',  'unit_code' => 'BOX',  'price' => 55000,  'is_returnable' => false],

            ['name' => 'Nước lau sàn 1L',                 'category_code' => 'CLN-DETERGENT',   'unit_code' => 'BOTTLE', 'price' => 45000, 'is_returnable' => false],
            ['name' => 'Chổi quét nhà',                   'category_code' => 'CLN-TOOL',        'unit_code' => 'PCS',    'price' => 45000, 'is_returnable' => false],

            ['name' => 'Thùng carton vừa',                'category_code' => 'PKG-CARTON',      'unit_code' => 'PCS',  'price' => 12000,  'is_returnable' => false],
            ['name' => 'Túi nilon quai xách',             'category_code' => 'PKG-BAG',         'unit_code' => 'PACK', 'price' => 25000,  'is_returnable' => false],
        ];

        foreach ($products as $index => $product) {
            Product::updateOrCreate(
                ['product_code' => 'PRD' . str_pad($index + 1, 4, '0', STR_PAD_LEFT)],
                [
                    'name' => $product['name'],
                    'category_id' => $categories[$product['category_code']] ?? null,
                    'unit_id' => $units[$product['unit_code']] ?? ($units['PCS'] ?? null),
                    'price' => $product['price'],
                    'image' => null,
                    'is_returnable' => $product['is_returnable'],
                ]
            );
        }
    }
}