<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Invoice;
use Illuminate\Support\Facades\DB;

class InvoiceSeeder extends Seeder
{
    public function run(): void
    {
        $orders = DB::table('sales_orders')->orderBy('id')->get();

        foreach ($orders as $index => $order) {
            $invoiceStatus = match ($order->status) {
                'completed' => 'paid',
                'delivered', 'waiting_delivery' => 'partial',
                default => 'unpaid',
            };

            Invoice::updateOrCreate(
                ['invoice_no' => 'INV' . str_pad($index + 1, 5, '0', STR_PAD_LEFT)],
                [
                    'sales_order_id' => $order->id,
                    'customer_id' => $order->customer_id,
                    'total_amount' => 0,
                    'status' => $invoiceStatus,
                ]
            );
        }
    }
}