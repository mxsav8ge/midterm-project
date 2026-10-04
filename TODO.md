# Project Todo List - Mobile Ordering System

**Course:** ADET — Midterm Project  
**Tech Stack:** React Native (Expo) + Axios + Laravel REST API (No Database, Pure JSON)  
**System Concept:** Food & Cafe Mobile Ordering System  
**Team Size:** 5 Members  

---

## 👥 Suggested Member Task Delegation (5 Members)

| Member | Primary Responsibility | Focus Area |
| :--- | :--- | :--- |
| **Member 1 (Lead / Backend)** | Laravel API Architecture & Core Endpoints | Mock datasets, routes, controllers, CORS configuration |
| **Member 2 (Frontend Architecture)** | Expo Setup & Navigation | Expo Router / React Navigation, theme, global state (Cart) |
| **Member 3 (API Integration)** | Axios Client & Service Layer | Base Axios config, IP addressing, API hook wrappers, error handling |
| **Member 4 (UI / Core Screens)** | Discovery & Browsing Screens | Home Screen, Menu Catalog Screen, Item Detail Screen |
| **Member 5 (UI / Order Screens)** | Checkout & Order Lifecycle | Cart / Checkout Screen, Order Status / Tracking Screen, Profile |

---

## 📋 Phase 1: Planning & Architecture
- [x] Define system theme & branding (*Velvet Brew & Burger Co.*)
- [x] Finalize the 5+ API endpoints and JSON contract structures
- [x] Define the 5+ mobile screens and user flow
- [x] Set up project repository with `backend/` and `frontend/` folders
- [x] Review project constraints (**strictly NO database**, pure JSON responses)

---

## 🚀 Phase 2: Laravel Backend Setup (No Database)
- [x] Initialize Laravel project in `backend/`
- [x] Configure `config/cors.php` to allow requests from Expo development devices
- [x] Create mock data source (`app/Repositories/MockDataRepository.php`):
  - Categories (Burgers, Drinks, Sides, Desserts)
  - Menu items (IDs, names, prices, images, descriptions, ratings, tags, modifiers)
  - Active promotions & banners
  - Store info & working hours
  - In-memory / mock order receipts
- [x] Create API controllers:
  - [x] `GET /api/store-info` (Endpoint 1: Store profile, announcements, hours)
  - [x] `GET /api/categories` (Endpoint 2: Food & beverage categories with Lucide icons)
  - [x] `GET /api/menu` (Endpoint 3: All menu items with category filtering)
  - [x] `GET /api/menu/{id}` (Endpoint 4: Single item details & add-ons)
  - [x] `GET /api/promotions` (Endpoint 5: Active vouchers & promo banners)
  - [x] `POST /api/orders` (Bonus Endpoint 6: Submit mock order & receive generated order receipt)
- [x] Test all endpoints via cURL / HTTP client
- [x] Verify endpoints strictly return direct JSON responses (`response()->json(...)`)

---

## 📱 Phase 3: React Native (Expo) Frontend Setup
- [x] Initialize Expo app in `frontend/`
- [x] Install dependencies:
  - `axios` (API client)
  - Navigation library (`@react-navigation/native`, `@react-navigation/bottom-tabs`, `@react-navigation/native-stack`)
  - Icons (`lucide-react-native`, `react-native-svg`)
  - Safe area handling (`react-native-safe-area-context`, `react-native-screens`)
- [x] Establish design tokens (`frontend/src/constants/theme.js`)
- [x] Create Axios client instance (`frontend/src/api/client.js`):
  - Configure `baseURL` with local development machine LAN IP (`192.168.254.109:8000/api`)
  - Set request timeouts and headers (`Accept: application/json`)
  - Add request/response interceptors for logging & user-friendly error handling
- [x] Implement Cart Context / State Management (`frontend/src/context/CartContext.js`)

---

## 🎨 Phase 4: Mobile Screen Development (5 Core Screens)
- [x] **Screen 1: Home / Discovery Screen (`HomeScreen.js`)**
  - Store greeting & store status badge (from `/api/store-info`)
  - Featured promo banner carousel (from `/api/promotions`)
  - Quick category horizontal pill list (from `/api/categories`)
  - "Popular Now" menu preview grid
- [x] **Screen 2: Menu / Catalog Screen (`MenuScreen.js`)**
  - Search bar with live search filtering
  - Category tabs for filtering menu items (from `/api/menu`)
  - Product cards (image, name, price, rating, add-to-cart button)
- [x] **Screen 3: Product Detail Screen / Modal (`ItemDetailScreen.js`)**
  - Item banner image, full description, nutritional badge (from `/api/menu/{id}`)
  - Modifier selections (size, ice level, extra toppings)
  - Quantity counter (+ / -)
  - "Add to Order" floating button updating global cart
- [x] **Screen 4: Cart & Checkout Screen (`CartScreen.js`)**
  - List of selected items with quantity adjusters and remove buttons
  - Order type selector (Dine-in / Takeaway / Delivery)
  - Bill breakdown (Subtotal, Tax, Delivery fee, Discount, Total)
  - "Submit Order" button posting to `/api/orders`
- [x] **Screen 5: Order Tracking / Receipt Screen (`OrderTrackingScreen.js`)**
  - Order confirmed status & banner
  - Generated Order ID and estimated preparation time
  - Interactive status stepper (Placed -> Preparing -> Ready for Pickup)
  - Itemized receipt breakdown and store pickup details

---

## 🔌 Phase 5: Frontend-to-Backend Integration
- [x] Test connectivity between physical phone/emulator and host machine IP
- [x] Connect Home Screen to `/api/store-info`, `/api/promotions`, and `/api/categories`
- [x] Connect Menu Screen to `/api/menu`
- [x] Connect Item Detail to `/api/menu/{id}`
- [x] Connect Checkout submission to `POST /api/orders`
- [x] Implement loading indicators (`ActivityIndicator`, skeleton states)
- [x] Implement fallback views for network errors and retry mechanisms

---

## 🧪 Phase 6: Testing, Polish & Team Alignment
- [x] Verify all 5 members understand the data flow (`React Native -> Axios -> Laravel API -> JSON -> React Native`)
- [x] Test on Android and/or iOS (via Expo Go app)
- [x] Validate edge cases (no network, empty cart, search with zero results)
- [x] Document setup instructions in `README.md`
- [x] Prepare midterm demo presentation & walkthrough
