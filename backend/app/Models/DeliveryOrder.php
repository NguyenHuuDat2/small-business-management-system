<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DeliveryOrder extends Model
{
    use HasFactory;

    protected $fillable = [
        'delivery_id',
        'sales_order_id',
        'status'
    ];

public function delivery()
    {
        return $this->belongsTo(Delivery::class);
    }

    public function salesOrder()
    {
        return $this->belongsTo(SalesOrder::class);
    }

    public function items()
    {
        return $this->hasMany(DeliveryItem::class);
    }
}
