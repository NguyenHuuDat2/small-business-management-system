<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;

class UserController extends Controller
{
    // GET/users
    public function index(){
        $users = User::select('id','name','email','phone')->get();
        return response()->json($users,200,[],JSON_UNESCAPED_UNICODE);
    }

    // GET/users/1
    public function show($id){
        $user=User::select('id','name','email','phone')->findOrFail($id);
        return response()->json($user);
    }

    //test git hub add branch user

}
