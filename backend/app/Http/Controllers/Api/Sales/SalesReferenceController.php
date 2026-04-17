<?php

namespace App\Http\Controllers\Api\Sales;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SalesReferenceController extends Controller
{
    public function customers(Request $request)
    {
        $q = trim((string) $request->get('q', ''));
        $limit = (int) $request->get('limit', 20);
        $limit = max(1, min($limit, 50));

        $query = DB::table('customers')
            ->select(
                'id',
                'customer_code',
                'name',
                'phone',
                'address',
                'customer_type'
            );

        if ($q !== '') {
            $query->where(function ($sub) use ($q) {
                $sub->where('customer_code', 'like', "%{$q}%")
                    ->orWhere('name', 'like', "%{$q}%")
                    ->orWhere('phone', 'like', "%{$q}%");
            });
        }

        $data = $query
            ->orderBy('name')
            ->limit($limit)
            ->get()
            ->map(function ($row) {
                $row->label = trim(($row->name ?? '') . ' - ' . ($row->phone ?? ''));
                return $row;
            });

        return response()->json([
            'success' => true,
            'data' => $data,
        ]);
    }

    public function products(Request $request)
    {
        $q = trim((string) $request->get('q', ''));
        $limit = (int) $request->get('limit', 20);
        $limit = max(1, min($limit, 50));
        $categoryId = $request->get('category_id');

        $query = DB::table('products')
            ->leftJoin('units', 'products.unit_id', '=', 'units.id')
            ->leftJoin('categories', 'products.category_id', '=', 'categories.id')
            ->select(
                'products.id',
                'products.product_code',
                'products.name',
                'products.price',
                'products.image',
                'products.is_returnable',
                'units.name as unit_name',
                'categories.name as category_name',
                'categories.id as category_id'
            );

        if ($q !== '') {
            $query->where(function ($sub) use ($q) {
                $sub->where('products.product_code', 'like', "%{$q}%")
                    ->orWhere('products.name', 'like', "%{$q}%");
            });
        }

        if (!empty($categoryId)) {
            $query->where('products.category_id', $categoryId);
        }

        $data = $query
            ->orderBy('products.name')
            ->limit($limit)
            ->get()
            ->map(function ($row) {
                $priceText = number_format((float) $row->price, 0, ',', '.');
                $row->label = trim(($row->product_code ?? '') . ' - ' . ($row->name ?? '') . ' - ' . $priceText . 'đ');
                return $row;
            });

        return response()->json([
            'success' => true,
            'data' => $data,
        ]);
    }
}