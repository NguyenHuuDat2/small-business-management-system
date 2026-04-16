<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SalesOrderSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Lấy ID của khách hàng đầu tiên
        $customer = DB::table('customers')->first();
        
        // 2. Lấy ID của nhân viên Sales (đã tạo ở EmployeeSeeder)
        $employee = DB::table('employees')
            ->where('employee_code', 'EMP-SALES-001')
            ->first();

        // Kiểm tra dữ liệu cha
        if (!$customer || !$employee) {
            $this->command->error("Thiếu dữ liệu Customer hoặc Employee (Sales)! Hãy kiểm tra lại thứ tự Seeder.");
            return;
        }

        DB::table('sales_orders')->insert([
            [
                'order_no'    => 'SO-2024-001',
                'customer_id' => $customer->id,
                'employee_id' => $employee->id, // Thêm dòng này để fix lỗi của bạn
                'status'      => 'Confirmed',
                'created_at'  => now(),
                'updated_at'  => now(),
            ]
        ]);
        
        $this->command->info("Đã seed Sales Order thành công với nhân viên: " . $employee->name);
    }
}