<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Supplier;

class SupplierSeeder extends Seeder
{
    public function run(): void
    {
        $suppliers = [
            // Đồ uống
            [
                'supplier_code' => 'SUP0001',
                'name' => 'Công ty Nước Sạch Miền Nam',
                'phone' => '0911000001',
                'address' => 'Thủ Đức, TP.HCM',
            ],
            [
                'supplier_code' => 'SUP0002',
                'name' => 'Công ty Sữa Dinh Dưỡng Việt',
                'phone' => '0911000002',
                'address' => 'Hóc Môn, TP.HCM',
            ],
            [
                'supplier_code' => 'SUP0003',
                'name' => 'Công ty Cà Phê & Trà Việt',
                'phone' => '0911000003',
                'address' => 'Dĩ An, Bình Dương',
            ],
            [
                'supplier_code' => 'SUP0004',
                'name' => 'Công ty Đồ Uống Nhanh 24H',
                'phone' => '0911000004',
                'address' => 'Quận 12, TP.HCM',
            ],

            // Thực phẩm
            [
                'supplier_code' => 'SUP0005',
                'name' => 'Công ty Thực Phẩm Bình An',
                'phone' => '0911000005',
                'address' => 'Biên Hòa, Đồng Nai',
            ],
            [
                'supplier_code' => 'SUP0006',
                'name' => 'Công ty Gia Vị Việt Ngon',
                'phone' => '0911000006',
                'address' => 'Quận 8, TP.HCM',
            ],
            [
                'supplier_code' => 'SUP0007',
                'name' => 'Công ty Bánh Kẹo Tuổi Thơ',
                'phone' => '0911000007',
                'address' => 'Bình Dương',
            ],
            [
                'supplier_code' => 'SUP0008',
                'name' => 'Công ty Đồ Hộp Hải Nam',
                'phone' => '0911000008',
                'address' => 'Long An',
            ],

            // Tạp hoá
            [
                'supplier_code' => 'SUP0009',
                'name' => 'Công ty Tạp Hóa Phương Nam',
                'phone' => '0911000009',
                'address' => 'Quận 7, TP.HCM',
            ],
            [
                'supplier_code' => 'SUP0010',
                'name' => 'Công ty Hàng Tiêu Dùng Gia Đình',
                'phone' => '0911000010',
                'address' => 'Bình Chánh, TP.HCM',
            ],

            // Dân dụng
            [
                'supplier_code' => 'SUP0011',
                'name' => 'Công ty Nhựa Gia Dụng An Phát',
                'phone' => '0911000011',
                'address' => 'Long An',
            ],
            [
                'supplier_code' => 'SUP0012',
                'name' => 'Công ty Dân Dụng Nhà Bếp Việt',
                'phone' => '0911000012',
                'address' => 'Thủ Đức, TP.HCM',
            ],

            // Điện nước & gas
            [
                'supplier_code' => 'SUP0013',
                'name' => 'Công ty Gas Gia Đình Việt',
                'phone' => '0911000013',
                'address' => 'Bình Tân, TP.HCM',
            ],
            [
                'supplier_code' => 'SUP0014',
                'name' => 'Công ty Thiết Bị Gas An Toàn',
                'phone' => '0911000014',
                'address' => 'Gò Vấp, TP.HCM',
            ],
            [
                'supplier_code' => 'SUP0015',
                'name' => 'Công ty Điện Nước Thành Công',
                'phone' => '0911000015',
                'address' => 'Quận 6, TP.HCM',
            ],

            // Các nhóm còn lại
            [
                'supplier_code' => 'SUP0016',
                'name' => 'Công ty Nội Thất Gỗ Minh Khang',
                'phone' => '0911000016',
                'address' => 'Thuận An, Bình Dương',
            ],
            [
                'supplier_code' => 'SUP0017',
                'name' => 'Công ty Dược Phẩm An Tâm',
                'phone' => '0911000017',
                'address' => 'Quận 10, TP.HCM',
            ],
            [
                'supplier_code' => 'SUP0018',
                'name' => 'Công ty Thiết Bị Y Tế Sài Gòn',
                'phone' => '0911000018',
                'address' => 'Quận 5, TP.HCM',
            ],
            [
                'supplier_code' => 'SUP0019',
                'name' => 'Công ty Cám Chăn Nuôi Phú Nông',
                'phone' => '0911000019',
                'address' => 'Cần Thơ',
            ],
            [
                'supplier_code' => 'SUP0020',
                'name' => 'Công ty Thức Ăn Thú Cưng Happy Pet',
                'phone' => '0911000020',
                'address' => 'Thủ Đức, TP.HCM',
            ],
            [
                'supplier_code' => 'SUP0021',
                'name' => 'Công ty Văn Phòng Phẩm Học Tập',
                'phone' => '0911000021',
                'address' => 'Quận 12, TP.HCM',
            ],
            [
                'supplier_code' => 'SUP0022',
                'name' => 'Công ty Hóa Phẩm Sạch Nhà',
                'phone' => '0911000022',
                'address' => 'Dĩ An, Bình Dương',
            ],
            [
                'supplier_code' => 'SUP0023',
                'name' => 'Công ty Bao Bì Tiện Lợi',
                'phone' => '0911000023',
                'address' => 'Tân Phú, TP.HCM',
            ],
            [
                'supplier_code' => 'SUP0024',
                'name' => 'Kho Tổng Hàng Doanh Nghiệp Nhỏ',
                'phone' => '0911000024',
                'address' => 'Bình Chánh, TP.HCM',
            ],
        ];

        foreach ($suppliers as $supplier) {
            Supplier::updateOrCreate(
                ['supplier_code' => $supplier['supplier_code']],
                $supplier
            );
        }
    }
}