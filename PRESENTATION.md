# 🎤 Midterm Demo Presentation Walkthrough

**Guide for the 5-member team during the midterm presentation.**

---

## 1. Introduction (Member 1 - Lead)
- Introduce the team and project concept: **Velvet Brew & Burger Co.**
- Explain the constraints: We built a fully decoupled system (React Native + Laravel) **without a database**, relying entirely on structured JSON APIs.
- Briefly mention the tech stack (Expo, Axios, Laravel).

## 2. Architecture & Data Flow (Member 2)
- Show the `DATA_FLOW.md` concepts.
- Explain how the Frontend and Backend are completely separate.
- Mention the `MockDataRepository` in Laravel and how it perfectly mimics database queries.

## 3. Live App Demo - Discovery Phase (Member 4)
- **Action:** Open the App on the Emulator.
- Show the **Onboarding Screen** and navigate to the **Home Screen**.
- Point out dynamic elements:
  - The greeting pulls from `/api/store-info`
  - The categories load dynamically from `/api/categories`
- **Action:** Navigate to the **Menu Screen**.
- Show how filtering by category works.

## 4. Live App Demo - Ordering Phase (Member 5)
- **Action:** Tap an item to open the **Item Detail Screen**.
- Explain how modifiers (sizes, milk, extras) change the price dynamically.
- **Action:** Add the item to the cart. Point out the badge on the bottom tab updating (thanks to Context API).
- **Action:** Open the **Cart Screen**. Apply the promo code `COFFEE20`.
- **Action:** Proceed to **Checkout Screen**, select "Express Delivery".
- **Action:** Tap "Place Order".

## 5. API Integration & Conclusion (Member 3)
- Explain what just happened under the hood: The app sent a `POST` request to Laravel.
- Show the **Order Tracking Screen** (which uses the returned JSON receipt from Laravel).
- Conclude the presentation by emphasizing system scalability: To add a real database later, we only change Laravel's Repository layer; the frontend remains untouched.
- Open the floor for questions from the instructor.
