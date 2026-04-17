<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CustomerAsset extends Model
{
    use HasFactory;

    protected $fillable = [
        'customer_id',
        'asset_type_id',
        'quantity'
    ];

public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    public function assetType()
    {
        return $this->belongsTo(AssetType::class);
    }
}
