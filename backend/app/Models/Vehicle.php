<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Vehicle extends Model
{
    use HasFactory;

    protected $fillable = [
        'vehicle_code',
        'name',
        'license_plate',
        'description'
    ];

public function deliveries()
    {
        return $this->hasMany(Delivery::class);
    }
}
