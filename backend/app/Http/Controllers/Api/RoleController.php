<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Role;


class RoleController extends Controller
{
    public function index()
    {
        $roles = Role::select('id', 'role_code', 'name', 'description')
            ->orderBy('id')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $roles,
        ]);
    }
}
