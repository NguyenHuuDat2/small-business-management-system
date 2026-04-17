<?php

namespace App\Http\Controllers\Api\Sales;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SalesProductController extends Controller
{
    public function index(Request $request)
    {
        $q = trim((string) $request->get('q', ''));
        $categoryId = $request->get('category_id');
        $perPage = (int) $request->get('per_page', 10);
        $perPage = max(1, min($perPage, 50));

        $query = DB::table('products as p')
            ->leftJoin('categories as c', 'p.category_id', '=', 'c.id')
            ->leftJoin('units as u', 'p.unit_id', '=', 'u.id')
            ->select(
                'p.id',
                'p.product_code',
                'p.name',
                'p.price',
                'p.image',
                'p.is_returnable',
                'p.created_at',
                'c.id as category_id',
                'c.name as category_name',
                'u.name as unit_name'
            );

        if ($q !== '') {
            $query->where(function ($sub) use ($q) {
                $sub->where('p.product_code', 'like', "%{$q}%")
                    ->orWhere('p.name', 'like', "%{$q}%")
                    ->orWhere('c.name', 'like', "%{$q}%");
            });
        }

        if (!empty($categoryId)) {
            $query->where('p.category_id', $categoryId);
        }

        $data = $query
            ->orderByDesc('p.id')
            ->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $data,
        ]);
    }
}