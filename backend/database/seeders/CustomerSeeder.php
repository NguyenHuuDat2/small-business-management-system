<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Customer;

class CustomerSeeder extends Seeder
{
    public function run(): void
    {
        $types = ['Đại lý', 'Cửa hàng', 'Doanh nghiệp', 'Khách lẻ'];
        $districts = ['Quận 1', 'Quận 3', 'Quận 7', 'Bình Thạnh', 'Thủ Đức', 'Biên Hòa', 'Dĩ An', 'Tân An'];

        for ($i = 1; $i <= 50; $i++) {
            Customer::updateOrCreate(
                ['customer_code' => 'CUS' . str_pad($i, 4, '0', STR_PAD_LEFT)],
                [
                    'name' => 'Khách hàng ' . $i,
                    'phone' => '0933' . str_pad((string)$i, 6, '0', STR_PAD_LEFT),
                    'address' => $i . ' Nguyễn Văn Linh, ' . $districts[$i % count($districts)],
                    'customer_type' => $types[$i % count($types)],
                    'note' => 'Khách hàng mẫu phục vụ nghiệp vụ bán hàng và công nợ #' . $i,
                ]
            );
        }
    }
}