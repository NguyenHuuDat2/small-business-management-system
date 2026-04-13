<?php

namespace App\Livewire\Admin\Roles;

use App\Models\Role;
use Illuminate\Validation\Rule;
use Livewire\Component;

class Form extends Component
{
    public bool $open = false;
    public bool $isEdit = false;
    public bool $editingProtected = false;

    public $role_id;
    public $role_code;
    public $name;
    public $description;

    protected $listeners = [
        'openRoleFormModal' => 'openCreate',
        'editRole' => 'openEdit',
    ];

    public function render()
    {
        return view('livewire.admin.roles.form');
    }

    public function openCreate()
    {
        $this->resetForm();
        $this->isEdit = false;
        $this->editingProtected = false;
        $this->open = true;
    }

    public function openEdit($id)
    {
        $role = Role::findOrFail($id);

        $this->resetForm();
        $this->isEdit = true;
        $this->open = true;

        $this->role_id = $role->id;
        $this->role_code = $role->role_code;
        $this->name = $role->name;
        $this->description = $role->description;
        $this->editingProtected = $role->role_code === 'ADMIN';
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
            'role_id',
            'role_code',
            'name',
            'description',
        ]);

        $this->editingProtected = false;
    }

    public function save()
    {
        $validated = $this->validate($this->rules(), $this->messages());

        $roleCode = strtoupper(trim($validated['role_code']));

        if ($this->editingProtected && $roleCode !== 'ADMIN') {
            $this->addError('role_code', 'Không được thay đổi mã của vai trò ADMIN.');
            return;
        }

        $payload = [
            'role_code' => $roleCode,
            'name' => trim($validated['name']),
            'description' => filled($validated['description'] ?? null)
                ? trim($validated['description'])
                : null,
        ];

        if ($this->isEdit) {
            $role = Role::findOrFail($this->role_id);
            $role->update($payload);

            $this->dispatch(
                'notify',
                title: 'Cập nhật thành công',
                message: 'Thông tin vai trò đã được cập nhật.',
                type: 'success',
                duration: 2200
            );
        } else {
            Role::create($payload);

            $this->dispatch(
                'notify',
                title: 'Tạo vai trò thành công',
                message: 'Vai trò mới đã được thêm vào hệ thống.',
                type: 'success',
                duration: 2200
            );
        }

        $this->dispatch('refreshTable');
        $this->close();
    }

    protected function rules(): array
    {
        return [
            'role_code' => [
                'required',
                'string',
                'max:50',
                'regex:/^[A-Z0-9_]+$/',
                Rule::unique('roles', 'role_code')->ignore($this->role_id),
            ],
            'name' => [
                'required',
                'string',
                'min:2',
                'max:255',
            ],
            'description' => [
                'nullable',
                'string',
                'max:1000',
            ],
        ];
    }

    protected function messages(): array
    {
        return [
            'role_code.required' => 'Vui lòng nhập mã vai trò.',
            'role_code.regex' => 'Mã vai trò chỉ được dùng chữ in hoa, số và dấu gạch dưới.',
            'role_code.unique' => 'Mã vai trò đã tồn tại.',
            'name.required' => 'Vui lòng nhập tên vai trò.',
            'name.min' => 'Tên vai trò phải từ 2 ký tự trở lên.',
            'description.max' => 'Mô tả quá dài.',
        ];
    }
}