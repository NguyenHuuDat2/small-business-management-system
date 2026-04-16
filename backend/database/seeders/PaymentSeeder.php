<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Payment;
use Illuminate\Support\Facades\DB;

class PaymentSeeder extends Seeder
{
    public function run(): void
    {
        $invoices = DB::table('invoices')->orderBy('id')->get();
        $methods = ['cash', 'bank_transfer', 'ewallet'];

        foreach ($invoices as $index => $invoice) {
            $amount = match ($invoice->status) {
                'paid' => $invoice->total_amount,
                'partial' => round($invoice->total_amount * 0.6, 0),
                default => round($invoice->total_amount * 0.2, 0),
            };

            $paymentStatus = match ($invoice->status) {
                'paid' => 'completed',
                'partial' => 'partial',
                default => 'pending',
            };

            Payment::updateOrCreate(
                ['payment_no' => 'PAY' . str_pad($index + 1, 5, '0', STR_PAD_LEFT)],
                [
                    'invoice_id' => $invoice->id,
                    'amount' => $amount,
                    'payment_method' => $methods[$index % count($methods)],
                    'status' => $paymentStatus,
                ]
            );
        }
    }
}