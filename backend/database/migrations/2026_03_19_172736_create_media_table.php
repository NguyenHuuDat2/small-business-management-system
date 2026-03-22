<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('media', function (Blueprint $table) {
            $table->id();
            $table->string('module'); 
            $table->string('public_id');  
            $table->unsignedBigInteger('uploaded_by')->nullable(); 
            $table->timestamps();

            $table->unique('module');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('media');
    }
};