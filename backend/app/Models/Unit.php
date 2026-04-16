<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Unit extends Model
{
    protected $fillable = ['name', 'unit_code'];

    public function products()
    {
        return $this->hasMany(Product::class);
    }
}