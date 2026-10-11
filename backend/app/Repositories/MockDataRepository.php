<?php

namespace App\Repositories;

class MockDataRepository
{
    /**
     * Store profile & location
     */
    public static function getStoreInfo(): array
    {
        return [
            'name' => 'Good Coffee, Good Mood',
            'customerName' => 'Occian',
            'location' => 'Opol, Misamis Oriental, Philippines',
            'address' => '123 Coffee Street, Opol, Misamis Oriental, Philippines',
            'tagline' => 'Discover the best coffee, made for you.',
            'isOpen' => true,
            'rating' => 4.8,
            'reviewCount' => 230,
            'deliveryTime' => '25-30 min',
            'standardDeliveryFee' => 49.00,
            'expressDeliveryFee' => 99.00,
        ];
    }

    /**
     * Coffee and dessert categories
     */
    public static function getCategories(): array
    {
        return [
            [
                'id' => 'all',
                'name' => 'All',
                'icon' => 'layout-grid',
            ],
            [
                'id' => 'cappuccino',
                'name' => 'Cappuccino',
                'icon' => 'coffee',
            ],
            [
                'id' => 'latte',
                'name' => 'Latte',
                'icon' => 'cup-soda',
            ],
            [
                'id' => 'espresso',
                'name' => 'Espresso',
                'icon' => 'zap',
            ],
            [
                'id' => 'dessert',
                'name' => 'Dessert',
                'icon' => 'cake-slice',
            ],
        ];
    }

