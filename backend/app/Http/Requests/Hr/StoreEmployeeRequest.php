<?php

namespace App\Http\Requests\Hr;

use Illuminate\Foundation\Http\FormRequest;

class StoreEmployeeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'employee_code' => ['required', 'string', 'max:50', 'unique:employees,employee_code'],
            'name' => ['required', 'string', 'max:255'],
            'department_id' => ['nullable', 'exists:departments,id'],
            'salary' => ['nullable', 'numeric', 'min:0'],
            'phone' => ['nullable', 'string', 'max:20'],
            'status' => ['required', 'boolean'],
        ];
    }

    public function messages(): array
    {
        return [
            'employee_code.required' => 'Vui lòng nhập mã nhân viên',
            'employee_code.unique' => 'Mã nhân viên đã tồn tại',
            'name.required' => 'Vui lòng nhập tên nhân viên',
            'department_id.exists' => 'Phòng ban không hợp lệ',
            'salary.numeric' => 'Lương phải là số',
            'status.required' => 'Vui lòng chọn trạng thái',
        ];
    }
}