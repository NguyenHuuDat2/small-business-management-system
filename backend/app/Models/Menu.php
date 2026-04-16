<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Menu extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'path',
        'icon',
        'parent_id',
        'order_index',
        'status',
        'permission_key',
        'menu_type',
        'module_code',
        'page_code'
    ];

protected $casts = [
        'status' => 'boolean',
    ];

    public function parent()
    {
        return $this->belongsTo(Menu::class, 'parent_id');
    }

    public function children()
    {
        return $this->hasMany(Menu::class, 'parent_id')->orderBy('order_index');
    }

    public function roles()
    {
        return $this->belongsToMany(Role::class, 'role_permissions', 'menu_id', 'role_id');
    }
}


