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
        $range = $request->get('range', '30d');
        $fromDate = $this->resolveFromDate($range);
        
        // 1. Query chính
        $ordersQuery = DB::table('sales_orders as so');
        if ($fromDate) {
            $ordersQuery->where('so.created_at', '>=', $fromDate);
        }

        // 2. Summary
        $totalOrders = (clone $ordersQuery)->count();
        $totalRevenue = (float) (clone $ordersQuery)->sum('so.total_amount');
        $avgValue = $totalOrders > 0 ? round($totalRevenue / $totalOrders, 2) : 0;

        // 3. Growth
        $growth = $this->calculateGrowth($range, $fromDate, $totalRevenue);

        // 4. Status
        $statusCounts = [
            'draft' => (clone $ordersQuery)->where('so.status', 'draft')->count(),
            'submitted' => (clone $ordersQuery)->where('so.status', 'submitted')->count(),
            'approved' => (clone $ordersQuery)->where('so.status', 'approved')->count(),
            'rejected' => (clone $ordersQuery)->where('so.status', 'rejected')->count(),
            'sent_to_warehouse' => (clone $ordersQuery)->where('so.status', 'sent_to_warehouse')->count(),
            'delivered' => (clone $ordersQuery)->where('so.status', 'delivered')->count(),
            'cancelled' => (clone $ordersQuery)->where('so.status', 'cancelled')->count(),
        ];

        // 5. SALES TREND (🔥 FIX LỖI 1140 Ở ĐÂY)
        $dateFormat = ($range === 'all') ? '%m/%Y' : '%d/%m';

        $salesTrend = DB::table('sales_orders as so')
            ->select(
                DB::raw("DATE_FORMAT(so.created_at, '$dateFormat') as date"),
                DB::raw('SUM(so.total_amount) as revenue'),
                DB::raw('COUNT(so.id) as count')
            )
            ->when($fromDate, function ($q) use ($fromDate) {
                $q->where('so.created_at', '>=', $fromDate); // ✅ FIX
            })
            ->groupBy(DB::raw("DATE_FORMAT(so.created_at, '$dateFormat')")) // ✅ QUAN TRỌNG
            ->orderBy('date', 'ASC') // ✅ FIX
            ->get();

        // 6. Top Customers
        $topCustomers = DB::table('sales_orders as so')
            ->leftJoin('customers as c', 'so.customer_id', '=', 'c.id')
            ->when($fromDate, function ($q) use ($fromDate) {
                $q->where('so.created_at', '>=', $fromDate); // ✅ FIX
            })
            ->select(
                'c.id', 'c.name', 'c.phone',
                DB::raw('COUNT(so.id) as total_orders'),
                DB::raw('SUM(so.total_amount) as total_amount')
            )
            ->groupBy('c.id', 'c.name', 'c.phone')
            ->orderByDesc('total_amount')
            ->limit(5)
            ->get();

        // 7. Top Products
        $topProducts = DB::table('sales_order_items as soi')
            ->join('sales_orders as so', 'soi.sales_order_id', '=', 'so.id')
            ->leftJoin('products as p', 'soi.product_id', '=', 'p.id')
            ->when($fromDate, function ($q) use ($fromDate) {
                $q->where('so.created_at', '>=', $fromDate); // ✅ FIX
            })
            ->select(
                'p.id', 'p.product_code', 'p.name',
                DB::raw('SUM(soi.quantity) as total_quantity'),
                DB::raw('SUM(soi.subtotal) as total_amount')
            )
            ->groupBy('p.id', 'p.product_code', 'p.name')
            ->orderByDesc('total_quantity')
            ->limit(5)
            ->get();

        return response()->json([
            'success' => true,
            'data' => [
                'summary' => [
                    'total_orders' => $totalOrders,
                    'total_revenue' => $totalRevenue,
                    'average_order_value' => $avgValue,
                    'growth_rate' => $growth,
                    'status_counts' => $statusCounts,
                ],
                'sales_trend' => $salesTrend,
                'top_customers' => $topCustomers,
                'top_products' => $topProducts,
            ]
        ]);
    }

    // 🔥 FIX GROWTH CHUẨN
    private function calculateGrowth($range, $fromDate, $currentRevenue)
    {
        if (!$fromDate || $range === 'all') return 0;

        $days = match ($range) {
            '1d' => 1,
            '7d' => 7,
            '30d' => 30,
            default => 0,
        };

        $prevFrom = (clone $fromDate)->subDays($days);
        $prevTo = (clone $fromDate)->subSecond(); // ✅ TRÁNH TRÙNG

        $prevRevenue = DB::table('sales_orders')
            ->whereBetween('created_at', [$prevFrom, $prevTo])
            ->sum('total_amount');

        if ($prevRevenue <= 0) return $currentRevenue > 0 ? 100 : 0;

        return round((($currentRevenue - $prevRevenue) / $prevRevenue) * 100, 1);
    }

    // 🔥 RANGE CHUẨN
    protected function resolveFromDate(?string $range): ?Carbon
    {
        return match ($range) {
            '1d'  => now()->startOfDay(),
            '7d'  => now()->subDays(6)->startOfDay(),
            '30d' => now()->subDays(29)->startOfDay(),
            default => null,
        };
    }
}