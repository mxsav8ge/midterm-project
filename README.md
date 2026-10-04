# Velvet Brew & Burger Co. - Mobile Ordering System

**Course:** ADET — Midterm Project  
**Architecture:** React Native (Expo) ➔ Axios ➔ Laravel REST API (No Database, Pure JSON) ➔ React Native  
**Icon Library:** Lucide Icons (`lucide-react-native`)  
**Team Size:** 5 Members  

---

## 📱 Project Overview

A fast-casual Food & Cafe Mobile Ordering Application connecting a **React Native (Expo)** mobile frontend to a **Laravel REST API** using **Axios**. 

Per project requirements:
- **No database required**: All mock data is held in-memory and returned as clean JSON.
- **6 REST API Endpoints** (Exceeds the 5 required).
- **5 Mobile Screens** with full browsing, cart, and simulated checkout flow.
- Built-in network support for testing on physical mobile phones via **Expo Go** or in a web browser.

---

## 🛠️ Tech Stack

- **Mobile Client:** React Native with Expo (SDK 57)
- **Networking:** Axios API Client with custom interceptors & error handlers
- **UI & Icons:** Vanilla React Native Stylesheet, `lucide-react-native`, `react-native-svg`
- **State Management:** React Context API (`CartContext`)
- **Backend:** Laravel 9 (PHP 8.0) REST API returning direct JSON
- **Data Persistence:** In-memory repository (No DB required)

---

## ⚡ Quick Start Guide (Using PowerShell Scripts)

To get the full stack environment running, open three separate PowerShell windows and run the following commands:

### 1. Start the Android Emulator
From the project root directory, run:
```powershell
.\start-emulator.ps1
```
*(Wait for the Android device to fully boot up before proceeding to step 3).*

### 2. Start the Laravel Backend API
Open a new terminal, navigate to the `backend` folder, and run:
```powershell
cd backend
.\dev.ps1
```
*(This uses a custom Artisan command to start the API on `0.0.0.0:8000` so the emulator can reach it).*

### 3. Start the React Native (Expo) Frontend
Open a third terminal, navigate to the `frontend` folder, and run:
```powershell
cd frontend
npx expo start --android
```
*(The `--android` flag automatically opens the project on your running emulator).*

---

## 🌐 API Endpoints Summary

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Health-check endpoint verifying API server is online |
| `GET` | `/api/store-info` | Store name, tagline, hours, rating, and announcements |
| `GET` | `/api/categories` | Food and beverage category list with Lucide icon keys |
| `GET` | `/api/menu` | All menu items (supports `?category=burgers` query filter) |
| `GET` | `/api/menu/{id}` | Single item details, size options, and customizable add-ons |
| `GET` | `/api/promotions` | Active discount vouchers & promo banners |
| `POST` | `/api/orders` | Places a simulated order and returns an itemized receipt |

---

## 📱 Mobile Screens

1. **Home Screen (`HomeScreen.js`)**: Store header, live store status pill, exclusive deal banners, category switcher, and bestselling favorites with quick add.
2. **Menu Catalog (`MenuScreen.js`)**: Real-time search bar, category filter tabs, item count indicator, and product cards.
3. **Item Detail Screen (`ItemDetailScreen.js`)**: Food hero image, description, portion size radio selector, add-on checkboxes, quantity adjuster, and floating Add-to-Order bar.
4. **Cart & Checkout Screen (`CartScreen.js`)**: Dine-in / Takeaway / Delivery selector, item quantity adjusters, discount voucher input (`MIDTERM20` or `STUDENT10`), payment breakdown, and Submit Order button.
5. **Order Tracking Screen (`OrderTrackingScreen.js`)**: Celebratory confirmation, order code, animated kitchen status stepper (Received ➔ In Kitchen ➔ Ready for Pickup), and full itemized receipt.

---

## 📡 Mobile Network Configuration

If your computer's IP address changes when switching Wi-Fi networks:
1. Run `ipconfig` (Windows) or `ifconfig` (Mac/Linux).
2. Note your **IPv4 Address** (e.g. `192.168.1.XX`).
3. Update `DEFAULT_LAN_IP` in `frontend/src/api/client.js`.
