<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class PaymentSeeder extends Seeder
{
    public function run()
    {
        $invoice = DB::table('invoices')->where('status', 'Paid')->first();

        if ($invoice) {
            DB::table('payments')->insert([
                'payment_no' => 'PAY-001',
                'invoice_id' => $invoice->id,
                'amount' => $invoice->total_amount,
                'payment_method' => 'Bank Transfer',
                'status' => 'Completed',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ]);
        }
    }
}