<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;

class UserController extends Controller
{
    // GET/users
    public function index(){
        $users = User::all();
        return response()->json($users,200,[],JSON_UNESCAPED_UNICODE);
    }

    // GET/users/1
    public function show($id){
        return response()->json(User::findOrFail($id));
    }

}
