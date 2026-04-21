<?php

namespace App\Livewire\Admin\Payments;

use App\Models\Payment;
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
        Payment::findOrFail($id)->delete();

        $this->dispatch(
            'notify',
            title: 'Xóa thành công',
            message: 'Phiếu thanh toán đã được xóa.',
            type: 'success'
        );
    }

    public function edit($id)
    {
        $this->dispatch('editPayment', id: $id);
    }

    public function render()
    {
        return view('livewire.admin.payments.table', [
            'payments' => Payment::with('invoice')
                ->latest()
                ->paginate($this->perPage)
        ]);
    }
}