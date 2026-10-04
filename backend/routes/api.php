<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\StoreController;
use App\Http\Controllers\Api\MenuController;
use App\Http\Controllers\Api\OrderController;

/*
|--------------------------------------------------------------------------
| Mobile Ordering System - REST API Routes (No Database)
|--------------------------------------------------------------------------
*/

// Health check endpoint
Route::get('/health', function () {
    return response()->json([
        'status' => 'online',
        'service' => 'Ordering System API',
        'timestamp' => date('c'),
    ]);
});

// Endpoint 1: Store Information
Route::get('/store-info', [StoreController::class, 'storeInfo']);

// Endpoint 2: Food & Beverage Categories
Route::get('/categories', [MenuController::class, 'categories']);

// Endpoint 3: All & Filtered Menu Items
Route::get('/menu', [MenuController::class, 'index']);

// Endpoint 4: Single Menu Item Details & Addons
Route::get('/menu/{id}', [MenuController::class, 'show']);

// Endpoint 5: Promotions & Voucher Codes
Route::get('/promotions', [StoreController::class, 'promotions']);

// Endpoint 6: Place Simulated Order
Route::post('/orders', [OrderController::class, 'store']);
