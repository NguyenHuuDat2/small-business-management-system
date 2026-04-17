<?php

namespace App\Http\Controllers\Api\Sales;

use App\Http\Controllers\Controller;
use App\Models\SalesOrder;
use App\Models\SalesOrderItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class SalesOrderController extends Controller
{
    public function index(Request $request)
    {
        $q = trim((string) $request->get('q', ''));
        $status = $request->get('status');
        $customerId = $request->get('customer_id');
        $perPage = (int) $request->get('per_page', 10);
        $perPage = max(1, min($perPage, 50));

        $query = DB::table('sales_orders as so')
            ->leftJoin('customers as c', 'so.customer_id', '=', 'c.id')
            ->leftJoin('employees as e', 'so.employee_id', '=', 'e.id')
            ->select(
                'so.id',
                'so.order_no',
                'so.total_amount',
                'so.status',
                'so.created_at',
                'c.id as customer_id',
                'c.name as customer_name',
                'c.phone as customer_phone',
                'e.id as employee_id',
                'e.name as employee_name'
            );

        if ($q !== '') {
            $query->where(function ($sub) use ($q) {
                $sub->where('so.order_no', 'like', "%{$q}%")
                    ->orWhere('c.name', 'like', "%{$q}%")
                    ->orWhere('c.phone', 'like', "%{$q}%")
                    ->orWhere('e.name', 'like', "%{$q}%");
            });
        }

        if (!empty($status)) {
            $query->where('so.status', $status);
        }

        if (!empty($customerId)) {
            $query->where('so.customer_id', $customerId);
        }

        $data = $query
            ->orderByDesc('so.id')
            ->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $data,
        ]);
    }

    public function show(int $id)
    {
        $order = DB::table('sales_orders as so')
            ->leftJoin('customers as c', 'so.customer_id', '=', 'c.id')
            ->leftJoin('employees as e', 'so.employee_id', '=', 'e.id')
            ->where('so.id', $id)
            ->select(
                'so.id',
                'so.order_no',
                'so.total_amount',
                'so.status',
                'so.created_at',
                'c.id as customer_id',
                'c.customer_code',
                'c.name as customer_name',
                'c.phone as customer_phone',
                'c.address as customer_address',
                'e.id as employee_id',
                'e.employee_code',
                'e.name as employee_name'
            )
            ->first();

        if (! $order) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy đơn hàng.',
            ], 404);
        }

        $items = DB::table('sales_order_items as soi')
            ->leftJoin('products as p', 'soi.product_id', '=', 'p.id')
            ->leftJoin('units as u', 'p.unit_id', '=', 'u.id')
            ->where('soi.sales_order_id', $id)
            ->select(
                'soi.id',
                'soi.product_id',
                'p.product_code',
                'p.name as product_name',
                'u.name as unit_name',
                'p.price as current_price',
                'soi.quantity',
                'soi.subtotal'
            )
            ->orderBy('soi.id')
            ->get()
            ->map(function ($item) {
                $item->price = (float) $item->quantity > 0
                    ? round((float) $item->subtotal / (float) $item->quantity, 2)
                    : 0;

                return $item;
            });

        return response()->json([
            'success' => true,
            'data' => [
                'id' => $order->id,
                'order_no' => $order->order_no,
                'status' => $order->status,
                'total_amount' => $order->total_amount,
                'created_at' => $order->created_at,
                'customer' => [
                    'id' => $order->customer_id,
                    'customer_code' => $order->customer_code,
                    'name' => $order->customer_name,
                    'phone' => $order->customer_phone,
                    'address' => $order->customer_address,
                ],
                'employee' => [
                    'id' => $order->employee_id,
                    'employee_code' => $order->employee_code,
                    'name' => $order->employee_name,
                ],
                'items' => $items,
            ],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'customer_id' => ['required', 'exists:customers,id'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.product_id' => ['required', 'exists:products,id'],
            'items.*.quantity' => ['required', 'numeric', 'min:1'],
        ]);

        $user = $request->user();

        if (! $user || ! $user->employee_id) {
            throw ValidationException::withMessages([
                'employee_id' => 'Tài khoản hiện tại chưa được gắn nhân viên, không thể tạo đơn hàng.',
            ]);
        }

        $order = DB::transaction(function () use ($validated, $user) {
            $productIds = collect($validated['items'])
                ->pluck('product_id')
                ->unique()
                ->values()
                ->all();

            $products = DB::table('products')
                ->whereIn('id', $productIds)
                ->select('id', 'price', 'name')
                ->get()
                ->keyBy('id');

            $order = SalesOrder::create([
                'order_no' => $this->generateOrderNo(),
                'customer_id' => $validated['customer_id'],
                'employee_id' => $user->employee_id,
                'total_amount' => 0,
                'status' => 'draft',
            ]);

            $totalAmount = 0;

            foreach ($validated['items'] as $item) {
                $product = $products->get($item['product_id']);

                if (! $product) {
                    throw ValidationException::withMessages([
                        'items' => 'Có sản phẩm không tồn tại trong hệ thống.',
                    ]);
                }

                $quantity = (float) $item['quantity'];
                $subtotal = $quantity * (float) $product->price;
                $totalAmount += $subtotal;

                SalesOrderItem::create([
                    'sales_order_id' => $order->id,
                    'product_id' => $product->id,
                    'quantity' => $quantity,
                    'subtotal' => $subtotal,
                ]);
            }

            $order->update([
                'total_amount' => $totalAmount,
            ]);

            return $order;
        });

        return response()->json([
            'success' => true,
            'message' => 'Tạo đơn hàng thành công.',
            'data' => [
                'id' => $order->id,
                'order_no' => $order->order_no,
                'status' => $order->status,
                'total_amount' => $order->total_amount,
            ],
        ], 201);
    }

    public function update(Request $request, int $id)
    {
        $validated = $request->validate([
            'customer_id' => ['required', 'exists:customers,id'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.product_id' => ['required', 'exists:products,id'],
            'items.*.quantity' => ['required', 'numeric', 'min:1'],
        ]);

        $order = SalesOrder::find($id);

        if (! $order) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy đơn hàng.',
            ], 404);
        }

        if ($order->status !== 'draft') {
            return response()->json([
                'success' => false,
                'message' => 'Chỉ được sửa đơn hàng ở trạng thái draft.',
            ], 422);
        }

        DB::transaction(function () use ($validated, $order) {
            $productIds = collect($validated['items'])
                ->pluck('product_id')
                ->unique()
                ->values()
                ->all();

            $products = DB::table('products')
                ->whereIn('id', $productIds)
                ->select('id', 'price', 'name')
                ->get()
                ->keyBy('id');

            $order->update([
                'customer_id' => $validated['customer_id'],
            ]);

            SalesOrderItem::where('sales_order_id', $order->id)->delete();

            $totalAmount = 0;

            foreach ($validated['items'] as $item) {
                $product = $products->get($item['product_id']);

                if (! $product) {
                    throw ValidationException::withMessages([
                        'items' => 'Có sản phẩm không tồn tại trong hệ thống.',
                    ]);
                }

                $quantity = (float) $item['quantity'];
                $subtotal = $quantity * (float) $product->price;
                $totalAmount += $subtotal;

                SalesOrderItem::create([
                    'sales_order_id' => $order->id,
                    'product_id' => $product->id,
                    'quantity' => $quantity,
                    'subtotal' => $subtotal,
                ]);
            }

            $order->update([
                'total_amount' => $totalAmount,
            ]);
        });

        $order->refresh();

        return response()->json([
            'success' => true,
            'message' => 'Cập nhật đơn hàng thành công.',
            'data' => [
                'id' => $order->id,
                'order_no' => $order->order_no,
                'status' => $order->status,
                'total_amount' => $order->total_amount,
            ],
        ]);
    }

    public function submit(int $id)
    {
        $order = SalesOrder::find($id);

        if (! $order) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy đơn hàng.',
            ], 404);
        }

        if ($order->status !== 'draft') {
            return response()->json([
                'success' => false,
                'message' => 'Chỉ được submit đơn hàng ở trạng thái draft.',
            ], 422);
        }

        $itemCount = SalesOrderItem::where('sales_order_id', $order->id)->count();

        if ($itemCount <= 0) {
            return response()->json([
                'success' => false,
                'message' => 'Đơn hàng chưa có sản phẩm.',
            ], 422);
        }

        $order->update([
            'status' => 'submitted',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Đã gửi đơn hàng thành công.',
            'data' => [
                'id' => $order->id,
                'order_no' => $order->order_no,
                'status' => $order->status,
            ],
        ]);
    }

    public function approve(int $id)
    {
        $order = SalesOrder::find($id);

        if (! $order) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy đơn hàng.',
            ], 404);
        }

        if ($order->status !== 'submitted') {
            return response()->json([
                'success' => false,
                'message' => 'Chỉ được duyệt đơn hàng ở trạng thái submitted.',
            ], 422);
        }

        $order->update([
            'status' => 'approved',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Duyệt đơn hàng thành công.',
            'data' => [
                'id' => $order->id,
                'order_no' => $order->order_no,
                'status' => $order->status,
            ],
        ]);
    }

    public function reject(int $id)
    {
        $order = SalesOrder::find($id);

        if (! $order) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy đơn hàng.',
            ], 404);
        }

        if (! in_array($order->status, ['submitted', 'approved'])) {
            return response()->json([
                'success' => false,
                'message' => 'Chỉ được từ chối đơn hàng đang submitted hoặc approved.',
            ], 422);
        }

        $order->update([
            'status' => 'rejected',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Đã từ chối đơn hàng.',
            'data' => [
                'id' => $order->id,
                'order_no' => $order->order_no,
                'status' => $order->status,
            ],
        ]);
    }

    public function cancel(int $id)
    {
        $order = SalesOrder::find($id);

        if (! $order) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy đơn hàng.',
            ], 404);
        }

        if (in_array($order->status, ['sent_to_warehouse', 'delivered', 'cancelled'])) {
            return response()->json([
                'success' => false,
                'message' => 'Không thể hủy đơn hàng ở trạng thái hiện tại.',
            ], 422);
        }

        $order->update([
            'status' => 'cancelled',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Hủy đơn hàng thành công.',
            'data' => [
                'id' => $order->id,
                'order_no' => $order->order_no,
                'status' => $order->status,
            ],
        ]);
    }

    protected function generateOrderNo(): string
    {
        do {
            $orderNo = 'SO' . now()->format('ymdHis') . rand(10, 99);
        } while (SalesOrder::where('order_no', $orderNo)->exists());

        return $orderNo;
    }
}