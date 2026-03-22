<?php

namespace App\Livewire\Admin\Users;

use App\Mail\SendAccountMail;
use App\Models\Employee;
use App\Models\Role;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Livewire\Component;

class Form extends Component
{
    public bool $open = false;
    public bool $isEdit = false;

    public $user_id;
    public $employee_id;
    public $role_id;
    public $email;
    public $status = 1;
    public $name;
    public $phone;
    public $admin_creation_password;
    public bool $editingAdmin = false;

    public $roles = [];

    protected $listeners = [
        'openUserFormModal' => 'openCreate',
        'editUser' => 'openEdit',
    ];

    public function mount()
    {
        $this->roles = Role::orderBy('name')->get();
    }

    public function render()
    {
        return view('livewire.admin.users.form');
    }

    public function openCreate()
    {
        $this->resetForm();
        $this->isEdit = false;
        $this->open = true;
    }

    public function openEdit($id)
    {
        $user = User::with('employee', 'role')->findOrFail($id);

        $this->resetForm();
        $this->isEdit = true;
        $this->open = true;

        $this->user_id = $user->id;
        $this->employee_id = $user->employee_id;
        $this->role_id = $user->role_id;
        $this->email = $user->email;
        $this->status = (int) $user->status;
        $this->name = $user->employee?->name ?? $user->name;
        $this->phone = $user->employee?->phone ?? $user->phone;
        $this->editingAdmin = $user->role && $user->role->role_code === 'ADMIN';
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
            'user_id',
            'employee_id',
            'role_id',
            'email',
            'name',
            'phone',
            'admin_creation_password',
        ]);

        $this->status = 1;
        $this->editingAdmin = false;
    }

    public function save()
    {
        $validated = $this->validate($this->rules(), $this->messages());

        if ($this->requiresAdminSecret()) {
            $secret = env('ADMIN_CREATION_SECRET');

            if (blank($secret) || $this->admin_creation_password !== $secret) {
                $this->addError('admin_creation_password', 'Mã xác nhận Admin không đúng.');
                return;
            }
        }

        if (! $this->isEdit) {
            $plainPassword = Str::upper(Str::random(8));

            /** @var \App\Models\User $user */
            $user = DB::transaction(function () use ($validated, $plainPassword): User {
                $employee = Employee::create([
                    'name' => $validated['name'],
                    'phone' => $validated['phone'],
                ]);

                $data = [
                    'employee_id' => $employee->id,
                    'role_id' => $validated['role_id'],
                    'email' => $validated['email'],
                    'password' => bcrypt($plainPassword),
                    'status' => (int) $validated['status'],
                    'name' => $validated['name'],
                    'phone' => $validated['phone'],
                ];

                if (Schema::hasColumn('users', 'must_change_password')) {
                    $data['must_change_password'] = 1;
                }

                return User::create($data);
            });

            $user = User::with('employee')->findOrFail($user->id);

            try {
                Mail::to($user->email)->send(new SendAccountMail($user, $plainPassword, $user->role->role_code));

                $this->dispatch(
                    'notify',
                    title: 'Tạo tài khoản thành công',
                    message: 'Mật khẩu tạm đã được gửi qua email.',
                    type: 'success',
                    duration: 2200
                );
            } catch (\Throwable $e) {
                report($e);

                $this->dispatch(
                    'notify',
                    title: 'Tạo tài khoản thành công',
                    message: 'Tài khoản đã tạo nhưng gửi email thất bại. Kiểm tra cấu hình mail.',
                    type: 'warning',
                    duration: 3000
                );
            }
        } else {
            DB::transaction(function () use ($validated): void {
                $user = User::findOrFail($this->user_id);

                if ($user->employee_id) {
                    $employee = Employee::find($user->employee_id);

                    if ($employee) {
                        $employee->update([
                            'name' => $validated['name'],
                            'phone' => $validated['phone'],
                        ]);
                    }
                } else {
                    $employee = Employee::create([
                        'name' => $validated['name'],
                        'phone' => $validated['phone'],
                    ]);

                    $user->employee_id = $employee->id;
                }

                $user->update([
                    'employee_id' => $user->employee_id,
                    'role_id' => $validated['role_id'],
                    'email' => $validated['email'],
                    'status' => (int) $validated['status'],
                    'name' => $validated['name'],
                    'phone' => $validated['phone'],
                ]);
            });

            $this->dispatch(
                'notify',
                title: 'Cập nhật thành công',
                message: 'Thông tin tài khoản đã được cập nhật.',
                type: 'success',
                duration: 2200
            );
        }

        $this->dispatch('refreshTable');
        $this->close();
    }

    protected function rules(): array
    {
        $rules = [
            'role_id' => ['required', 'exists:roles,id'],
            'name' => ['required', 'string', 'min:2'],
            'phone' => ['required', 'string', 'max:20'],
            'email' => [
                'required',
                'email',
                Rule::unique('users', 'email')->ignore($this->user_id),
            ],
            'status' => ['required', 'in:0,1'],
        ];

        if ($this->requiresAdminSecret()) {
            $rules['admin_creation_password'] = ['required', 'string'];
        }

        return $rules;
    }

    protected function messages(): array
    {
        return [
            'role_id.required' => 'Vui lòng chọn role.',
            'role_id.exists' => 'Role không hợp lệ.',
            'name.required' => 'Vui lòng nhập tên.',
            'name.min' => 'Tên phải từ 2 ký tự trở lên.',
            'phone.required' => 'Vui lòng nhập số điện thoại.',
            'email.required' => 'Vui lòng nhập email.',
            'email.email' => 'Email không đúng định dạng.',
            'email.unique' => 'Email đã tồn tại.',
            'status.required' => 'Vui lòng chọn trạng thái.',
            'status.in' => 'Trạng thái không hợp lệ.',
            'admin_creation_password.required' => 'Vui lòng nhập mã xác nhận Admin.',
        ];
    }

    protected function isAdminRoleSelected(): bool
    {
        if (! $this->role_id) {
            return false;
        }

        $role = collect($this->roles)->firstWhere('id', $this->role_id);

        return $role && $role->role_code === 'ADMIN';
    }

    protected function requiresAdminSecret(): bool
    {
        if ($this->isAdminRoleSelected()) {
            return true;
        }

        if ($this->isEdit && $this->editingAdmin) {
            return true;
        }

        return false;
    }
}