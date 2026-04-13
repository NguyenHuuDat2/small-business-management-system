<?php

namespace App\Livewire\Admin\Departments;

use App\Models\Department;
use Livewire\Component;
use Illuminate\Validation\Rule;

class Form extends Component
{
    public bool $open = false;
    public bool $isEdit = false;

    public $department_id = null;
    public string $name = '';
    public ?string $description = null;

    protected $listeners = [
        'openDepartmentFormModal' => 'openCreate',
        'editDepartment' => 'openEdit',
    ];

    public function render()
    {
        return view('livewire.admin.departments.form');
    }

    public function openCreate()
    {
        $this->resetForm();
        $this->isEdit = false;
        $this->open = true;
    }

    public function openEdit($id)
    {
        $department = Department::findOrFail($id);

        $this->resetForm();
        $this->isEdit = true;
        $this->open = true;

        $this->department_id = $department->id;
        $this->name = $department->name;
        $this->description = $department->description;
    }

    public function close()
    {
        $this->open = false;
        $this->resetForm();
        $this->resetValidation();
    }

    protected function resetForm(): void
    {
        $this->reset([
            'department_id',
            'name',
            'description',
        ]);
    }

    public function save()
    {
        $validated = $this->validate([
            'name' => [
                'required',
                'string',
                'min:2',
                'max:255',
                Rule::unique('departments', 'name')->ignore($this->department_id),
            ],
            'description' => [
                'nullable',
                'string',
                'max:1000',
            ],
        ], [
            'name.required' => 'Vui lòng nhập tên phòng ban.',
            'name.min' => 'Tên phòng ban phải từ 2 ký tự trở lên.',
            'name.unique' => 'Tên phòng ban đã tồn tại.',
            'description.max' => 'Mô tả quá dài.',
        ]);

        $payload = [
            'name' => trim($validated['name']),
            'description' => filled($validated['description'] ?? null)
                ? trim($validated['description'])
                : null,
        ];

        if ($this->isEdit) {
            $department = Department::findOrFail($this->department_id);
            $department->update($payload);

            $this->dispatch(
                'notify',
                title: 'Cập nhật thành công',
                message: 'Phòng ban đã được cập nhật.',
                type: 'success',
                duration: 2200
            );
        } else {
            Department::create($payload);

            $this->dispatch(
                'notify',
                title: 'Tạo phòng ban thành công',
                message: 'Phòng ban mới đã được thêm vào hệ thống.',
                type: 'success',
                duration: 2200
            );
        }

        $this->dispatch('refreshTable');
        $this->close();
    }
}