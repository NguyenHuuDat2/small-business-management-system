<?php

namespace App\Http\Controllers\Api\Accounting;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;

class AccountingDashboardController extends Controller
{
    public function stats()
    {
        $totalInvoices = DB::table('invoices')->count();
        $totalPayments = DB::table('payments')->count();

        $totalInvoiceAmount = (float) DB::table('invoices')
            ->whereNotIn('status', ['cancelled'])
            ->sum('total_amount');

        $totalCollected = (float) DB::table('payments')
            ->where('status', 'paid')
            ->sum('amount');

        $totalReceivable = max(0, $totalInvoiceAmount - $totalCollected);

        $unpaidInvoices = DB::table('invoices')
            ->whereIn('status', ['issued', 'partial', 'overdue'])
            ->count();

        $paidInvoices = DB::table('invoices')
            ->where('status', 'paid')
            ->count();

        $recentInvoices = DB::table('invoices as i')
            ->leftJoin('customers as c', 'i.customer_id', '=', 'c.id')
            ->leftJoin('sales_orders as so', 'i.sales_order_id', '=', 'so.id')
            ->select(
                'i.id',
                'i.invoice_no',
                'i.status',
                'i.total_amount',
                'i.created_at',
                'c.name as customer_name',
                'so.order_no'
            )
            ->orderByDesc('i.id')
            ->limit(5)
            ->get();

        $recentPayments = DB::table('payments as p')
            ->leftJoin('invoices as i', 'p.invoice_id', '=', 'i.id')
            ->leftJoin('customers as c', 'i.customer_id', '=', 'c.id')
            ->select(
                'p.id',
                'p.payment_no',
                'p.status',
                'p.amount',
                'p.payment_method',
                'p.created_at',
                'i.invoice_no',
                'c.name as customer_name'
            )
            ->orderByDesc('p.id')
            ->limit(5)
            ->get();

        return response()->json([
            'success' => true,
            'data' => [
                'summary' => [
                    'total_invoices' => $totalInvoices,
                    'total_payments' => $totalPayments,
                    'unpaid_invoices' => $unpaidInvoices,
                    'paid_invoices' => $paidInvoices,
                    'total_invoice_amount' => $totalInvoiceAmount,
                    'total_collected' => $totalCollected,
                    'total_receivable' => $totalReceivable,
                ],
                'recent_invoices' => $recentInvoices,
                'recent_payments' => $recentPayments,
            ],
        ]);
    }
}
