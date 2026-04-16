<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class InvoiceItem extends Model
{
    // Cho phép nạp dữ liệu hàng loạt vào các cột này
    protected $fillable = [
        'invoice_id',
        'product_id',
        'quantity',
        'price',
        'subtotal',
    ];

    /**
     * Mối quan hệ với bảng Invoices
     */
    public function invoice(): BelongsTo
    {
        return $this->belongsTo(Invoice::class);
    }

    /**
     * Mối quan hệ với bảng Products
     * Giúp API lấy được product_name và unit từ ProductSeeder
     */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
}