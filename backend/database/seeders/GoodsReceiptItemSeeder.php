<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\GoodsReceiptItem;
use Illuminate\Support\Facades\DB;

class GoodsReceiptItemSeeder extends Seeder
{
    public function run(): void
    {
        $receipts = DB::table('goods_receipts')
            ->join('suppliers', 'goods_receipts.supplier_id', '=', 'suppliers.id')
            ->select('goods_receipts.*', 'suppliers.supplier_code')
            ->orderBy('goods_receipts.id')
            ->get();

        foreach ($receipts as $receiptIndex => $receipt) {
            $warehouseLocations = DB::table('locations')
                ->where('warehouse_id', $receipt->warehouse_id)
                ->pluck('id')
                ->toArray();

            if (empty($warehouseLocations)) {
                continue;
            }

            $productIds = $this->getProductPoolBySupplierCode($receipt->supplier_code);

            if (empty($productIds)) {
                $productIds = DB::table('products')->pluck('id')->take(5)->toArray();
            }

            $total = 0;

            foreach (array_slice($productIds, 0, 4) as $itemIndex => $productId) {
                $product = DB::table('products')->where('id', $productId)->first();

                if (! $product) {
                    continue;
                }

                $quantity = $this->makeReceiptQuantity($product->price, $itemIndex, $receiptIndex);
                $price = round($product->price * 0.78, 0);
                $subtotal = $quantity * $price;
                $locationId = $warehouseLocations[$itemIndex % count($warehouseLocations)];

                GoodsReceiptItem::updateOrCreate(
                    [
                        'goods_receipt_id' => $receipt->id,
                        'product_id' => $product->id,
                        'location_id' => $locationId,
                    ],
                    [
                        'quantity' => $quantity,
                        'price' => $price,
                        'subtotal' => $subtotal,
                    ]
                );

                $total += $subtotal;
            }

            DB::table('goods_receipts')
                ->where('id', $receipt->id)
                ->update(['total_amount' => $total]);
        }
    }

    protected function getProductPoolBySupplierCode(string $supplierCode): array
    {
        $map = [
            // Đồ uống
            'SUP0001' => ['BEV-WATER'],
            'SUP0002' => ['BEV-MILK'],
            'SUP0003' => ['BEV-COFFEE'],
            'SUP0004' => ['BEV-SOFT', 'BEV-WATER'],

            // Thực phẩm
            'SUP0005' => ['FOOD-INSTANT', 'FOOD-DRY'],
            'SUP0006' => ['FOOD-SEASON', 'GROC-OIL'],
            'SUP0007' => ['FOOD-SNACK'],
            'SUP0008' => ['FOOD-CANNED'],

            // Tạp hoá
            'SUP0009' => ['GROC-DAILY', 'GROC-OIL'],
            'SUP0010' => ['GROC-DAILY'],

            // Dân dụng
            'SUP0011' => ['HOME-PLASTIC', 'HOME-HOUSE'],
            'SUP0012' => ['HOME-KITCHEN'],

            // Điện nước & gas
            'SUP0013' => ['ELEC-GAS'],
            'SUP0014' => ['ELEC-GAS'],
            'SUP0015' => ['ELEC-WATER'],

            // Còn lại
            'SUP0016' => ['FURN-WOOD', 'FURN-CABINET'],
            'SUP0017' => ['MED-OTC'],
            'SUP0018' => ['MED-FIRSTAID'],
            'SUP0019' => ['FEED-LIVESTOCK'],
            'SUP0020' => ['FEED-PET'],
            'SUP0021' => ['OFF-PAPER', 'OFF-STATIONERY'],
            'SUP0022' => ['CLN-DETERGENT', 'CLN-TOOL'],
            'SUP0023' => ['PKG-CARTON', 'PKG-BAG'],
            'SUP0024' => ['BEV-WATER', 'FOOD-INSTANT', 'GROC-DAILY', 'HOME-HOUSE', 'ELEC-WATER'],
        ];

        $categoryCodes = $map[$supplierCode] ?? [];

        if (empty($categoryCodes)) {
            return [];
        }

        return DB::table('products')
            ->join('categories', 'products.category_id', '=', 'categories.id')
            ->whereIn('categories.category_code', $categoryCodes)
            ->orderBy('products.id')
            ->pluck('products.id')
            ->toArray();
    }

    protected function makeReceiptQuantity(float $price, int $itemIndex, int $receiptIndex): int
    {
        if ($price <= 20000) {
            return 30 + (($receiptIndex + $itemIndex) % 5) * 10;
        }

        if ($price <= 100000) {
            return 10 + (($receiptIndex + $itemIndex) % 4) * 5;
        }

        if ($price <= 500000) {
            return 4 + (($receiptIndex + $itemIndex) % 3) * 2;
        }

        return 1 + (($receiptIndex + $itemIndex) % 2);
    }
}