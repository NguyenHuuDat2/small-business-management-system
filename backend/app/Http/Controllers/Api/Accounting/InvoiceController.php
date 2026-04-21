<?php

namespace App\Http\Controllers\Api\Accounting;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class InvoiceController extends Controller
{
    /**
     * Lấy danh sách hóa đơn (Dùng cho Table List)
     * URL: GET /api/accounting/invoices
     */
    public function index(Request $request)
    {
        $query = Invoice::with(['customer:id,name', 'salesOrder:id,order_no']);

        // Filter search
        if ($request->status) {
            $query->where('status', $request->status);
        }

        if ($request->search) {
            $query->where('invoice_no', 'like', "%{$request->search}%");
        }

        $invoices = $query->orderBy('created_at', 'desc')
                          ->paginate($request->per_page ?? 15);
        
        return response()->json($invoices);
    }

    /**
     * Xem chi tiết hóa đơn (Dùng để Render giao diện In/Xem chi tiết)
     * URL: GET /api/accounting/invoices/{id}
     */
    public function show($id)
    {
        try {
            $invoice = Invoice::with([
                'customer', 
                'salesOrder', 
                'invoiceItems.product.unit' // Lấy tới tận Đơn vị tính
            ])->findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => [
                    'header' => [
                        'invoice_id'   => $invoice->id,
                        'invoice_no'   => $invoice->invoice_no,
                        'status'       => $invoice->status,
                        'order_no'     => $invoice->salesOrder->order_no ?? 'N/A',
                        'created_at'   => $invoice->created_at->format('d/m/Y H:i'),
                        'customer' => [
                            'name'    => $invoice->customer->name ?? 'Khách lẻ',
                            'phone'   => $invoice->customer->phone ?? '',
                            'address' => $invoice->customer->address ?? '',
                        ]
                    ],
                    'items' => $invoice->invoiceItems->map(fn($item) => [
                        'product_name' => $item->product->name ?? 'Sản phẩm đã xóa',
                        'product_code' => $item->product->product_code ?? '',
                        'unit'         => $item->product->unit->name ?? 'Cái',
                        'quantity'     => (float) $item->quantity,
                        'price'        => (float) $item->price,
                        'subtotal'     => (float) $item->subtotal,
                    ]),
                    'summary' => [
                        'total_amount' => (float) $invoice->total_amount,
                        'total_tax'    => 0, // Sơn có thể thêm logic thuế sau này
                        'final_total'  => (float) $invoice->total_amount,
                    ]
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Không tìm thấy hóa đơn'], 404);
        }
    }

    /**
     * Tạo hóa đơn mới
     * URL: POST /api/accounting/invoices
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'customer_id'        => 'required|exists:customers,id',
            'sales_order_id'     => 'nullable|exists:sales_orders,id',
            'items'              => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity'   => 'required|numeric|min:0.1',
            'items.*.price'      => 'required|numeric|min:0',
        ]);

        return DB::transaction(function () use ($validated) {
            // Logic tạo số hóa đơn INV-YYYYMMDD-STT
            $todayCount = Invoice::whereDate('created_at', today())->count() + 1;
            $invoiceNo = 'INV-' . date('Ymd') . '-' . str_pad($todayCount, 3, '0', STR_PAD_LEFT);

            $invoice = Invoice::create([
                'invoice_no'     => $invoiceNo,
                'customer_id'    => $validated['customer_id'],
                'sales_order_id' => $validated['sales_order_id'],
                'total_amount'   => 0,
                'status'         => 'Pending',
            ]);

            $totalAmount = 0;
            foreach ($validated['items'] as $item) {
                $subtotal = $item['quantity'] * $item['price'];
                $invoice->invoiceItems()->create([
                    'product_id' => $item['product_id'],
                    'quantity'   => $item['quantity'],
                    'price'      => $item['price'],
                    'subtotal'   => $subtotal,
                ]);
                $totalAmount += $subtotal;
            }

            $invoice->update(['total_amount' => $totalAmount]);

            return response()->json([
                'success' => true,
                'message' => 'Lập hóa đơn thành công',
                'id'      => $invoice->id
            ], 201);
        });
    }

    /**
     * Cập nhật trạng thái hóa đơn (Thanh toán/Hủy)
     * URL: PATCH /api/accounting/invoices/{id}/status
     */
    public function updateStatus(Request $request, $id)
    {
        $request->validate(['status' => 'required|in:Pending,Paid,Cancelled']);
        
        $invoice = Invoice::findOrFail($id);
        $invoice->update(['status' => $request->status]);

        return response()->json(['success' => true, 'message' => 'Đã cập nhật trạng thái']);
    }
}