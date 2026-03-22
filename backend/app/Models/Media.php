<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Media extends Model
{
    use HasFactory;

    protected $fillable = ['module', 'public_id', 'uploaded_by'];

 
    public function getUrlAttribute()
    {
        $cloudName = config('services.cloudinary.cloud_name');
        return "https://res.cloudinary.com/{$cloudName}/image/upload/{$this->public_id}.png";
    }
}