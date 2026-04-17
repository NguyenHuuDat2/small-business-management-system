<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AssetInventory extends Model
{
    use HasFactory;

    protected $fillable = [
        'asset_type_id',
        'quantity'
    ];

protected $table = 'asset_inventory';

    public function assetType()
    {
        return $this->belongsTo(AssetType::class);
    }
}
