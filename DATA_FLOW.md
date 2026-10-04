# 🔄 System Data Flow & Architecture

**For all 5 team members to review before the midterm presentation.**

This document explains exactly how data moves through our system from the moment a user opens the app to when they place an order.

---

## 1. The Big Picture

Our system uses a modern decoupled architecture:

- **Frontend (Expo):** Responsible *only* for displaying the UI and handling user interactions. It holds no persistent data.
- **Backend (Laravel):** The brain. It provides the data and processes logic.
- **Communication:** They talk strictly via RESTful APIs using standard JSON.

---

## 2. Step-by-Step Data Flow

### A. App Launch (Home Screen)
1. **Trigger:** User opens the app. `HomeScreen` mounts.
2. **Action:** The frontend uses `axios` to make 3 parallel `GET` requests:
   - `/api/store-info` (Gets name, location, greeting)
   - `/api/categories` (Gets coffee categories)
   - `/api/menu` (Gets "Popular Now" items)
3. **Response:** Laravel processes these, fetches from `MockDataRepository`, and returns standard JSON.
4. **Render:** The React Native state updates and paints the UI.

### B. Browsing & Customization
1. **Trigger:** User taps a coffee (e.g., "Caramel Latte").
2. **Action:** App navigates to `ItemDetailScreen` and calls `GET /api/menu/{id}`.
3. **Render:** Shows specific sizes, milk options, and extras for that item.
4. **Local State:** When the user selects "Large" and "Oat Milk", this is stored temporarily in the *local React component state*. No API call is made yet.

### C. Adding to Cart (Global State)
1. **Trigger:** User taps "Add to Cart".
2. **Action:** The local state (item + sizes + addons) is dispatched to the `CartContext`.
3. **Storage:** The `CartContext` acts as our global state manager, wrapping the entire app. It calculates the running subtotal and item count instantly without talking to the backend.

### D. Checkout & Order Placement
1. **Trigger:** User taps "Place Order" on the Checkout Screen.
2. **Action:** The frontend constructs a massive JSON payload containing customer details, selected delivery option, and the entire cart array.
3. **API Call:** It sends a `POST /api/orders` request via Axios.
4. **Backend Processing:**
   - Laravel validates the incoming JSON payload.
   - It generates a unique Order ID (`#ORD-XXXXXX`).
   - It calculates an estimated prep time.
   - It generates a final receipt JSON object.
5. **Final Step:** The frontend receives the 201 Created response containing the receipt and navigates to the `OrderTrackingScreen` to show the success state. The cart is cleared.

---

## 3. Key Concepts to Mention in the Demo

- **Why No Database?** We are strictly adhering to the midterm constraints. By using the Repository Pattern (`MockDataRepository`), we abstracted the data source. If we add a MySQL database in Finals, the frontend won't change at all, and the Controllers barely change.
- **Why Axios?** We needed interceptors for logging and centralizing the `BASE_URL` (using our LAN IP) so testing on physical phones works seamlessly.
- **Why Context API?** Passing cart data via screen parameters (props) gets messy. Context allows any screen (like the bottom tab bar badge) to see how many items are in the cart.
