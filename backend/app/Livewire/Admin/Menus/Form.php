<?php

namespace App\Livewire\Admin\Menus;

use App\Models\Menu;
use Illuminate\Validation\Rule;
use Illuminate\Support\Str;
use Livewire\Component;

class Form extends Component
{
    public bool $open = false;
    public bool $isEdit = false;

    public $menu_id = null;

    public string $entry_mode = 'module'; // module | page | action

    public string $name = '';
    public string $permission_key = '';
    public ?string $path = null;
    public ?string $icon = null;
    public $parent_id = null;
    public int $order_index = 0;
    public bool $status = true;

    public string $action_code = 'create';
    public string $custom_action_code = '';

    public bool $manualPermissionKey = false;
    public bool $manualPath = false;
    public bool $manualName = false;

    public array $moduleOptions = [];
    public array $pageOptions = [];
    public array $iconOptions = [];
    public array $actionOptions = [];

    protected $listeners = [
        'openMenuFormModal' => 'openCreate',
        'editMenu' => 'openEdit',
    ];

    public function mount()
    {
        $this->iconOptions = [
            'FiHome',
            'FiSettings',
            'FiUsers',
            'FiShoppingCart',
            'FiBox',
            'FiDollarSign',
            'FiPackage',
            'FiFileText',
            'FiDownload',
            'FiTruck',
            'FiArchive',
            'FiCreditCard',
            'FiBookOpen',
            'FiShield',
            'FiMenu',
            'FiRepeat',
        ];

        $this->actionOptions = [
            'create' => 'Tạo',
            'update' => 'Sửa',
            'delete' => 'Xóa',
            'view' => 'Xem',
            'approve' => 'Duyệt',
            'confirm' => 'Xác nhận',
            'export' => 'Xuất',
            'import' => 'Nhập',
            'submit_to_warehouse' => 'Gửi kho',
            'custom' => 'Tự nhập',
        ];

        $this->loadParentOptions();
    }

    public function render()
    {
        return view('livewire.admin.menus.form', [
            'generatedPermissionKey' => $this->suggestedPermissionKey(),
            'generatedPath' => $this->suggestedPath(),
            'previewLabel' => $this->previewLabel(),
        ]);
    }

    public function openCreate()
    {
        $this->resetForm();
        $this->isEdit = false;
        $this->loadParentOptions();
        $this->open = true;
    }

    public function openEdit($id)
    {
        $menu = Menu::findOrFail($id);

        $this->resetForm();
        $this->isEdit = true;
        $this->open = true;

        $this->menu_id = $menu->id;
        $this->name = $menu->name;
        $this->permission_key = $menu->permission_key ?? '';
        $this->path = $menu->path;
        $this->icon = $menu->icon;
        $this->parent_id = $menu->parent_id;
        $this->order_index = (int) $menu->order_index;
        $this->status = (bool) $menu->status;

        if ($menu->menu_type === 'action') {
            $this->entry_mode = 'action';
            $suffix = $this->extractActionSuffix($menu->permission_key);

            if (array_key_exists($suffix, $this->actionOptions)) {
                $this->action_code = $suffix;
            } else {
                $this->action_code = 'custom';
                $this->custom_action_code = $suffix;
            }
        } elseif ($menu->parent_id) {
            $this->entry_mode = 'page';
        } else {
            $this->entry_mode = 'module';
        }

        $this->manualPermissionKey = true;
        $this->manualPath = true;
        $this->manualName = true;

        $this->loadParentOptions();
    }

    public function close()
    {
        $this->open = false;
        $this->resetForm();
        $this->resetValidation();
    }

    public function resetForm()
    {
        $this->reset([
            'menu_id',
            'name',
            'permission_key',
            'path',
            'icon',
            'parent_id',
            'custom_action_code',
        ]);

        $this->entry_mode = 'module';
        $this->action_code = 'create';
        $this->order_index = 0;
        $this->status = true;
        $this->manualPermissionKey = false;
        $this->manualPath = false;
        $this->manualName = false;
    }

    public function updatedEntryMode()
    {
        if ($this->entry_mode === 'module') {
            $this->parent_id = null;
            $this->path = null;
            $this->action_code = 'create';
            $this->custom_action_code = '';
        }

        if ($this->entry_mode === 'page') {
            $this->path = $this->manualPath ? $this->path : $this->suggestedPath();
            $this->action_code = 'create';
            $this->custom_action_code = '';
        }

        if ($this->entry_mode === 'action') {
            $this->path = null;
            $this->icon = null;
        }

        $this->loadParentOptions();
        $this->syncGeneratedFields();
    }

    public function updatedName()
    {
        if (! $this->isEdit) {
            $this->syncGeneratedFields();
        }
    }

