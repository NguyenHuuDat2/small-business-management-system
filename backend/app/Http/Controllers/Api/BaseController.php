<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class BaseController extends Controller
{
    protected $model;
    protected $select = ['*'];
    protected $perPage = 10;

    // GET list
    public function index()
    {
        try {
            $data = $this->model::select($this->select)
                ->paginate($this->perPage);

            return response()->json([
                "success" => true,
                "data" => $data
            ]);
        } catch (\Exception $e) {
            return response()->json([
                "success" => false,
                "message" => $e->getMessage()
            ], 500);
        }
    }

    // GET detail
    public function show($id)
    {
        try {
            $data = $this->model::select($this->select)->findOrFail($id);

            return response()->json([
                "success" => true,
                "data" => $data
            ]);
        } catch (\Exception $e) {
            return response()->json([
                "success" => false,
                "message" => "Không tìm thấy dữ liệu"
            ], 404);
        }
    }

    // CREATE 
    public function store(Request $request)
    {
        try {
            $record = $this->model::create($request->all());

            return response()->json([
                "success" => true,
                "message" => "Tạo thành công",
                "data" => $record
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                "success" => false,
                "message" => $e->getMessage()
            ], 500);
        }
    }

    // UPDATE
    public function update(Request $request, $id)
    {
        try {
            $record = $this->model::findOrFail($id);
            $record->update($request->all());

            return response()->json([
                "success" => true,
                "message" => "Cập nhật thành công",
                "data" => $record
            ]);
        } catch (\Exception $e) {
            return response()->json([
                "success" => false,
                "message" => "Cập nhật thất bại"
            ], 500);
        }
    }

    // DELETE
    public function destroy($id)
    {
        try {
            $record = $this->model::findOrFail($id);
            $record->delete();

            return response()->json([
                "success" => true,
                "message" => "Xóa thành công"
            ]);
        } catch (\Exception $e) {
            return response()->json([
                "success" => false,
                "message" => "Xóa thất bại"
            ], 500);
        }
    }
}