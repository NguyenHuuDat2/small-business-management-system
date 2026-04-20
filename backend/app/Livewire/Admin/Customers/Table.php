<?php

namespace App\Livewire\Admin\Customers;

use App\Models\Customer;
use Livewire\Component;
use Livewire\WithPagination;
use Livewire\WithoutUrlPagination;

class Table extends Component
{
    use WithPagination, WithoutUrlPagination;

    public $perPage = 10;

    protected $paginationTheme = 'tailwind';

    protected $listeners = [
        'refreshTable' => '$refresh',
        'customersDeleteConfirmed' => 'delete',
    ];

    public function render()
    {
        $customers = Customer::query()
            ->latest()
            ->paginate($this->perPage);

        return view('livewire.admin.customers.table', [
            'customers' => $customers,
        ]);
    }

    public function updatedPerPage()
    {
        $this->resetPage();
    }

    public function edit($id)
    {
        $this->dispatch('editCustomer', id: $id);
    }

    public function confirmDelete($id)
    {
        $this->dispatch(
            'openDeleteModal',
            itemId: $id,
            title: 'Xóa khách hàng',
            targetEvent: 'customersDeleteConfirmed'
        );
    }

    public function delete($itemId = null)
    {
        if (!$itemId) {
            return;
        }

        Customer::findOrFail($itemId)->delete();

        $this->dispatch(
            'notify',
            title: 'Xóa thành công',
            message: 'Khách hàng đã được xóa.',
            type: 'success',
            duration: 2200
        );

        $this->dispatch('refreshTable');
    }
}