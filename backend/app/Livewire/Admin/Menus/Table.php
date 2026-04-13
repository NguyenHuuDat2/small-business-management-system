<?php

namespace App\Livewire\Admin\Menus;

use App\Models\Menu;
use Livewire\Component;
use Livewire\WithPagination;
use Livewire\WithoutUrlPagination;

class Table extends Component
{
    use WithPagination, WithoutUrlPagination;

    public $sortField = 'order_index';
    public $sortDirection = 'asc';
    public $perPage = 10;
    public $q = '';

    protected $listeners = [
        'refreshTable' => '$refresh',
        'menusDeleteConfirmed' => 'delete',
    ];

    protected $paginationTheme = 'tailwind';

    public function mount()
    {
        $this->q = request('q', '');
    }

    public function render()
    {
        $menus = Menu::query()
            ->with(['parent:id,name'])
            ->withCount(['children', 'roles'])
            ->when($this->q, function ($query) {
                $query->where(function ($sub) {
                    $sub->where('name', 'like', '%' . $this->q . '%')
                        ->orWhere('permission_key', 'like', '%' . $this->q . '%')
                        ->orWhere('path', 'like', '%' . $this->q . '%')
                        ->orWhere('icon', 'like', '%' . $this->q . '%');
                });
            })
            ->orderBy($this->sortField, $this->sortDirection)
            ->paginate($this->perPage);

        return view('livewire.admin.menus.table', [
            'menus' => $menus,
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
        $this->dispatch('editMenu', id: $id);
    }

    public function confirmDelete($id)
    {
        $menu = Menu::withCount(['children', 'roles'])->findOrFail($id);

        if ($menu->children_count > 0) {
            $this->dispatch(
                'notify',
                title: 'Không thể xóa',
                message: 'Menu này đang có menu con, vui lòng xóa menu con trước.',
                type: 'warning',
                duration: 2200
            );
            return;
        }

        if ($menu->roles_count > 0) {
            $this->dispatch(
                'notify',
                title: 'Không thể xóa',
                message: 'Menu này đang được gán quyền cho vai trò, vui lòng gỡ quyền trước.',
                type: 'warning',
                duration: 2200
            );
            return;
        }

        $this->dispatch('openDeleteModal', itemId: $id, targetEvent: 'menusDeleteConfirmed');
    }

    public function delete($itemId)
    {
        $menu = Menu::withCount(['children', 'roles'])->findOrFail($itemId);

        if ($menu->children_count > 0 || $menu->roles_count > 0) {
            $this->dispatch(
                'notify',
                title: 'Không thể xóa',
                message: 'Menu còn dữ liệu liên quan, không thể xóa.',
                type: 'warning',
                duration: 2200
            );
            return;
        }

        $menu->delete();

        $this->dispatch(
            'notify',
            title: 'Xóa thành công',
            message: 'Menu đã được xóa.',
            type: 'success',
            duration: 2200
        );

        $this->dispatch('refreshTable');
    }
}