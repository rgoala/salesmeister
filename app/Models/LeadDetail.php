<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LeadDetail extends Model
{
    protected $fillable = [
        'lead_id',
        'product_name',
        'product_description',
        'product_image',
        'product_specifications',
        'quantity',
        'unitprice',
        'totalprice',
        'currency',
        'status'
    ];
}
