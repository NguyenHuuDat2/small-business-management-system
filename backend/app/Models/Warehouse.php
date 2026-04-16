<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Warehouse extends Model
{
    use HasFactory;

    protected $fillable = [
        'warehouse_code',
        'name',
        'address'
    ];

    protected $table = 'ware_house';

public function locations()
    {
        return $this->hasMany(Location::class, 'warehouse_id');
    }

    public function goodsReceipts()
    {
        return $this->hasMany(GoodsReceipt::class, 'warehouse_id');
    }

    public function deliveries()
    {
        return $this->hasMany(Delivery::class, 'warehouse_id');
    }
}
