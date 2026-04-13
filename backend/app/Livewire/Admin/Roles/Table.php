<?php

namespace App\Livewire\Admin\Roles;

use App\Models\Role;
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
        'rolesDeleteConfirmed' => 'delete',
    ];

    protected $paginationTheme = 'tailwind';

    public function mount()
    {
        $this->q = request('q', '');
    }

    public function render()
    {
        $roles = Role::query()
            ->withCount('users')
            ->when($this->q, function ($query) {
                $query->where(function ($sub) {
                    $sub->where('role_code', 'like', '%' . $this->q . '%')
                        ->orWhere('name', 'like', '%' . $this->q . '%')
                        ->orWhere('description', 'like', '%' . $this->q . '%');
                });
            })
            ->orderBy($this->sortField, $this->sortDirection)
            ->paginate($this->perPage);

        return view('livewire.admin.roles.table', [
            'roles' => $roles,
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
        $this->dispatch('editRole', id: $id);
    }

    public function confirmDelete($id)
    {
        $role = Role::withCount('users')->findOrFail($id);

        if ($role->role_code === 'ADMIN') {
            $this->dispatch(
                'notify',
                title: 'Không thể xóa',
                message: 'Không được xóa vai trò ADMIN.',
                type: 'warning',
                duration: 2200
            );
            return;
        }

        if ($role->users_count > 0) {
            $this->dispatch(
                'notify',
                title: 'Không thể xóa',
                message: 'Vai trò này đang được gán cho người dùng, không thể xóa.',
                type: 'warning',
                duration: 2200
            );
            return;
        }

        $this->dispatch('openDeleteModal', itemId: $id, targetEvent: 'rolesDeleteConfirmed');
    }

    public function delete($itemId)
    {
        $role = Role::withCount('users')->findOrFail($itemId);

        if ($role->role_code === 'ADMIN') {
            $this->dispatch(
                'notify',
                title: 'Không thể xóa',
                message: 'Không được xóa vai trò ADMIN.',
                type: 'warning',
                duration: 2200
            );
            return;
        }

        if ($role->users_count > 0) {
            $this->dispatch(
                'notify',
                title: 'Không thể xóa',
                message: 'Vai trò này đang được gán cho người dùng, không thể xóa.',
                type: 'warning',
                duration: 2200
            );
            return;
        }

        $role->delete();

        $this->dispatch(
            'notify',
            title: 'Xóa thành công',
            message: 'Vai trò đã được xóa.',
            type: 'success',
            duration: 2200
        );

        $this->dispatch('refreshTable');
    }
}