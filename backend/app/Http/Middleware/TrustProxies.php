<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Illuminate\Http\Middleware\TrustProxies as Middleware;

class TrustProxies extends Middleware
{
    protected $proxies = '*';  // Tin cậy tất cả proxy
    protected $headers = 'X-Forwarded-Proto';
}