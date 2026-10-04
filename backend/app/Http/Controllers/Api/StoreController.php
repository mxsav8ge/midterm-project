<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Repositories\MockDataRepository;
use Illuminate\Http\JsonResponse;

class StoreController extends Controller
{
    /**
     * Endpoint 1: GET /api/store-info
     */
    public function storeInfo(): JsonResponse
    {
        return response()->json([
            'status' => 'success',
            'data' => MockDataRepository::getStoreInfo(),
        ], 200);
    }

    /**
     * Endpoint 5: GET /api/promotions
     */
    public function promotions(): JsonResponse
    {
        return response()->json([
            'status' => 'success',
            'count' => count(MockDataRepository::getPromotions()),
            'data' => MockDataRepository::getPromotions(),
        ], 200);
    }
}
