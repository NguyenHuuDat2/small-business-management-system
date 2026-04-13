<?php

namespace App\Http\Controllers\Api\Hr;

use App\Http\Controllers\Controller;
use App\Models\Employee;

class DashboardController extends Controller
{
    public function index()
    {
        $totalEmployees = Employee::count();
        $activeEmployees = Employee::where('status', true)->count();
        $inactiveEmployees = Employee::where('status', false)->count();
        $averageSalary = (float) (Employee::avg('salary') ?? 0);
        $totalPayroll = (float) (Employee::sum('salary') ?? 0);

        $byDepartment = Employee::query()
            ->leftJoin('departments', 'employees.department_id', '=', 'departments.id')
            ->selectRaw('COALESCE(departments.id, 0) as department_id')
            ->selectRaw("COALESCE(departments.name, 'Chưa phân phòng ban') as department_name")
            ->selectRaw('COUNT(employees.id) as total')
            ->selectRaw('SUM(CASE WHEN employees.status = 1 THEN 1 ELSE 0 END) as active')
            ->selectRaw('SUM(CASE WHEN employees.status = 0 THEN 1 ELSE 0 END) as inactive')
            ->groupBy('departments.id', 'departments.name')
            ->orderByDesc('total')
            ->get()
            ->map(function ($item) {
                return [
                    'department_id' => (int) $item->department_id,
                    'department_name' => $item->department_name,
                    'total' => (int) $item->total,
                    'active' => (int) $item->active,
                    'inactive' => (int) $item->inactive,
                ];
            })
            ->values();

        $recentEmployees = Employee::query()
            ->with(['department:id,name'])
            ->select([
                'id',
                'employee_code',
                'name',
                'department_id',
                'phone',
                'salary',
                'status',
                'created_at',
            ])
            ->latest('id')
            ->limit(5)
            ->get()
            ->map(function ($employee) {
                return [
                    'id' => $employee->id,
                    'employee_code' => $employee->employee_code,
                    'name' => $employee->name,
                    'phone' => $employee->phone,
                    'salary' => $employee->salary,
                    'status' => (bool) $employee->status,
                    'department_name' => $employee->department?->name,
                    'created_at' => optional($employee->created_at)->toDateTimeString(),
                ];
            })
            ->values();

        return response()->json([
            'success' => true,
            'message' => 'Lấy dữ liệu dashboard nhân sự thành công',
            'data' => [
                'overview' => [
                    'total_employees' => $totalEmployees,
                    'active_employees' => $activeEmployees,
                    'inactive_employees' => $inactiveEmployees,
                    'average_salary' => $averageSalary,
                    'total_payroll' => $totalPayroll,
                ],
                'by_department' => $byDepartment,
                'recent_employees' => $recentEmployees,
            ],
        ]);
    }
}