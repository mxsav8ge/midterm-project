<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Repositories\MockDataRepository;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MenuController extends Controller
{
    /**
     * Endpoint 2: GET /api/categories
     */
    public function categories(): JsonResponse
    {
        return response()->json([
            'status' => 'success',
            'data' => MockDataRepository::getCategories(),
        ], 200);
    }

    /**
     * Endpoint 3: GET /api/menu?category={category_id}
     */
    public function index(Request $request): JsonResponse
    {
        $categoryId = $request->query('category');
        $items = MockDataRepository::getMenuItems($categoryId);

        return response()->json([
            'status' => 'success',
            'filter' => $categoryId ?? 'all',
            'total' => count($items),
            'data' => $items,
        ], 200);
    }

    /**
     * Endpoint 4: GET /api/menu/{id}
     */
    public function show(int $id): JsonResponse
    {
        $item = MockDataRepository::findMenuItem($id);

        if (!$item) {
            return response()->json([
                'status' => 'error',
                'message' => 'Menu item not found',
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => $item,
        ], 200);
    }
}
