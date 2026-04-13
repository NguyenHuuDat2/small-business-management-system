<?php

namespace App\Livewire\Admin\Employees;

use App\Models\Employee;
use App\Models\Department;
use App\Models\Role;
use Livewire\Component;

class Form extends Component
{
    public bool $open = false;
    public bool $isEdit = false;
    public $employee_id;
    public $name;
    public $employee_code;
    public $phone;
    public $department_id;
    public $role_id;
    public $status = 1;

    public $departmentOptions = [];
    public $roleOptions = [];

    protected $listeners = [
        'openEmployeeFormModal' => 'openCreate',
        'editEmployee' => 'openEdit',
    ];

    public function mount()
    {
        $this->departmentOptions = Department::all();
        $this->roleOptions = Role::all();
    }

    public function render()
    {
        return view('livewire.admin.employees.form');
    }

    public function openCreate()
    {
        $this->resetForm();
        $this->isEdit = false;
        $this->open = true;
    }

    public function openEdit($id)
    {
        $employee = Employee::findOrFail($id);

        $this->resetForm();
        $this->isEdit = true;
        $this->open = true;

        $this->employee_id = $employee->id;
        $this->name = $employee->name;
        $this->employee_code = $employee->employee_code;
        $this->phone = $employee->phone;
        $this->department_id = $employee->department_id;
        $this->role_id = $employee->role_id;
        $this->status = $employee->status;
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
            'employee_id',
            'name',
            'employee_code',
            'phone',
            'department_id',
            'role_id',
            'status',
        ]);
    }

    public function save()
    {
        $validated = $this->validate([
            'name' => 'required|string|max:255',
            'employee_code' => 'required|string|max:50|unique:employees,employee_code,' . $this->employee_id,
            'phone' => 'nullable|string|max:20',
            'department_id' => 'nullable|exists:departments,id',
            'role_id' => 'required|exists:roles,id',
            'status' => 'boolean',
        ]);

        $employeeData = [
            'name' => $validated['name'],
            'employee_code' => $validated['employee_code'],
            'phone' => $validated['phone'],
            'department_id' => $validated['department_id'],
            'role_id' => $validated['role_id'],
            'status' => $validated['status'] ?? 1,
        ];

        if ($this->isEdit) {
            $employee = Employee::findOrFail($this->employee_id);
            $employee->update($employeeData);

            $this->dispatch('notify', 'Cập nhật thành công', 'Nhân viên đã được cập nhật.', 'success');
        } else {
            Employee::create($employeeData);
            $this->dispatch('notify', 'Tạo thành công', 'Nhân viên đã được thêm vào hệ thống.', 'success');
        }

        $this->dispatch('refreshTable');
        $this->close();
    }
}