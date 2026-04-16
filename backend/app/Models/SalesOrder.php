<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SalesOrder extends Model
{
    protected $fillable = [
        'order_no', 
        'customer_id', 
        'total_amount', 
        'status'
    ];

    public function invoices()
    {
        return $this->hasMany(Invoice::class);
    }
}