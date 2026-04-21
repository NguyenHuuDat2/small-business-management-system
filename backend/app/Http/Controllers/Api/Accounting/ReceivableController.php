<?php

namespace App\Http\Controllers\Api\Accounting;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ReceivableController extends Controller
{
    public function index(Request $request)
    {
        $q = trim((string) $request->get('q', ''));
        $status = trim((string) $request->get('status', ''));
        $perPage = (int) $request->get('per_page', 10);
        $perPage = max(1, min($perPage, 50));

        $query = Invoice::query()
            ->from('invoices as i')
            ->leftJoin('customers as c', 'i.customer_id', '=', 'c.id')
            ->leftJoin('sales_orders as so', 'i.sales_order_id', '=', 'so.id')
            ->select([
                'i.id',
                'i.invoice_no',
                'i.sales_order_id',
                'i.customer_id',
                'i.total_amount',
                'i.status',
                'i.created_at',
                'c.customer_code',
                'c.name as customer_name',
                'c.phone as customer_phone',
                'so.order_no',
                DB::raw('(SELECT COALESCE(SUM(p.amount), 0) FROM payments p WHERE p.invoice_id = i.id AND p.status = "paid") as paid_amount'),
            ])
            ->whereNotIn('i.status', ['cancelled']);

        if ($q !== '') {
            $query->where(function ($sub) use ($q) {
                $sub->where('i.invoice_no', 'like', "%{$q}%")
                    ->orWhere('c.name', 'like', "%{$q}%")
                    ->orWhere('c.customer_code', 'like', "%{$q}%")
                    ->orWhere('so.order_no', 'like', "%{$q}%");
            });
        }

        if ($status !== '') {
            $query->where('i.status', $status);
        }

        $data = $query
            ->orderByDesc('i.id')
            ->paginate($perPage);

        $data->getCollection()->transform(function ($row) {
            $total = (float) ($row->total_amount ?? 0);
            $paid = (float) ($row->paid_amount ?? 0);
            $balance = max(0, $total - $paid);

            $row->balance_amount = $balance;
            $row->is_settled = $balance <= 0;

            return $row;
        });

        return response()->json([
            'success' => true,
            'data' => $data,
        ]);
    }
}
