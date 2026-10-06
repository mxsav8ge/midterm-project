<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    /**
     * Endpoint 6: POST /api/orders
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'customerName' => 'nullable|string',
            'orderType' => 'required|string',
            'tableOrAddress' => 'nullable|string',
            'items' => 'required|array|min:1',
            'subtotal' => 'required|numeric',
            'discount' => 'nullable|numeric',
            'total' => 'required|numeric',
            'notes' => 'nullable|string',
        ]);

        $orderId = 'ORD-' . strtoupper(substr(uniqid(), -6));
        $timestamp = date('c');

        $receipt = [
            'orderId' => $orderId,
            'timestamp' => $timestamp,
            'customerName' => $validated['customerName'] ?? 'Guest Customer',
            'orderType' => $validated['orderType'],
            'tableOrAddress' => $validated['tableOrAddress'] ?? 'Counter Pickup',
            'items' => $validated['items'],
            'itemCount' => array_sum(array_column($validated['items'], 'quantity')),
            'subtotal' => (float)$validated['subtotal'],
            'discount' => (float)($validated['discount'] ?? 0),
            'total' => (float)$validated['total'],
            'status' => 'Preparing',
            'estimatedPrepMinutes' => 15,
            'storeName' => 'Brew & Bite'
        ];

        return response()->json([
            'status' => 'success',
            'message' => 'Order placed successfully!',
            'data' => $receipt,
        ], 201);
    }
}