    /**
     * Menu items
     */
    public static function getMenuItems(?string $categoryId = null): array
    {
        $items = [
            [
                'id' => 1,
                'categoryId' => 'cappuccino',
                'name' => 'Cappuccino',
                'subtitle' => 'With Oat Milk',
                'price' => 165.00,
                'rating' => 4.8,
                'reviews' => 230,
                'isPopular' => true,
                'isSpecial' => false,
                'imageUrl' => 'http://localhost:8000/images/drinks/drinks1.png',
                'description' => 'A classic cappuccino with rich espresso, steamed milk, and a smooth layer of foam.',
                'sizes' => [
                    ['id' => 's', 'label' => 'S', 'oz' => '8 oz', 'extra' => 0.00],
                    ['id' => 'm', 'label' => 'M', 'oz' => '12 oz', 'extra' => 0.00],
                    ['id' => 'l', 'label' => 'L', 'oz' => '16 oz', 'extra' => 25.00],
                ],
                'milks' => [
                    ['id' => 'dairy', 'name' => 'Dairy Milk', 'extra' => 0.00],
                    ['id' => 'oat', 'name' => 'Oat Milk', 'extra' => 35.00],
                    ['id' => 'almond', 'name' => 'Almond Milk', 'extra' => 35.00],
                ],
                'extras' => [
                    ['id' => 'extra_shot', 'name' => 'Extra Shot', 'price' => 40.00],
                    ['id' => 'vanilla_syrup', 'name' => 'Vanilla Syrup', 'price' => 25.00],
                ],
            ],

            [
                'id' => 2,
                'categoryId' => 'latte',
                'name' => 'Caramel Latte',
                'subtitle' => 'Smooth & Sweet',
                'price' => 195.00,
                'rating' => 4.9,
                'reviews' => 185,
                'isPopular' => true,
                'isSpecial' => false,
                'imageUrl' => 'http://localhost:8000/images/drinks/drinks3.png',
                'description' => 'Freshly pulled espresso with creamy steamed milk and rich sweet caramel syrup drizzle.',
                'sizes' => [
                    ['id' => 's', 'label' => 'S', 'oz' => '8 oz', 'extra' => 0.00],
                    ['id' => 'm', 'label' => 'M', 'oz' => '12 oz', 'extra' => 0.00],
                    ['id' => 'l', 'label' => 'L', 'oz' => '16 oz', 'extra' => 25.00],
                ],
                'milks' => [
                    ['id' => 'dairy', 'name' => 'Dairy Milk', 'extra' => 0.00],
                    ['id' => 'oat', 'name' => 'Oat Milk', 'extra' => 35.00],
                    ['id' => 'almond', 'name' => 'Almond Milk', 'extra' => 35.00],
                ],
                'extras' => [
                    ['id' => 'extra_shot', 'name' => 'Extra Shot', 'price' => 40.00],
                    ['id' => 'vanilla_syrup', 'name' => 'Vanilla Syrup', 'price' => 25.00],
                ],
            ],

            [
                'id' => 3,
                'categoryId' => 'cappuccino',
                'name' => 'Flat White',
                'subtitle' => 'The perfect balance of bold and smooth',
                'price' => 180.00,
                'rating' => 4.7,
                'reviews' => 140,
                'isPopular' => false,
                'isSpecial' => false,
                'imageUrl' => 'http://localhost:8000/images/drinks/drinks4.png',
                'description' => 'Double shot of ristretto blended with velvety microfoam milk for an intense coffee punch.',
                'sizes' => [
                    ['id' => 's', 'label' => 'S', 'oz' => '8 oz', 'extra' => 0.00],
                    ['id' => 'm', 'label' => 'M', 'oz' => '12 oz', 'extra' => 0.00],
                ],
                'milks' => [
                    ['id' => 'dairy', 'name' => 'Dairy Milk', 'extra' => 0.00],
                    ['id' => 'oat', 'name' => 'Oat Milk', 'extra' => 35.00],
                ],
                'extras' => [
                    ['id' => 'extra_shot', 'name' => 'Extra Shot', 'price' => 40.00],
                ],
            ],

            [
                'id' => 4,
                'categoryId' => 'espresso',
                'name' => 'Espresso',
                'subtitle' => 'Single Shot',
                'price' => 120.00,
                'rating' => 4.9,
                'reviews' => 98,
                'isPopular' => false,
                'isSpecial' => false,
                'imageUrl' => 'http://localhost:8000/images/drinks/drinks6.png',
                'description' => 'Pure concentrated shot of 100% Arabica beans with a thick, golden crema.',
                'sizes' => [
                    ['id' => 'single', 'label' => 'Single', 'oz' => '1 oz', 'extra' => 0.00],
                    ['id' => 'double', 'label' => 'Double', 'oz' => '2 oz', 'extra' => 35.00],
                ],
                'milks' => [],
                'extras' => [
                    ['id' => 'extra_shot', 'name' => 'Extra Shot', 'price' => 40.00],
                ],
            ],

            [
                'id' => 5,
                'categoryId' => 'dessert',
                'name' => 'Pudding',
                'subtitle' => 'Creamy & Delightful',
                'price' => 60.00,
                'rating' => 4.8,
                'reviews' => 102,
                'isPopular' => true,
                'isSpecial' => false,
                'imageUrl' => 'http://localhost:8000/images/desserts/dessert1.png',
                'description' => 'A smooth and creamy pudding with a rich, sweet flavor and a silky texture, perfect for a satisfying dessert.',
                'sizes' => [],
                'milks' => [],
                'extras' => [
                    ['id' => 'extra_topping', 'name' => 'Extra Topping', 'price' => 15.00],
                ],
            ],

            [
                'id' => 6,
                'categoryId' => 'dessert',
                'name' => 'Red Velvet Cake',
                'subtitle' => 'Rich & Velvety',
                'price' => 120.00,
                'rating' => 4.9,
                'reviews' => 112,
                'isPopular' => false,
                'isSpecial' => false,
                'imageUrl' => 'http://localhost:8000/images/desserts/dessert2.png',
                'description' => 'A moist red velvet cake layered with smooth cream cheese frosting, offering a rich cocoa flavor and a perfectly sweet finish.',
                'sizes' => [],
                'milks' => [],
                'extras' => [
                    ['id' => 'extra_topping', 'name' => 'Extra Topping', 'price' => 20.00],
                ],
            ],

            [
                'id' => 7,
                'categoryId' => 'dessert',
                'name' => 'Pancake',
                'subtitle' => 'Fluffy & Golden',
                'price' => 55.00,
                'rating' => 4.7,
                'reviews' => 99,
                'isPopular' => false,
                'isSpecial' => false,
                'imageUrl' => 'http://localhost:8000/images/desserts/dessert3.png',
                'description' => 'A stack of fluffy golden pancakes drizzled with sweet maple syrup and topped with a smooth pat of butter.',
                'sizes' => [],
                'milks' => [],
                'extras' => [
                    ['id' => 'extra_topping', 'name' => 'Extra Topping', 'price' => 15.00],
                ],
            ],

            [
                'id' => 8,
                'categoryId' => 'dessert',
                'name' => 'Waffle',
                'subtitle' => 'Crispy & Golden',
                'price' => 65.00,
                'rating' => 4.7,
                'reviews' => 95,
                'isPopular' => false,
                'isSpecial' => false,
                'imageUrl' => 'http://localhost:8000/images/desserts/dessert4.png',
                'description' => 'Golden Belgian-style waffles with a crisp exterior and soft center, finished with a generous drizzle of sweet maple syrup.',
                'sizes' => [],
                'milks' => [],
                'extras' => [
                    ['id' => 'extra_topping', 'name' => 'Extra Topping', 'price' => 15.00],
                ],
            ],
        ];

        if ($categoryId && $categoryId !== 'all') {
            return array_values(
                array_filter(
                    $items,
                    fn($item) => $item['categoryId'] === $categoryId
                )
            );
        }

        return $items;
    }

    public static function findMenuItem(int $id): ?array
    {
        $items = self::getMenuItems();

        foreach ($items as $item) {
            if ($item['id'] === $id) {
                return $item;
            }
        }

        return null;
    }

    public static function getPromotions(): array
    {
        return [
            [
                'id' => 'promo_morning',
                'code' => 'COFFEE20',
                'title' => '20% OFF Good Morning Coffee',
                'subtitle' => 'Valid on all Cappuccino and Lattes',
                'discountPercent' => 20,
            ],
        ];
    }
}