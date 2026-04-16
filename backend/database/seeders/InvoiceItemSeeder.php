<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class InvoiceItemSeeder extends Seeder
{
    public function run()
    {
        $invoice = DB::table('invoices')->first();
        $product1 = DB::table('products')->where('id', 1)->first();
        $product2 = DB::table('products')->where('id', 2)->first();

        // Kiểm tra xem có Hóa đơn và Sản phẩm chưa
        if (!$invoice || !$product1) {
            $this->command->warn("Thiếu hóa đơn hoặc sản phẩm (ID 1, 2). Bỏ qua seed InvoiceItems.");
            return;
        }

        DB::table('invoice_items')->insert([
            [
                'invoice_id' => $invoice->id,
                'product_id' => $product1->id,
                'quantity' => 2,
                'price' => $product1->price,
                'subtotal' => 1000000,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'invoice_id' => $invoice->id,
                'product_id' => $product2->id ?? $product1->id, // Nếu ko có sp 2 thì dùng tạm sp 1
                'quantity' => 1,
                'price' => 500000,
                'subtotal' => 500000,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
        ]);
    }
}