    public function updatedParentId()
    {
        if (! $this->manualName && $this->entry_mode === 'action') {
            $this->name = $this->suggestedActionName();
        }

        $this->syncGeneratedFields();
    }

    public function updatedActionCode()
    {
        if ($this->action_code !== 'custom') {
            $this->custom_action_code = '';
        }

        if (! $this->manualName && $this->entry_mode === 'action') {
            $this->name = $this->suggestedActionName();
        }

        $this->syncGeneratedFields();
    }

    public function updatedCustomActionCode()
    {
        if (! $this->manualName && $this->entry_mode === 'action') {
            $this->name = $this->suggestedActionName();
        }

        $this->syncGeneratedFields();
    }

    public function toggleStatus()
    {
        $this->status = ! $this->status;
    }

    public function useSuggestedPermissionKey()
    {
        $this->permission_key = $this->suggestedPermissionKey();
        $this->manualPermissionKey = false;
    }

    public function useSuggestedPath()
    {
        $this->path = $this->suggestedPath();
        $this->manualPath = false;
    }

    public function useSuggestedActionName()
    {
        if ($this->entry_mode === 'action') {
            $this->name = $this->suggestedActionName();
            $this->manualName = false;
        }
    }

    protected function syncGeneratedFields(): void
    {
        if (! $this->manualPermissionKey) {
            $this->permission_key = $this->suggestedPermissionKey();
        }

        if ($this->entry_mode === 'page' && ! $this->manualPath) {
            $this->path = $this->suggestedPath();
        }

        if ($this->entry_mode !== 'page') {
            $this->path = null;
        }

        if ($this->entry_mode === 'action' && ! $this->manualName) {
            $this->name = $this->suggestedActionName();
        }

        if ($this->entry_mode === 'action') {
            $this->icon = null;
        }
    }

    protected function suggestedPermissionKey(): string
    {
        if ($this->entry_mode === 'module') {
            $base = $this->normalizeKeyBase($this->name);
            return $base ? "{$base}.module" : '';
        }

        if ($this->entry_mode === 'page') {
            $base = $this->normalizeKeyBase($this->name);
            return $base ? "{$base}.view" : '';
        }

        if ($this->entry_mode === 'action') {
            $parent = $this->getSelectedParentMenu();
            $action = $this->resolvedActionCode();

            if (! $parent || ! $action) {
                return '';
            }

            $parentBase = $this->basePermissionFromParent($parent->permission_key);

            return $parentBase ? "{$parentBase}.{$action}" : '';
        }

        return '';
    }

    protected function suggestedPath(): ?string
    {
        if ($this->entry_mode !== 'page') {
            return null;
        }

        $base = $this->normalizePathBase($this->name);

        return $base ? "/{$base}" : null;
    }

    protected function suggestedActionName(): string
    {
        $parent = $this->getSelectedParentMenu();
        $action = $this->resolvedActionCode();

        if (! $parent || ! $action) {
            return $this->name;
        }

        $label = $this->actionOptions[$this->action_code] ?? 'Thao tác';

        if ($this->action_code === 'custom' && filled($this->custom_action_code)) {
            $label = Str::headline(str_replace('_', ' ', $this->custom_action_code));
        }

        return trim($label . ' ' . mb_strtolower($parent->name));
    }

    protected function previewLabel(): string
    {
        return match ($this->entry_mode) {
            'module' => 'Tạo module cha trên sidebar',
            'page' => 'Tạo màn hình con hiển thị trong module',
            'action' => 'Tạo quyền thao tác bên trong màn hình',
            default => '',
        };
    }

    protected function normalizeKeyBase(?string $value): string
    {
        $value = trim((string) $value);
        if ($value === '') {
            return '';
        }

        $ascii = Str::ascii($value);
        return Str::snake($ascii);
    }

    protected function normalizePathBase(?string $value): string
    {
        $value = trim((string) $value);
        if ($value === '') {
            return '';
        }

        $ascii = Str::ascii($value);
        return Str::kebab($ascii);
    }

    protected function resolvedActionCode(): string
    {
        if ($this->action_code === 'custom') {
            return $this->normalizeKeyBase($this->custom_action_code);
        }

        return $this->action_code;
    }

    protected function basePermissionFromParent(?string $permissionKey): string
    {
        if (! $permissionKey) {
            return '';
        }

        if (Str::endsWith($permissionKey, '.view')) {
            return Str::beforeLast($permissionKey, '.view');
        }

        if (Str::endsWith($permissionKey, '.module')) {
            return Str::beforeLast($permissionKey, '.module');
        }

        return Str::beforeLast($permissionKey, '.') ?: $permissionKey;
    }

