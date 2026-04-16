<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\SalesOrderItem;
use Illuminate\Support\Facades\DB;

class SalesOrderItemSeeder extends Seeder
{
    public function run(): void
    {
        $orders = DB::table('sales_orders')->orderBy('id')->get();
        $productPools = $this->getSalesProductPools();

        $mainPool = array_merge(
            $productPools['beverage'],
            $productPools['food'],
            $productPools['grocery'],
            $productPools['home'],
            $productPools['utility']
        );

        foreach ($orders as $orderIndex => $order) {
            $pickedProducts = $this->pickProductsForOrder($mainPool, $orderIndex);
            $total = 0;

            foreach ($pickedProducts as $itemIndex => $productId) {
                $product = DB::table('products')->where('id', $productId)->first();

                if (! $product) {
                    continue;
                }

                $quantity = $this->makeSalesQuantity($product->price, $itemIndex, $orderIndex);
                $subtotal = $quantity * $product->price;

                SalesOrderItem::updateOrCreate(
                    [
                        'sales_order_id' => $order->id,
                        'product_id' => $product->id,
                    ],
                    [
                        'quantity' => $quantity,
                        'subtotal' => $subtotal,
                    ]
                );

                $total += $subtotal;
            }

            DB::table('sales_orders')
                ->where('id', $order->id)
                ->update(['total_amount' => $total]);
        }
    }

    protected function getSalesProductPools(): array
    {
        $getByCategories = function (array $codes) {
            return DB::table('products')
                ->join('categories', 'products.category_id', '=', 'categories.id')
                ->whereIn('categories.category_code', $codes)
                ->orderBy('products.id')
                ->pluck('products.id')
                ->toArray();
        };

        return [
            'beverage' => $getByCategories(['BEV-WATER', 'BEV-MILK', 'BEV-COFFEE', 'BEV-SOFT']),
            'food'     => $getByCategories(['FOOD-INSTANT', 'FOOD-CANNED', 'FOOD-SNACK', 'FOOD-SEASON', 'FOOD-DRY']),
            'grocery'  => $getByCategories(['GROC-OIL', 'GROC-DAILY']),
            'home'     => $getByCategories(['HOME-KITCHEN', 'HOME-PLASTIC', 'HOME-HOUSE']),
            'utility'  => $getByCategories(['ELEC-GAS', 'ELEC-WATER']),
        ];
    }

    protected function pickProductsForOrder(array $pool, int $orderIndex): array
    {
        $result = [];
        $count = 3 + ($orderIndex % 3); // 3-5 dòng

        for ($i = 0; $i < $count; $i++) {
            $productId = $pool[($orderIndex * 4 + $i) % count($pool)];

            if (! in_array($productId, $result)) {
                $result[] = $productId;
            }
        }

        return $result;
    }

    protected function makeSalesQuantity(float $price, int $itemIndex, int $orderIndex): int
    {
        if ($price <= 20000) {
            return 4 + (($orderIndex + $itemIndex) % 6);
        }

        if ($price <= 100000) {
            return 2 + (($orderIndex + $itemIndex) % 4);
        }

        if ($price <= 500000) {
            return 1 + (($orderIndex + $itemIndex) % 2);
        }

        return 1;
    }
}