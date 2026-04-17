<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AssetType extends Model
{
    use HasFactory;

    protected $fillable = [
        'asset_type_code',
        'name',
        'description'
    ];

public function inventory()
    {
        return $this->hasOne(AssetInventory::class);
    }

    public function customerAssets()
    {
        return $this->hasMany(CustomerAsset::class);
    }

    public function transactions()
    {
        return $this->hasMany(AssetTransaction::class);
    }
}
