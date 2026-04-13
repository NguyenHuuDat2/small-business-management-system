<?php

namespace App\Http\Controllers\Api\Hr;

use App\Http\Controllers\Controller;
use App\Http\Requests\Hr\StoreEmployeeRequest;
use App\Http\Requests\Hr\UpdateEmployeeRequest;
use App\Models\Department;
use App\Models\Employee;
use Illuminate\Http\Request;

class EmployeeController extends Controller
{
    public function index(Request $request)
    {
        $search = trim((string) $request->query('search', ''));
        $departmentId = $request->query('department_id');
        $status = $request->query('status');
        $perPage = (int) $request->query('per_page', 10);
        $perPage = max(1, min($perPage, 100));

        $query = Employee::query()
            ->with(['department:id,name'])
            ->select([
                'id',
                'employee_code',
                'name',
                'department_id',
                'salary',
                'phone',
                'status',
            ])
            ->when($search !== '', function ($q) use ($search) {
                $q->where(function ($subQuery) use ($search) {
                    $subQuery->where('employee_code', 'like', "%{$search}%")
                        ->orWhere('name', 'like', "%{$search}%")
                        ->orWhere('phone', 'like', "%{$search}%");
                });
            })
            ->when($departmentId !== null && $departmentId !== '', function ($q) use ($departmentId) {
                $q->where('department_id', $departmentId);
            })
            ->when($status !== null && $status !== '', function ($q) use ($status) {
                if (in_array($status, ['1', 1, true, 'true'], true)) {
                    $q->where('status', true);
                }

                if (in_array($status, ['0', 0, false, 'false'], true)) {
                    $q->where('status', false);
                }
            })
            ->orderBy('employee_code');

        $employees = $query->paginate($perPage)->appends($request->query());

        $employees->getCollection()->transform(fn ($employee) => $this->transformEmployee($employee));

        return response()->json([
            'success' => true,
            'message' => 'Lấy danh sách nhân viên thành công',
            'data' => $employees->items(),
            'meta' => [
                'current_page' => $employees->currentPage(),
                'last_page' => $employees->lastPage(),
                'per_page' => $employees->perPage(),
                'total' => $employees->total(),
            ],
        ]);
    }

    public function store(StoreEmployeeRequest $request)
    {
        $employee = Employee::create($request->validated());
        $employee->load('department:id,name');

        return response()->json([
            'success' => true,
            'message' => 'Tạo nhân viên thành công',
            'data' => $this->transformEmployee($employee),
        ], 201);
    }

    public function show(Employee $employee)
    {
        $employee->load('department:id,name');

        return response()->json([
            'success' => true,
            'message' => 'Lấy chi tiết nhân viên thành công',
            'data' => $this->transformEmployee($employee),
        ]);
    }

    public function update(UpdateEmployeeRequest $request, Employee $employee)
    {
        $employee->update($request->validated());
        $employee->load('department:id,name');

        return response()->json([
            'success' => true,
            'message' => 'Cập nhật nhân viên thành công',
            'data' => $this->transformEmployee($employee),
        ]);
    }

    public function destroy(Employee $employee)
    {
        if ($employee->user()->exists()) {
            return response()->json([
                'success' => false,
                'message' => 'Không thể xóa nhân viên đang liên kết với tài khoản người dùng',
            ], 422);
        }

        $employee->delete();

        return response()->json([
            'success' => true,
            'message' => 'Xóa nhân viên thành công',
        ]);
    }

    public function departmentOptions()
    {
        $departments = Department::query()
            ->select(['id', 'name'])
            ->orderBy('name')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $departments,
        ]);
    }

    private function transformEmployee(Employee $employee): array
    {
        return [
            'id' => $employee->id,
            'employee_code' => $employee->employee_code,
            'name' => $employee->name,
            'phone' => $employee->phone,
            'salary' => $employee->salary,
            'status' => (bool) $employee->status,
            'department_id' => $employee->department_id,
            'department_name' => $employee->department?->name,
            'department' => $employee->department
                ? [
                    'id' => $employee->department->id,
                    'name' => $employee->department->name,
                ]
                : null,
        ];
    }
}