<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\InvoiceItem;
use Illuminate\Support\Facades\DB;

class InvoiceItemSeeder extends Seeder
{
    public function run(): void
    {
        $invoices = DB::table('invoices')->orderBy('id')->get();
        $prices = DB::table('products')->pluck('price', 'id');

        foreach ($invoices as $invoice) {
            $salesOrderItems = DB::table('sales_order_items')
                ->where('sales_order_id', $invoice->sales_order_id)
                ->get();

            $total = 0;

            foreach ($salesOrderItems as $item) {
                $price = $prices[$item->product_id] ?? 0;
                $subtotal = $item->quantity * $price;

                InvoiceItem::updateOrCreate(
                    [
                        'invoice_id' => $invoice->id,
                        'product_id' => $item->product_id,
                    ],
                    [
                        'quantity' => $item->quantity,
                        'price' => $price,
                        'subtotal' => $subtotal,
                    ]
                );

                $total += $subtotal;
            }

            DB::table('invoices')
                ->where('id', $invoice->id)
                ->update(['total_amount' => $total]);
        }
    }
}