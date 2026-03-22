<?php

namespace App\Http\Controllers\Api;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use App\Mail\SendAccountMail;

class UserController extends BaseController
{
    public function __construct()
    {
        $this->model = User::class;
        $this->select = ['id', 'name', 'email', 'phone'];
    }

    private function reactUser(User $user): array
    {
        return [
            'id'    => $user->id,
            'name'  => $user->employee?->name ?? $user->name,
            'email' => $user->email,
            'phone' => $user->employee?->phone ?? $user->phone,
        ];
    }

    public function index()
    {
        try {
            $users = User::with(['employee', 'role'])->paginate($this->perPage);

            $users->getCollection()->transform(function ($user) {
                return $this->reactUser($user);
            });

            return response()->json([
                'success' => true,
                'data' => $users,
            ]);
        } catch (\Throwable $e) {
            report($e);

            return response()->json([
                'success' => false,
                'message' => 'Không thể lấy danh sách user.',
            ], 500);
        }
    }

    public function show($id)
    {
        try {
            $user = User::with(['employee', 'role'])->findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => $this->reactUser($user),
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy dữ liệu',
            ], 404);
        }
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'phone' => ['nullable', 'string', 'max:20'],
            'role_id' => ['required', 'exists:roles,id'],
            'employee_id' => ['nullable', 'exists:employees,id'],
            'status' => ['nullable', 'boolean'],
        ]);

        try {
            $password = Str::random(8);

            $user = User::create([
                'name' => $data['name'],
                'email' => $data['email'],
                'phone' => $data['phone'] ?? null,
                'role_id' => $data['role_id'],
                'employee_id' => $data['employee_id'] ?? null,
                'status' => $data['status'] ?? true,
                'must_change_password' => true,
                'password' => Hash::make($password),
            ]);

            try {
                Mail::to($user->email)->send(new SendAccountMail($user, $password,$user->role->role_code));
                $mailMessage = 'Tạo user thành công và đã gửi email';
            } catch (\Throwable $mailError) {
                report($mailError);
                $mailMessage = 'Tạo user thành công nhưng gửi email thất bại';
            }

            $user->load(['employee', 'role']);

            return response()->json([
                'success' => true,
                'message' => $mailMessage,
                'data' => $this->reactUser($user),
            ], 201);

        } catch (\Throwable $e) {
            report($e);

            return response()->json([
                'success' => false,
                'message' => 'Tạo user thất bại.',
            ], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $user = User::findOrFail($id);

            $data = $request->validate([
                'name' => ['sometimes', 'required', 'string', 'max:255'],
                'email' => ['sometimes', 'required', 'email', 'max:255', 'unique:users,email,' . $id],
                'phone' => ['nullable', 'string', 'max:20'],
                'role_id' => ['sometimes', 'required', 'exists:roles,id'],
                'employee_id' => ['nullable', 'exists:employees,id'],
                'status' => ['nullable', 'boolean'],
            ]);

            $user->update($data);
            $user->load(['employee', 'role']);

            return response()->json([
                'success' => true,
                'message' => 'Cập nhật thành công',
                'data' => $this->reactUser($user),
            ]);
        } catch (\Throwable $e) {
            report($e);

            return response()->json([
                'success' => false,
                'message' => 'Cập nhật thất bại',
            ], 500);
        }
    }
}