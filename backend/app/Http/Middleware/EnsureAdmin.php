<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureAdmin
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (! $user) {
            return response()->json([
                'success' => false,
                'message' => 'Chưa xác thực.',
            ], 401);
        }

        if (! $user->role || $user->role->role_code !== 'ADMIN') {
            return response()->json([
                'success' => false,
                'message' => 'Bạn không có quyền truy cập khu vực admin.',
            ], 403);
        }

        return $next($request);
    }
}