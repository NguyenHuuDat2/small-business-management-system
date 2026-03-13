<?php

namespace App\Http\Controllers\Api;

use App\Models\User;

class UserController extends BaseController
{
    public function __construct()
    {
        $this->model = User::class;

        // chỉ cho phép API trả các cột này
        $this->select = ['id','name','email','phone'];

    }
}