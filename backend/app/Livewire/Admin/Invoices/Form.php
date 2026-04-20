<?php

namespace App\Livewire\Admin\Invoices;

use App\Models\Customer;
use App\Models\Invoice;
use App\Models\SalesOrder;
use Livewire\Component;

class Form extends Component
{
    public $open = false;
    public $isEdit = false;
    public $invoice_id;

    public $customer_id;
    public $sales_order_id;
    public $total_amount;
    public $status = 'draft';

    protected $listeners = [
        'openInvoiceFormModal' => 'openCreate',
        'editInvoice' => 'openEdit',
    ];

    public function openCreate()
    {
        $this->reset();
        $this->open = true;
    }

    public function openEdit($id)
    {
        $invoice = Invoice::findOrFail($id);

        $this->invoice_id = $invoice->id;
        $this->customer_id = $invoice->customer_id;
        $this->sales_order_id = $invoice->sales_order_id;
        $this->total_amount = $invoice->total_amount;
        $this->status = $invoice->status;

        $this->isEdit = true;
        $this->open = true;
    }

    public function save()
    {
        $data = $this->validate([
            'customer_id' => 'required',
            'sales_order_id' => 'required',
            'total_amount' => 'required|numeric',
            'status' => 'required',
        ]);

        if ($this->isEdit) {
            Invoice::find($this->invoice_id)->update($data);
        } else {
            $data['invoice_no'] = 'INV' . now()->format('YmdHis');
            Invoice::create($data);
        }

        $this->dispatch('refreshTable');

        $this->dispatch(
            'notify',
            title: 'Thành công',
            message: 'Đã lưu hóa đơn.',
            type: 'success'
        );

        $this->open = false;
    }

    public function render()
    {
        return view('livewire.admin.invoices.form', [
            'customers' => Customer::all(),
            'orders' => SalesOrder::all(),
        ]);
    }
}