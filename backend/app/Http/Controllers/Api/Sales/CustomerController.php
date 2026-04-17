<?php

namespace App\Http\Controllers\Api\Sales;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class CustomerController extends Controller
{
    public function index(Request $request)
    {
        $q = trim((string) $request->get('q', ''));
        $perPage = (int) $request->get('per_page', 10);
        $perPage = max(1, min($perPage, 50));

        $query = Customer::query()
            ->select([
                'id',
                'customer_code',
                'name',
                'phone',
                'address',
                'customer_type',
                'note',
                'created_at',
            ]);

        if ($q !== '') {
            $query->where(function ($sub) use ($q) {
                $sub->where('customer_code', 'like', "%{$q}%")
                    ->orWhere('name', 'like', "%{$q}%")
                    ->orWhere('phone', 'like', "%{$q}%")
                    ->orWhere('address', 'like', "%{$q}%");
            });
        }

        $data = $query
            ->orderByDesc('id')
            ->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $data,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:20'],
            'address' => ['nullable', 'string', 'max:500'],
            'customer_type' => ['nullable', 'string', 'max:100'],
            'note' => ['nullable', 'string', 'max:1000'],
        ]);

        $customer = Customer::create([
            'customer_code' => $this->generateCustomerCode(),
            'name' => $validated['name'],
            'phone' => $validated['phone'] ?? null,
            'address' => $validated['address'] ?? null,
            'customer_type' => $validated['customer_type'] ?? null,
            'note' => $validated['note'] ?? null,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Tạo khách hàng thành công.',
            'data' => $customer,
        ], 201);
    }

    public function update(Request $request, int $id)
    {
        $customer = Customer::find($id);

        if (! $customer) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy khách hàng.',
            ], 404);
        }

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:20'],
            'address' => ['nullable', 'string', 'max:500'],
            'customer_type' => ['nullable', 'string', 'max:100'],
            'note' => ['nullable', 'string', 'max:1000'],
        ]);

        $customer->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Cập nhật khách hàng thành công.',
            'data' => $customer,
        ]);
    }

    protected function generateCustomerCode(): string
    {
        $latestId = Customer::max('id') ?? 0;
        $next = $latestId + 1;

        do {
            $code = 'CUS' . str_pad((string) $next, 4, '0', STR_PAD_LEFT);
            $exists = Customer::where('customer_code', $code)->exists();
            $next++;
        } while ($exists);

        return $code;
    }
}