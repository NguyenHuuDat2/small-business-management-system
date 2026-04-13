<?php

namespace App\Livewire\Admin\Employees;

use App\Models\Employee;
use Livewire\Component;
use Livewire\WithPagination;

class Table extends Component
{
    use WithPagination;

    public $search = '';
    public $perPage = 10;

    protected $listeners = [
        'refreshTable' => '$refresh',
    ];

    public function render()
    {
        $employees = Employee::query()
            ->where('name', 'like', '%' . $this->search . '%')
            ->orWhere('employee_code', 'like', '%' . $this->search . '%')
            ->paginate($this->perPage);

        return view('livewire.admin.employees.table', compact('employees'));
    }

    public function updatedPerPage()
    {
        $this->resetPage();
    }
}