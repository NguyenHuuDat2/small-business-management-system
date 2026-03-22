<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Media;

class MediaSeeder extends Seeder
{
    public function run(): void
    {
        Media::updateOrCreate(
            ['module' => 'admin_login'], 
            ['public_id' => 'admin_page_alccpz'] 
        );

        Media::updateOrCreate(
            ['module' => 'employee_dashboard'],
            ['public_id' => 'employee_dashboard_default']
        );
    }
}