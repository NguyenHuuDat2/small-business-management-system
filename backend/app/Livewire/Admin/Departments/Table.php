<?php

namespace App\Livewire\Admin\Departments;

use App\Models\Department;
use Livewire\Component;
use Livewire\WithPagination;
use Livewire\WithoutUrlPagination;

class Table extends Component
{
    use WithPagination, WithoutUrlPagination;

    public $sortField = 'id';
    public $sortDirection = 'asc';
    public $perPage = 10;
    public $q = '';

    protected $listeners = [
        'refreshTable' => '$refresh',
        'departmentsDeleteConfirmed' => 'delete',
    ];

    protected $paginationTheme = 'tailwind';

    public function mount()
    {
        $this->q = request('q', '');
    }

    public function render()
    {
        $departments = Department::query()
            ->withCount('employees')
            ->when($this->q, function ($query) {
                $query->where(function ($sub) {
                    $sub->where('name', 'like', '%' . $this->q . '%')
                        ->orWhere('description', 'like', '%' . $this->q . '%');
                });
            })
            ->orderBy($this->sortField, $this->sortDirection)
            ->paginate($this->perPage);

        return view('livewire.admin.departments.table', [
            'departments' => $departments,
        ]);
    }

    public function updatedPerPage()
    {
        $this->resetPage();
    }

    public function sortBy($field)
    {
        if ($this->sortField === $field) {
            $this->sortDirection = $this->sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            $this->sortField = $field;
            $this->sortDirection = 'asc';
        }

        $this->resetPage();
    }

    public function edit($id)
    {
        $this->dispatch('editDepartment', id: $id);
    }

    public function confirmDelete($id)
    {
        $department = Department::withCount('employees')->findOrFail($id);

        if ($department->employees_count > 0) {
            $this->dispatch(
                'notify',
                title: 'Không thể xóa',
                message: 'Phòng ban đang có nhân viên, không thể xóa.',
                type: 'warning',
                duration: 2200
            );
            return;
        }

        $this->dispatch('openDeleteModal', itemId: $id, targetEvent: 'departmentsDeleteConfirmed');
    }

    public function delete($itemId)
    {
        $department = Department::withCount('employees')->findOrFail($itemId);

        if ($department->employees_count > 0) {
            $this->dispatch(
                'notify',
                title: 'Không thể xóa',
                message: 'Phòng ban đang có nhân viên, không thể xóa.',
                type: 'warning',
                duration: 2200
            );
            return;
        }

        $department->delete();

        $this->dispatch(
            'notify',
            title: 'Xóa thành công',
            message: 'Phòng ban đã được xóa.',
            type: 'success',
            duration: 2200
        );

        $this->dispatch('refreshTable');
    }
}