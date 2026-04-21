<?php

namespace App\Livewire\Admin\Receivables;

use App\Models\Invoice;
use Livewire\Component;
use Livewire\WithPagination;
use Livewire\WithoutUrlPagination;
use Illuminate\Support\Facades\DB;

class Table extends Component
{
    use WithPagination, WithoutUrlPagination;

    public $perPage = 10;

    public function render()
    {
        $rows = Invoice::query()
            ->join('customers', 'customers.id', '=', 'invoices.customer_id')
            ->leftJoin('payments', 'payments.invoice_id', '=', 'invoices.id')
            ->select(
                'customers.name',
                'customers.phone',
                DB::raw('SUM(invoices.total_amount) as total_invoice'),
                DB::raw('COALESCE(SUM(payments.amount),0) as total_paid'),
                DB::raw('SUM(invoices.total_amount) - COALESCE(SUM(payments.amount),0) as debt')
            )
            ->groupBy('customers.id', 'customers.name', 'customers.phone')
            ->orderByDesc('debt')
            ->paginate($this->perPage);

        return view('livewire.admin.receivables.table', [
            'rows' => $rows
        ]);
    }
}