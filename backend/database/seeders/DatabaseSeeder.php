<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        $this->call([
            RoleSeeder::class,
            DepartmentSeeder::class,
            EmployeeSeeder::class,

            UnitSeeder::class,
            CategorySeeder::class,
            SupplierSeeder::class,
            CustomerSeeder::class,
            VehicleSeeder::class,
            WarehouseSeeder::class,
            ProductSeeder::class,
            LocationSeeder::class,
            InventorySeeder::class,

            MenuSeeder::class,
            RolePermissionSeeder::class,
            UserSeeder::class,

            GoodsReceiptSeeder::class,
            GoodsReceiptItemSeeder::class,

            SalesOrderSeeder::class,
            SalesOrderItemSeeder::class,

            DeliverySeeder::class,
            DeliveryOrderSeeder::class,
            DeliveryItemSeeder::class,

            InvoiceSeeder::class,
            InvoiceItemSeeder::class,
            PaymentSeeder::class,

            StockAdjustmentSeeder::class,
            StockMovementSeeder::class,

            AssetTypeSeeder::class,
            AssetInventorySeeder::class,
            CustomerAssetSeeder::class,
            AssetTransactionSeeder::class,

            MediaSeeder::class,
        ]);
    }
}