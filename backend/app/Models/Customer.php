<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{
    use HasFactory;

    protected $fillable = [
        'customer_code',
        'name',
        'phone',
        'address',
        'customer_type',
        'note'
    ];

public function salesOrders()
    {
        return $this->hasMany(SalesOrder::class);
    }

    public function invoices()
    {
        return $this->hasMany(Invoice::class);
    }

    public function customerAssets()
    {
        return $this->hasMany(CustomerAsset::class);
    }

    public function assetTransactions()
    {
        return $this->hasMany(AssetTransaction::class);
    }
}
