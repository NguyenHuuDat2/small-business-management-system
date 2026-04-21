<?php

namespace App\Livewire\Admin\Payments;

use App\Models\Invoice;
use App\Models\Payment;
use Livewire\Component;

class Form extends Component
{
    public $open = false;
    public $isEdit = false;
    public $payment_id;

    public $invoice_id;
    public $amount;
    public $payment_method = 'cash';
    public $status = 'paid';

    protected $listeners = [
        'openPaymentFormModal' => 'openCreate',
        'editPayment' => 'openEdit',
    ];

    public function openCreate()
    {
        $this->reset();
        $this->open = true;
    }

    public function openEdit($id)
    {
        $pay = Payment::findOrFail($id);

        $this->payment_id = $pay->id;
        $this->invoice_id = $pay->invoice_id;
        $this->amount = $pay->amount;
        $this->payment_method = $pay->payment_method;
        $this->status = $pay->status;

        $this->isEdit = true;
        $this->open = true;
    }

    public function save()
    {
        $data = $this->validate([
            'invoice_id' => 'required',
            'amount' => 'required|numeric|min:1',
            'payment_method' => 'required',
            'status' => 'required',
        ]);

        if ($this->isEdit) {
            Payment::find($this->payment_id)->update($data);
        } else {
            $data['payment_no'] = 'PAY' . now()->format('YmdHis');
            Payment::create($data);
        }

        $this->updateInvoiceStatus();

        $this->dispatch('refreshTable');

        $this->dispatch(
            'notify',
            title: 'Thành công',
            message: 'Đã lưu phiếu thanh toán.',
            type: 'success'
        );

        $this->open = false;
    }

    protected function updateInvoiceStatus()
    {
        $invoice = Invoice::find($this->invoice_id);

        if (!$invoice) return;

        $paid = Payment::where('invoice_id', $invoice->id)
            ->where('status', 'paid')
            ->sum('amount');

        if ($paid >= $invoice->total_amount) {
            $invoice->status = 'paid';
        } elseif ($paid > 0) {
            $invoice->status = 'partial';
        } else {
            $invoice->status = 'unpaid';
        }

        $invoice->save();
    }

    public function render()
    {
        return view('livewire.admin.payments.form', [
            'invoices' => Invoice::all()
        ]);
    }
}