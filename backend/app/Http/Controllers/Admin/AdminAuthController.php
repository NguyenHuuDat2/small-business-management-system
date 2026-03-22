<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Media;
use Illuminate\Support\Facades\Password;

class AdminAuthController extends Controller
{
    public function showLogin()
    {
        if (Auth::check()) {
            return redirect()->route('admin.dashboard');
        }

        $media = Media::where('module', 'admin_login')->first();

        $backgroundUrl = $media?->url 
            ?? 'https://res.cloudinary.com/dpw7ffinw/image/upload/admin_login_default.png';

        return view('admin.auth.login', compact('backgroundUrl'));
    }

    public function login(Request $request)
    {
        $validated = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ], [
            'email.required' => 'Vui lòng nhập email.',
            'email.email' => 'Email không đúng định dạng.',
            'password.required' => 'Vui lòng nhập mật khẩu.',
        ]);

        $user = User::with('role')->where('email', $validated['email'])->first();

        if (! $user) {
            return back()
                ->withInput($request->only('email'))
                ->with('error', 'Sai tài khoản hoặc mật khẩu.');
        }

        if (! $user->status) {
            return back()
                ->withInput($request->only('email'))
                ->with('error', 'Tài khoản đang bị khóa.');
        }

        if (! $user->role || $user->role->role_code !== 'ADMIN') {
            return back()
                ->withInput($request->only('email'))
                ->with('error', 'Tài khoản này không có quyền truy cập khu vực admin.');
        }

        if (! Auth::attempt([
            'email' => $validated['email'],
            'password' => $validated['password'],
        ])) {
            return back()
                ->withInput($request->only('email'))
                ->with('error', 'Sai tài khoản hoặc mật khẩu.');
        }

        $request->session()->regenerate();


        return redirect()->intended(route('admin.dashboard'));
    }

    public function sendResetLink(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return back()->with('error', 'Email không tồn tại trong hệ thống.');
        }

        // Kiểm tra quyền Admin và trạng thái tài khoản
        if ($user->role->role_code !== 'ADMIN') {
            return back()->with('error', 'Tài khoản không phải Admin.');
        }

        // Gửi link reset mật khẩu
        $status = Password::sendResetLink($request->only('email'));

        return $status === Password::RESET_LINK_SENT
            ? back()->with('status', 'Đã gửi link reset mật khẩu về email của bạn.')
            : back()->withErrors(['email' => __($status)]);
    }

    public function logout(Request $request)
    {
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('admin.login');
    }
}