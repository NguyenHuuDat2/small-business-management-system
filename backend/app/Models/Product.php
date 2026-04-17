<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'product_code',
        'name',
        'category_id',
        'unit_id',
        'price',
        'image',
        'is_returnable'
    ];

protected $casts = [
        'is_returnable' => 'boolean',
        'price' => 'decimal:2',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function unit()
    {
        return $this->belongsTo(Unit::class);
    }

    public function inventory()
    {
        return $this->hasMany(Inventory::class);
    }
}
