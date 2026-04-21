<?php

namespace App\Http\Controllers\Api\Accounting;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use App\Models\SalesOrder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class InvoiceController extends Controller
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
            ]);

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
            $row->balance_amount = max(0, $total - $paid);
            return $row;
        });

        return response()->json([
            'success' => true,
            'data' => $data,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'sales_order_id' => ['required', 'integer', Rule::exists('sales_orders', 'id')],
            'customer_id' => ['required', 'integer', Rule::exists('customers', 'id')],
            'total_amount' => ['required', 'numeric', 'min:0'],
            'status' => ['nullable', 'string', Rule::in(['draft', 'issued', 'partial', 'paid', 'overdue', 'cancelled'])],
        ]);

        $salesOrder = SalesOrder::find($validated['sales_order_id']);

        if (! $salesOrder) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy đơn bán hàng.',
            ], 404);
        }

        if ((int) $salesOrder->customer_id !== (int) $validated['customer_id']) {
            return response()->json([
                'success' => false,
                'message' => 'Khách hàng không khớp với đơn bán hàng đã chọn.',
            ], 422);
        }

        $invoice = Invoice::create([
            'invoice_no' => $this->generateInvoiceNo(),
            'sales_order_id' => $validated['sales_order_id'],
            'customer_id' => $validated['customer_id'],
            'total_amount' => $validated['total_amount'],
            'status' => $validated['status'] ?? 'issued',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Tạo hóa đơn thành công.',
            'data' => $invoice,
        ], 201);
    }

    public function update(Request $request, int $id)
    {
        $invoice = Invoice::find($id);

        if (! $invoice) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy hóa đơn.',
            ], 404);
        }

        $validated = $request->validate([
            'sales_order_id' => ['required', 'integer', Rule::exists('sales_orders', 'id')],
            'customer_id' => ['required', 'integer', Rule::exists('customers', 'id')],
            'total_amount' => ['required', 'numeric', 'min:0'],
            'status' => ['nullable', 'string', Rule::in(['draft', 'issued', 'partial', 'paid', 'overdue', 'cancelled'])],
        ]);

        $salesOrder = SalesOrder::find($validated['sales_order_id']);

        if (! $salesOrder) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy đơn bán hàng.',
            ], 404);
        }

        if ((int) $salesOrder->customer_id !== (int) $validated['customer_id']) {
            return response()->json([
                'success' => false,
                'message' => 'Khách hàng không khớp với đơn bán hàng đã chọn.',
            ], 422);
        }

        $invoice->update([
            'sales_order_id' => $validated['sales_order_id'],
            'customer_id' => $validated['customer_id'],
            'total_amount' => $validated['total_amount'],
            'status' => $validated['status'] ?? $invoice->status,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Cập nhật hóa đơn thành công.',
            'data' => $invoice,
        ]);
    }

    public function destroy(int $id)
    {
        $invoice = Invoice::find($id);

        if (! $invoice) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy hóa đơn.',
            ], 404);
        }

        try {
            $invoice->delete();
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Không thể xóa hóa đơn đã phát sinh thanh toán.',
            ], 422);
        }

        return response()->json([
            'success' => true,
            'message' => 'Xóa hóa đơn thành công.',
        ]);
    }

    protected function generateInvoiceNo(): string
    {
        $latestId = Invoice::max('id') ?? 0;
        $next = $latestId + 1;

        do {
            $code = 'INV' . str_pad((string) $next, 5, '0', STR_PAD_LEFT);
            $exists = Invoice::where('invoice_no', $code)->exists();
            $next++;
        } while ($exists);

        return $code;
    }
}
