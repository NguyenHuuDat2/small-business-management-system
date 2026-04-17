<?php

namespace App\Http\Controllers\Api\Sales;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;

class SalesDashboardController extends Controller
{
    public function stats()
    {
        $totalCustomers = DB::table('customers')->count();
        $totalOrders = DB::table('sales_orders')->count();

        $draftOrders = DB::table('sales_orders')->where('status', 'draft')->count();
        $submittedOrders = DB::table('sales_orders')->where('status', 'submitted')->count();
        $approvedOrders = DB::table('sales_orders')->where('status', 'approved')->count();
        $cancelledOrders = DB::table('sales_orders')->where('status', 'cancelled')->count();

        $totalRevenue = (float) DB::table('sales_orders')
            ->whereIn('status', ['approved', 'sent_to_warehouse', 'delivered', 'completed'])
            ->sum('total_amount');

        $recentOrders = DB::table('sales_orders as so')
            ->leftJoin('customers as c', 'so.customer_id', '=', 'c.id')
            ->leftJoin('employees as e', 'so.employee_id', '=', 'e.id')
            ->select(
                'so.id',
                'so.order_no',
                'so.status',
                'so.total_amount',
                'so.created_at',
                'c.name as customer_name',
                'e.name as employee_name'
            )
            ->orderByDesc('so.id')
            ->limit(5)
            ->get();

        return response()->json([
            'success' => true,
            'data' => [
                'summary' => [
                    'total_customers' => $totalCustomers,
                    'total_orders' => $totalOrders,
                    'draft_orders' => $draftOrders,
                    'submitted_orders' => $submittedOrders,
                    'approved_orders' => $approvedOrders,
                    'cancelled_orders' => $cancelledOrders,
                    'total_revenue' => $totalRevenue,
                ],
                'recent_orders' => $recentOrders,
            ],
        ]);
    }
}