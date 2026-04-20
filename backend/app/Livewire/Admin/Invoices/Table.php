<?php

namespace App\Livewire\Admin\Invoices;

use App\Models\Invoice;
use Livewire\Component;
use Livewire\WithPagination;
use Livewire\WithoutUrlPagination;

class Table extends Component
{
    use WithPagination, WithoutUrlPagination;

    public $perPage = 10;

    protected $listeners = [
        'refreshTable' => '$refresh',
    ];

    public function delete($id)
    {
        Invoice::findOrFail($id)->delete();

        $this->dispatch(
            'notify',
            title: 'Xóa thành công',
            message: 'Hóa đơn đã được xóa.',
            type: 'success'
        );
    }

    public function edit($id)
    {
        $this->dispatch('editInvoice', id: $id);
    }

    public function render()
    {
        return view('livewire.admin.invoices.table', [
            'invoices' => Invoice::with('customer')
                ->latest()
                ->paginate($this->perPage)
        ]);
    }
}