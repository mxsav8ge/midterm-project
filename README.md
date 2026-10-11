# Brew & Bite — Frontend

A mobile-friendly cafe ordering application built with **React Native and Expo**. The frontend connects to a Laravel REST API using Axios and supports running in Expo Go on a physical Android phone or in a web browser.

## Project Overview

Brew & Bite allows users to browse cafe products, view item details, customize orders, manage their cart, apply promotional vouchers, and submit simulated orders.

### Technology Stack

- **React Native** — mobile user interface
- **Expo** — development and testing
- **Axios** — HTTP requests to the Laravel API
- **React Context API** — cart state management
- **Lucide React Native** — icons
- **React Native SVG** — SVG support
- **Laravel REST API** — JSON data and simulated order processing

The project uses mock data returned directly as JSON. A database is not required.

## Requirements

Install the following before running the project:

- Node.js and npm
- PHP and Composer for the Laravel backend
- Expo Go on your Android phone, if testing on a physical device

## Installation

From the repository root, open a terminal and run:

```powershell
cd frontend
npm install
```

## Running the Application

### 1. Start the Laravel Backend

Open a separate terminal from the repository root:

```powershell
cd backend
php artisan serve --host=0.0.0.0 --port=8000
```

Keep the backend terminal running.

### 2. Configure the API Server Address

Open:

`frontend/src/config/server.js`

The frontend uses the server configuration to construct its API base URL.

- **Expo Web:** Uses `localhost` when the browser and Laravel backend run on the same computer.
- **Expo Go:** Uses the local IPv4 address of the computer running Laravel.

To find your computer's IPv4 address on Windows, run:

```powershell
ipconfig
```

Find the IPv4 address of the network connection you are using, then update the LAN IP in `server.js` if necessary.

For example, if your computer's address is `192.168.0.123`, the API base URL on your phone should be:

`http://192.168.0.123:8000/api`

Your phone and computer should be connected to the same local network, and the computer's firewall must allow access to port `8000`.

**Important:** Do not use `localhost` or `127.0.0.1` as the backend address for Expo Go on a physical phone. Those addresses refer to the phone itself.

### 3. Start Expo

Open another terminal:

```powershell
cd frontend
npx expo start
```

- **For Expo Go:** Scan the QR code with Expo Go on your phone.
- **For Web:** Press `w` in the Expo terminal if web support is available.

Keep both the Laravel backend and Expo development server running while testing.

## API Endpoints

The frontend communicates with the Laravel backend through Axios.

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/health` | Checks API availability |
| GET | `/api/store-info` | Retrieves store information |
| GET | `/api/categories` | Retrieves menu categories |
| GET | `/api/menu` | Retrieves menu items |
| GET | `/api/menu/{id}` | Retrieves details for a menu item |
| GET | `/api/promotions` | Retrieves promotions and vouchers |
| POST | `/api/orders` | Submits a simulated order |

The menu endpoint supports a category filter, such as `?category=burgers`, when supported by the backend.

## Frontend Structure

Important project files and folders include:

- `App.js` — main application component
- `app.json` — Expo configuration
- `index.js` — application entry point
- `assets/` — images, fonts, and other static assets
- `src/api/` — Axios client and API request configuration
- `src/config/` — shared server configuration
- `src/utils/` — helper utilities, including image URL handling
- `src/` — application screens, components, and supporting code

## Troubleshooting

### API connection fails on a physical phone

1. Confirm that Laravel is running on port `8000`.
2. Check the computer's current IPv4 address.
3. Update `frontend/src/config/server.js` with the correct address.
4. Confirm that your phone and computer are on the same network.
5. Check that the firewall allows connections to port `8000`.

### Product images do not appear

Confirm that the Laravel image files exist under the backend's public image directory and that the image URLs are reachable from the device running the app.

The frontend image URL helper can replace localhost-based image URLs on Android with the configured server address.

### Expo does not start

From the frontend directory, run:

```powershell
npm install
npx expo start
```

If dependencies are missing, check the terminal output before changing package versions.

## Notes

- This project is intended for development and academic demonstration.
- Orders use a simulated checkout flow.
- The application does not require a database for its mock API data.
- When moving the project to another computer, configure the LAN IP for physical-phone testing.
