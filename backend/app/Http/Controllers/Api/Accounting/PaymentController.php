<?php

namespace App\Http\Controllers\Api\Accounting;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class PaymentController extends Controller
{
    public function index(Request $request)
    {
        $q = trim((string) $request->get('q', ''));
        $status = trim((string) $request->get('status', ''));
        $perPage = (int) $request->get('per_page', 10);
        $perPage = max(1, min($perPage, 50));

        $query = Payment::query()
            ->from('payments as p')
            ->leftJoin('invoices as i', 'p.invoice_id', '=', 'i.id')
            ->leftJoin('customers as c', 'i.customer_id', '=', 'c.id')
            ->select([
                'p.id',
                'p.payment_no',
                'p.invoice_id',
                'p.amount',
                'p.payment_method',
                'p.status',
                'p.created_at',
                'i.invoice_no',
                'c.customer_code',
                'c.name as customer_name',
            ]);

        if ($q !== '') {
            $query->where(function ($sub) use ($q) {
                $sub->where('p.payment_no', 'like', "%{$q}%")
                    ->orWhere('i.invoice_no', 'like', "%{$q}%")
                    ->orWhere('c.name', 'like', "%{$q}%")
                    ->orWhere('c.customer_code', 'like', "%{$q}%");
            });
        }

        if ($status !== '') {
            $query->where('p.status', $status);
        }

        $data = $query
            ->orderByDesc('p.id')
            ->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $data,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'invoice_id' => ['required', 'integer', Rule::exists('invoices', 'id')],
            'amount' => ['required', 'numeric', 'min:0.01'],
            'payment_method' => ['nullable', 'string', 'max:100'],
            'status' => ['nullable', 'string', Rule::in(['pending', 'paid', 'failed', 'refunded'])],
        ]);

        $payment = Payment::create([
            'payment_no' => $this->generatePaymentNo(),
            'invoice_id' => $validated['invoice_id'],
            'amount' => $validated['amount'],
            'payment_method' => $validated['payment_method'] ?? null,
            'status' => $validated['status'] ?? 'paid',
        ]);

        $this->syncInvoiceStatus($payment->invoice_id);

        return response()->json([
            'success' => true,
            'message' => 'Ghi nhận thanh toán thành công.',
            'data' => $payment,
        ], 201);
    }

    public function update(Request $request, int $id)
    {
        $payment = Payment::find($id);

        if (! $payment) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy thanh toán.',
            ], 404);
        }

        $validated = $request->validate([
            'invoice_id' => ['required', 'integer', Rule::exists('invoices', 'id')],
            'amount' => ['required', 'numeric', 'min:0.01'],
            'payment_method' => ['nullable', 'string', 'max:100'],
            'status' => ['nullable', 'string', Rule::in(['pending', 'paid', 'failed', 'refunded'])],
        ]);

        $oldInvoiceId = (int) $payment->invoice_id;

        $payment->update([
            'invoice_id' => $validated['invoice_id'],
            'amount' => $validated['amount'],
            'payment_method' => $validated['payment_method'] ?? null,
            'status' => $validated['status'] ?? $payment->status,
        ]);

        $this->syncInvoiceStatus($oldInvoiceId);
        $this->syncInvoiceStatus((int) $payment->invoice_id);

        return response()->json([
            'success' => true,
            'message' => 'Cập nhật thanh toán thành công.',
            'data' => $payment,
        ]);
    }

    public function destroy(int $id)
    {
        $payment = Payment::find($id);

        if (! $payment) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy thanh toán.',
            ], 404);
        }

        $invoiceId = (int) $payment->invoice_id;
        $payment->delete();

        $this->syncInvoiceStatus($invoiceId);

        return response()->json([
            'success' => true,
            'message' => 'Xóa thanh toán thành công.',
        ]);
    }

    protected function syncInvoiceStatus(int $invoiceId): void
    {
        $invoice = Invoice::find($invoiceId);

        if (! $invoice) {
            return;
        }

        if ($invoice->status === 'cancelled') {
            return;
        }

        $paidAmount = (float) DB::table('payments')
            ->where('invoice_id', $invoiceId)
            ->where('status', 'paid')
            ->sum('amount');

        $totalAmount = (float) ($invoice->total_amount ?? 0);

        if ($totalAmount <= 0) {
            $nextStatus = 'issued';
        } elseif ($paidAmount <= 0) {
            $nextStatus = 'issued';
        } elseif ($paidAmount >= $totalAmount) {
            $nextStatus = 'paid';
        } else {
            $nextStatus = 'partial';
        }

        if ($invoice->status !== $nextStatus) {
            $invoice->status = $nextStatus;
            $invoice->save();
        }
    }

    protected function generatePaymentNo(): string
    {
        $latestId = Payment::max('id') ?? 0;
        $next = $latestId + 1;

        do {
            $code = 'PAY' . str_pad((string) $next, 5, '0', STR_PAD_LEFT);
            $exists = Payment::where('payment_no', $code)->exists();
            $next++;
        } while ($exists);

        return $code;
    }
}
