<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class BaseController extends Controller
{
    protected $model;
    protected $select = ['*']; 

    // GET /api/resource
    public function index()
    {
        $data = $this->model::select($this->select)->get();

        return response()->json([
            "success" => true,
            "data" => $data
        ],200,[],JSON_UNESCAPED_UNICODE);
    }

    // GET /api/resource/{id}
    public function show($id)
    {
        $data = $this->model::select($this->select)->findOrFail($id);

        return response()->json([
            "success" => true,
            "data" => $data
        ],200,[],JSON_UNESCAPED_UNICODE);
    }

    // POST
    public function store(Request $request)
    {
        $data = $this->model::create($request->all());

        return response()->json([
            "success" => true,
            "message" => "Tạo thành công",
            "data" => $data
        ],201,[],JSON_UNESCAPED_UNICODE);
    }

    // PUT
    public function update(Request $request,$id)
    {
        $data = $this->model::findOrFail($id);
        $data->update($request->all());

        return response()->json([
            "success" => true,
            "message" => "Cập nhật thành công",
            "data" => $data
        ],200,[],JSON_UNESCAPED_UNICODE);
    }

    // DELETE
    public function destroy($id)
    {
        $data = $this->model::findOrFail($id);
        $data->delete();

        return response()->json([
            "success" => true,
            "message" => "Xóa thành công"
        ],200,[],JSON_UNESCAPED_UNICODE);
    }
}