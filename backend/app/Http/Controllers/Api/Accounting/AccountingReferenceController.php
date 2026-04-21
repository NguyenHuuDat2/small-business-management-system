<?php

namespace App\Http\Controllers\Api\Accounting;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AccountingReferenceController extends Controller
{
    public function customers(Request $request)
    {
        $q = trim((string) $request->get('q', ''));
        $limit = (int) $request->get('limit', 50);
        $limit = max(1, min($limit, 100));

        $query = DB::table('customers')
            ->select('id', 'customer_code', 'name', 'phone');

        if ($q !== '') {
            $query->where(function ($sub) use ($q) {
                $sub->where('customer_code', 'like', "%{$q}%")
                    ->orWhere('name', 'like', "%{$q}%")
                    ->orWhere('phone', 'like', "%{$q}%");
            });
        }

        $data = $query
            ->orderBy('name')
            ->limit($limit)
            ->get();

        return response()->json([
            'success' => true,
            'data' => $data,
        ]);
    }

    public function salesOrders(Request $request)
    {
        $q = trim((string) $request->get('q', ''));
        $customerId = $request->get('customer_id');
        $limit = (int) $request->get('limit', 50);
        $limit = max(1, min($limit, 100));

        $query = DB::table('sales_orders as so')
            ->leftJoin('customers as c', 'so.customer_id', '=', 'c.id')
            ->select(
                'so.id',
                'so.order_no',
                'so.customer_id',
                'so.total_amount',
                'so.status',
                'c.customer_code',
                'c.name as customer_name'
            );

        if (! empty($customerId)) {
            $query->where('so.customer_id', $customerId);
        }

        if ($q !== '') {
            $query->where(function ($sub) use ($q) {
                $sub->where('so.order_no', 'like', "%{$q}%")
                    ->orWhere('c.name', 'like', "%{$q}%")
                    ->orWhere('c.customer_code', 'like', "%{$q}%");
            });
        }

        $data = $query
            ->orderByDesc('so.id')
            ->limit($limit)
            ->get();

        return response()->json([
            'success' => true,
            'data' => $data,
        ]);
    }

    public function invoices(Request $request)
    {
        $q = trim((string) $request->get('q', ''));
        $limit = (int) $request->get('limit', 50);
        $limit = max(1, min($limit, 100));

        $query = DB::table('invoices as i')
            ->leftJoin('customers as c', 'i.customer_id', '=', 'c.id')
            ->select(
                'i.id',
                'i.invoice_no',
                'i.customer_id',
                'i.total_amount',
                'i.status',
                'c.customer_code',
                'c.name as customer_name',
                DB::raw('(SELECT COALESCE(SUM(p.amount), 0) FROM payments p WHERE p.invoice_id = i.id AND p.status = "paid") as paid_amount')
            );

        if ($q !== '') {
            $query->where(function ($sub) use ($q) {
                $sub->where('i.invoice_no', 'like', "%{$q}%")
                    ->orWhere('c.name', 'like', "%{$q}%")
                    ->orWhere('c.customer_code', 'like', "%{$q}%");
            });
        }

        $data = $query
            ->orderByDesc('i.id')
            ->limit($limit)
            ->get()
            ->map(function ($row) {
                $total = (float) ($row->total_amount ?? 0);
                $paid = (float) ($row->paid_amount ?? 0);
                $row->balance_amount = max(0, $total - $paid);
                return $row;
            });

        return response()->json([
            'success' => true,
            'data' => $data,
        ]);
    }
}
