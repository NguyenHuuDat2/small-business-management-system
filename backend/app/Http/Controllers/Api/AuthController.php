<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class AuthController extends Controller
{
   public function login(Request $request)
    {
        $data = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
            'device_name' => ['nullable', 'string', 'max:255'],
        ]);

        $user = User::with(['role.menus', 'employee.department'])
            ->where('email', $data['email'])
            ->first();

        if (! $user || ! Hash::check($data['password'], $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Sai email hoặc mật khẩu',
            ], 401);
        }

        if ($user->role?->role_code === 'ADMIN') {
            return response()->json([
                'success' => false,
                'message' => 'Tài khoản quản trị vui lòng đăng nhập ở trang admin.',
            ], 403);
        }

        if (! $user->status) {
            return response()->json([
                'success' => false,
                'message' => 'Tài khoản đã bị khóa',
            ], 403);
        }

        $tokenName = $data['device_name']
            ?? Str::limit($request->userAgent() ?: 'react-web', 255, '');

        $token = $user->createToken($tokenName)->plainTextToken;

        $navigation = $this->transformNavigation($user);

        return response()->json([
            'success' => true,
            'message' => 'Đăng nhập thành công',
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $this->transformUser($user),
            'sidebar' => $navigation['sidebar'],
            'permissions' => $navigation['permissions'],
        ]);
    }

    public function me(Request $request)
    {
        $user = $request->user()->loadMissing(['role.menus', 'employee.department']);
        $navigation = $this->transformNavigation($user);

        return response()->json([
            'success' => true,
            'user' => $this->transformUser($user),
            'sidebar' => $navigation['sidebar'],
            'permissions' => $navigation['permissions'],
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()?->delete();

        return response()->json([
            'success' => true,
            'message' => 'Đăng xuất thành công',
        ]);
    }

    public function changePassword(Request $request)
    {
        $data = $request->validate([
            'old_password' => ['required', 'string'],
            'new_password' => ['required', 'string', 'min:8', 'different:old_password', 'confirmed'],
        ]);

        $user = $request->user();

        if (! Hash::check($data['old_password'], $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Mật khẩu cũ không đúng',
            ], 400);
        }

        $user->password = Hash::make($data['new_password']);
        $user->must_change_password = false;
        $user->save();

        return response()->json([
            'success' => true,
            'message' => 'Đổi mật khẩu thành công',
        ]);
    }

    public function forgotPassword(Request $request)
    {
        return response()->json([
            'success' => false,
            'message' => 'Chức năng quên mật khẩu tạm thời chưa mở.',
        ], 501);
    }

    private function transformUser(User $user): array
    {
        return [
            'id' => $user->id,
            'email' => $user->email,
            'status' => (bool) $user->status,
            'must_change_password' => (bool) $user->must_change_password,
            'name' => $user->name,
            'phone' => $user->phone,
            'display_name' => $user->display_name,

            'role' => $user->role ? [
                'id' => $user->role->id,
                'role_code' => $user->role->role_code,
                'name' => $user->role->name,
                'description' => $user->role->description,
            ] : null,

            'employee' => $user->employee ? [
                'id' => $user->employee->id,
                'employee_code' => $user->employee->employee_code,
                'name' => $user->employee->name,
                'phone' => $user->employee->phone,
                'status' => (bool) $user->employee->status,
                'department' => $user->employee->department ? [
                    'id' => $user->employee->department->id,
                    'name' => $user->employee->department->name,
                ] : null,
            ] : null,
        ];
    }

    private function getAllowedMenus(User $user)
    {
        return $user->role
            ? $user->role->menus()
                ->where('status', true)
                ->orderBy('order_index')
                ->get()
            : collect();
    }

    private function buildMenuTree($menus, $parentId = null): array
    {
        return $menus
            ->where('parent_id', $parentId)
            ->sortBy('order_index')
            ->map(function ($menu) use ($menus) {
                return [
                    'id' => $menu->id,
                    'name' => $menu->name,
                    'path' => $menu->path,
                    'page_code' => $menu->page_code,
                    'icon' => $menu->icon,
                    'permission_key' => $menu->permission_key,
                    'menu_type' => $menu->menu_type,
                    'children' => $this->buildMenuTree($menus, $menu->id),
                ];
            })
            ->values()
            ->toArray();
    }

    private function transformNavigation(User $user): array
    {
        $menus = $this->getAllowedMenus($user);

        $sidebarMenus = $menus->where('menu_type', 'sidebar')->values();

        $permissions = $menus
            ->pluck('permission_key')
            ->filter()
            ->unique()
            ->values()
            ->toArray();

        return [
            'sidebar' => $this->buildMenuTree($sidebarMenus),
            'permissions' => $permissions,
        ];
    }
}