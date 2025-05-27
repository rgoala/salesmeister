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
        Schema::create('clients', function (Blueprint $table) {
            $table->id();
            $table->string('organization_name');
            $table->string('email')->unique();
            $table->string('phone')->unique();
            $table->string('fax')->unique();
            $table->string('address1');
            $table->string('address2')->nullable();
            $table->string('city');
            $table->string('zip')->nullable();
            $table->string('state');
            $table->string('country');
            $table->string('website')->nullable();
            $table->string('industry')->nullable();
            $table->string('type')->nullable();
            $table->string('status')->default('active');
            $table->string('tax_id')->nullable();
            $table->string('vat_number')->nullable();
            $table->enum('currency',['AED','EUR','GBP','INR','PKR','USD','JPY'])->default('AED');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('clients');
    }
};
