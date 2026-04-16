<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AssetTransaction extends Model
{
    use HasFactory;

    protected $fillable = [
        'asset_type_id',
        'customer_id',
        'transaction_type',
        'quantity',
        'note'
    ];

public function assetType()
    {
        return $this->belongsTo(AssetType::class);
    }

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }
}
