<?php

namespace App\Livewire\Admin\RolePermissions;

use App\Models\Menu;
use App\Models\Role;
use Livewire\Component;
use Livewire\Attributes\Layout;

#[Layout('layouts.admin')]
class Index extends Component
{
    public $selectedRoleId = null;
    public array $selectedMenuIds = [];

    public function mount()
    {
        // Load tất cả các role ngoại trừ ADMIN
        $this->selectedRoleId = request('role');

        if (! $this->selectedRoleId) {
            $this->selectedRoleId = Role::where('role_code', '!=', 'ADMIN')->orderBy('name')->value('id');
        }

        $this->loadSelectedPermissions();
    }

    public function updatedSelectedRoleId()
    {
        $this->loadSelectedPermissions();
    }

    public function render()
    {
        $roles = Role::where('role_code', '!=', 'ADMIN')->orderBy('name')->get(); // Loại bỏ ADMIN khỏi danh sách role

        $currentRole = $roles->firstWhere('id', (int) $this->selectedRoleId);

        $menus = $this->getMenuCollection();
        $menuTree = $this->buildTree($menus);

        return view('livewire.admin.role-permissions.index', [
            'roles' => $roles,
            'currentRole' => $currentRole,
            'menuTree' => $menuTree,
            'totalMenus' => $menus->count(),
            'selectedCount' => count($this->selectedMenuIds),
        ]);
    }

    public function save()
    {
        $this->validate([
            'selectedRoleId' => ['required', 'exists:roles,id'],
        ], [
            'selectedRoleId.required' => 'Vui lòng chọn vai trò.',
            'selectedRoleId.exists' => 'Vai trò không hợp lệ.',
        ]);

        $role = Role::findOrFail($this->selectedRoleId);

        $ids = collect($this->selectedMenuIds)
            ->filter()
            ->map(fn ($id) => (int) $id)
            ->unique()
            ->values()
            ->all();

        $role->menus()->sync($ids);

        $this->dispatch(
            'notify',
            title: 'Lưu phân quyền thành công',
            message: "Phân quyền cho vai trò {$role->name} đã được cập nhật.",
            type: 'success',
            duration: 2200
        );
    }

    public function selectAll()
    {
        $this->selectedMenuIds = Menu::pluck('id')
            ->map(fn ($id) => (string) $id)
            ->toArray();
    }

    public function clearAll()
    {
        $this->selectedMenuIds = [];
    }

    public function addBranch($menuId)
    {
        $branchIds = $this->getBranchIds((int) $menuId);

        $this->selectedMenuIds = collect([
            ...$this->selectedMenuIds,
            ...array_map(fn ($id) => (string) $id, $branchIds),
        ])
            ->unique()
            ->values()
            ->all();
    }

    public function removeBranch($menuId)
    {
        $branchIds = $this->getBranchIds((int) $menuId);

        $this->selectedMenuIds = collect($this->selectedMenuIds)
            ->reject(fn ($id) => in_array((int) $id, $branchIds, true))
            ->values()
            ->all();
    }

    protected function loadSelectedPermissions(): void
    {
        if (! $this->selectedRoleId) {
            $this->selectedMenuIds = [];
            return;
        }

        $this->selectedMenuIds = Role::find($this->selectedRoleId)?->menus()
            ->pluck('menus.id')
            ->map(fn ($id) => (string) $id)
            ->toArray() ?? [];
    }

    protected function getMenuCollection()
    {
        return Menu::query()
            ->select([
                'id',
                'name',
                'path',
                'icon',
                'parent_id',
                'order_index',
                'status',
                'permission_key',
                'menu_type',
            ])
            ->orderBy('order_index')
            ->orderBy('id')
            ->get();
    }

    protected function buildTree($menus, $parentId = null): array
    {
        return $menus
            ->where('parent_id', $parentId)
            ->sortBy('order_index')
            ->values()
            ->map(function ($menu) use ($menus) {
                $children = $this->buildTree($menus, $menu->id);

                return [
                    'id' => $menu->id,
                    'name' => $menu->name,
                    'path' => $menu->path,
                    'icon' => $menu->icon,
                    'parent_id' => $menu->parent_id,
                    'order_index' => $menu->order_index,
                    'status' => (bool) $menu->status,
                    'permission_key' => $menu->permission_key,
                    'menu_type' => $menu->menu_type,
                    'children' => $children,
                ];
            })
            ->toArray();
    }

    protected function getBranchIds(int $rootId): array
    {
        $menus = $this->getMenuCollection();

        return $this->collectBranchIds($menus, $rootId);
    }

    protected function collectBranchIds($menus, int $parentId): array
    {
        $ids = [$parentId];

        foreach ($menus->where('parent_id', $parentId) as $child) {
            $ids = array_merge($ids, $this->collectBranchIds($menus, $child->id));
        }

        return array_values(array_unique($ids));
    }
}