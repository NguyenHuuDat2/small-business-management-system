<?php

namespace App\Http\Controllers\Api\Sales;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class SalesReportController extends Controller
{
    public function overview(Request $request)
    {
        $range = $request->get('range', '30d'); // 7d | 30d | all
        $fromDate = $this->resolveFromDate($range);

        $ordersQuery = DB::table('sales_orders as so');

        if ($fromDate) {
            $ordersQuery->whereDate('so.created_at', '>=', $fromDate->toDateString());
        }

        $totalOrders = (clone $ordersQuery)->count();
        $totalRevenue = (float) (clone $ordersQuery)->sum('so.total_amount');

        $statusCounts = [
            'draft' => (clone $ordersQuery)->where('so.status', 'draft')->count(),
            'submitted' => (clone $ordersQuery)->where('so.status', 'submitted')->count(),
            'approved' => (clone $ordersQuery)->where('so.status', 'approved')->count(),
            'rejected' => (clone $ordersQuery)->where('so.status', 'rejected')->count(),
            'sent_to_warehouse' => (clone $ordersQuery)->where('so.status', 'sent_to_warehouse')->count(),
            'delivered' => (clone $ordersQuery)->where('so.status', 'delivered')->count(),
            'cancelled' => (clone $ordersQuery)->where('so.status', 'cancelled')->count(),
        ];

        $topCustomers = DB::table('sales_orders as so')
            ->leftJoin('customers as c', 'so.customer_id', '=', 'c.id')
            ->when($fromDate, function ($q) use ($fromDate) {
                $q->whereDate('so.created_at', '>=', $fromDate->toDateString());
            })
            ->select(
                'c.id',
                'c.name',
                'c.phone',
                DB::raw('COUNT(so.id) as total_orders'),
                DB::raw('COALESCE(SUM(so.total_amount), 0) as total_amount')
            )
            ->groupBy('c.id', 'c.name', 'c.phone')
            ->orderByDesc('total_amount')
            ->limit(5)
            ->get();

        $topProducts = DB::table('sales_order_items as soi')
            ->join('sales_orders as so', 'soi.sales_order_id', '=', 'so.id')
            ->leftJoin('products as p', 'soi.product_id', '=', 'p.id')
            ->when($fromDate, function ($q) use ($fromDate) {
                $q->whereDate('so.created_at', '>=', $fromDate->toDateString());
            })
            ->select(
                'p.id',
                'p.product_code',
                'p.name',
                DB::raw('COALESCE(SUM(soi.quantity), 0) as total_quantity'),
                DB::raw('COALESCE(SUM(soi.subtotal), 0) as total_amount')
            )
            ->groupBy('p.id', 'p.product_code', 'p.name')
            ->orderByDesc('total_quantity')
            ->limit(5)
            ->get();

        return response()->json([
            'success' => true,
            'data' => [
                'range' => $range,
                'summary' => [
                    'total_orders' => $totalOrders,
                    'total_revenue' => $totalRevenue,
                    'average_order_value' => $totalOrders > 0 ? round($totalRevenue / $totalOrders, 2) : 0,
                    'status_counts' => $statusCounts,
                ],
                'top_customers' => $topCustomers,
                'top_products' => $topProducts,
            ],
        ]);
    }

    protected function resolveFromDate(?string $range): ?Carbon
    {
        return match ($range) {
            '7d' => now()->subDays(7),
            '30d' => now()->subDays(30),
            default => null,
        };
    }
}