<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('lead_details', function (Blueprint $table) {
            $table->id();
            $table->foreignId('lead_id')->constrained('leads')->onDelete('cascade');
            $table->string('product_name');
            $table->text('product_description')->nullable();
            $table->string('product_image')->nullable();
            $table->string('product_specifications')->nullable();
            $table->integer('quantity')->default(1);
            $table->decimal('unitprice', 12, 2)->default(0);
            $table->decimal('totalprice', 12, 2)->default(0);
            $table->string('currency', 3)->default('USD');
            $table->enum('status', ['Pending','Constrained','Sourced'])->default('Pending');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('lead_details');
    }
};
