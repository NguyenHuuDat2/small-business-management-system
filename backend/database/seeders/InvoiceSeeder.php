<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class InvoiceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Lấy ID của khách hàng đầu tiên (đảm bảo CustomerSeeder đã chạy trước)
        $customer = DB::table('customers')->first();
        
        // 2. Lấy ID của đơn hàng (Sales Order) đầu tiên
        // Nếu bạn chưa có SalesOrderSeeder, hãy tạo dữ liệu mẫu cho nó trước
        $salesOrder = DB::table('sales_orders')->first();

        // Kiểm tra xem đã có dữ liệu cha chưa để tránh lỗi
        if (!$customer || !$salesOrder) {
            $this->command->warn("Chưa có dữ liệu trong bảng customers hoặc sales_orders. Vui lòng seed chúng trước!");
            return;
        }

        DB::table('invoices')->insert([
            [
                'invoice_no'     => 'INV-' . date('Ymd') . '-001',
                'sales_order_id' => $salesOrder->id, // Lấy ID thực tế từ DB
                'customer_id'    => $customer->id,    // Lấy ID thực tế từ DB
                'total_amount'   => 1500000,
                'status'         => 'Paid',
                'created_at'     => Carbon::now(),
                'updated_at'     => Carbon::now(),
            ],
            [
                'invoice_no'     => 'INV-' . date('Ymd') . '-002',
                'sales_order_id' => $salesOrder->id,
                'customer_id'    => $customer->id,
                'total_amount'   => 500000,
                'status'         => 'Pending',
                'created_at'     => Carbon::now(),
                'updated_at'     => Carbon::now(),
            ],
        ]);
        
        $this->command->info("Đã seed bảng Invoices thành công!");
    }
}
