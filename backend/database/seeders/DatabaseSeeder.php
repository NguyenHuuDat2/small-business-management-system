<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            RoleSeeder::class,
            DepartmentSeeder::class,
            EmployeeSeeder::class,
            MenuSeeder::class,
            RolePermissionSeeder::class,
            UserSeeder::class,
            MediaSeeder::class,

            CategorySeeder::class,
            ProductSeeder::class,
            CustomerSeeder::class,     
            SalesOrderSeeder::class,
            InvoiceSeeder::class,     
            InvoiceItemSeeder::class,  
            PaymentSeeder::class,      
        ]);
    }
}