    protected function extractActionSuffix(?string $permissionKey): string
    {
        if (! $permissionKey || ! str_contains($permissionKey, '.')) {
            return 'create';
        }

        return Str::afterLast($permissionKey, '.');
    }

    protected function getSelectedParentMenu(): ?Menu
    {
        if (! $this->parent_id) {
            return null;
        }

        return Menu::find($this->parent_id);
    }

    protected function loadParentOptions(): void
    {
        $moduleQuery = Menu::query()
            ->where('menu_type', 'sidebar')
            ->whereNull('parent_id')
            ->orderBy('order_index')
            ->orderBy('name');

        $pageQuery = Menu::query()
            ->where('menu_type', 'sidebar')
            ->whereNotNull('path')
            ->orderBy('order_index')
            ->orderBy('name');

        if ($this->menu_id) {
            $moduleQuery->where('id', '!=', $this->menu_id);
            $pageQuery->where('id', '!=', $this->menu_id);
        }

        $this->moduleOptions = $moduleQuery->get()->toArray();
        $this->pageOptions = $pageQuery->get()->toArray();
    }

    public function save()
    {
        $this->syncGeneratedFields();

        $validated = $this->validate($this->rules(), $this->messages());

        $payload = [
            'name' => trim($validated['name']),
            'permission_key' => trim($validated['permission_key']),
            'path' => $validated['path'] ? trim($validated['path']) : null,
            'icon' => filled($validated['icon'] ?? null) ? trim($validated['icon']) : null,
            'parent_id' => $validated['parent_id'] ?: null,
            'order_index' => (int) $validated['order_index'],
            'status' => (bool) $validated['status'],
            'menu_type' => $this->entry_mode === 'action' ? 'action' : 'sidebar',
        ];

        if ($this->entry_mode === 'module') {
            $payload['parent_id'] = null;
            $payload['path'] = null;
        }

        if ($this->entry_mode === 'action') {
            $payload['path'] = null;
            $payload['icon'] = null;
        }

        if ($this->isEdit) {
            $menu = Menu::findOrFail($this->menu_id);

            if ((int) $payload['parent_id'] === (int) $menu->id) {
                $this->addError('parent_id', 'Menu không thể là cha của chính nó.');
                return;
            }

            $menu->update($payload);

            $this->dispatch(
                'notify',
                title: 'Cập nhật thành công',
                message: 'Thông tin menu đã được cập nhật.',
                type: 'success',
                duration: 2200
            );
        } else {
            Menu::create($payload);

            $this->dispatch(
                'notify',
                title: 'Tạo menu thành công',
                message: 'Menu mới đã được thêm vào hệ thống.',
                type: 'success',
                duration: 2200
            );
        }

        $this->dispatch('refreshTable');
        $this->close();
    }

    protected function rules(): array
    {
        $pathRules = ['nullable', 'string', 'max:255'];

        if ($this->entry_mode === 'page') {
            $pathRules = [
                'required',
                'string',
                'max:255',
                Rule::unique('menus', 'path')->ignore($this->menu_id),
            ];
        }

        return [
            'entry_mode' => ['required', Rule::in(['module', 'page', 'action'])],
            'name' => ['required', 'string', 'min:2', 'max:255'],
            'permission_key' => [
                'required',
                'string',
                'max:255',
                Rule::unique('menus', 'permission_key')->ignore($this->menu_id),
            ],
            'path' => $pathRules,
            'icon' => ['nullable', 'string', 'max:100'],
            'parent_id' => [
                Rule::requiredIf(in_array($this->entry_mode, ['page', 'action'], true)),
                'nullable',
                'exists:menus,id',
            ],
            'order_index' => ['required', 'integer', 'min:0'],
            'status' => ['required', 'boolean'],
        ];
    }

    protected function messages(): array
    {
        return [
            'entry_mode.required' => 'Vui lòng chọn kiểu tạo.',
            'entry_mode.in' => 'Kiểu tạo không hợp lệ.',
            'name.required' => 'Vui lòng nhập tên hiển thị.',
            'name.min' => 'Tên phải từ 2 ký tự trở lên.',
            'permission_key.required' => 'Permission key chưa được tạo.',
            'permission_key.unique' => 'Permission key đã tồn tại.',
            'path.required' => 'Path là bắt buộc với page.',
            'path.unique' => 'Path đã tồn tại.',
            'parent_id.required' => 'Vui lòng chọn menu cha.',
            'parent_id.exists' => 'Menu cha không hợp lệ.',
            'order_index.required' => 'Vui lòng nhập thứ tự hiển thị.',
            'order_index.integer' => 'Thứ tự hiển thị phải là số nguyên.',
        ];
    }
}