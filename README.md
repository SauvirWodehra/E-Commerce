<div align="center">
  <h1>🛒 Amazon Clone</h1>
  <p><strong>Scaler SDE Intern Fullstack Assignment</strong></p>
  <p>A full-stack e-commerce web application replicating Amazon's design, user experience, and core functionality.</p>
</div>

---

## 🌐 Live Demo
**👉 [https://sauvir-amazon-clone.vercel.app](https://sauvir-amazon-clone.vercel.app)**

---

## 👨‍💻 About the Author
* **LinkedIn:** [Add your LinkedIn URL here]
* **GitHub:** [Add your GitHub URL here]
* **Portfolio/Coding Profile:** [Add your Portfolio URL here]

---

## 🚀 Features

This project implements all core assignment requirements with high visual fidelity to Amazon, plus additional bonus features.

### 🛍️ Core E-Commerce Flow
* **Product Listing Page:** Structured grid matching Amazon's UI, product cards with "Add to Cart", functional search bar, and category filtering.
* **Product Detail Page:** Automatic image carousel, complete descriptions, technical specifications, dynamic inventory status, and functional "Add to Cart" / "Buy Now" buttons.
* **Shopping Cart:** Dedicated cart view with subtotal calculation, quantity adjustment, and item removal.
* **Order Placement & Checkout:** Multi-step checkout with pre-filled shipping address, order review, payment method selection, and real-time database order creation.
* **Order Confirmation:** Post-checkout confirmation screen displaying the generated Order ID and visual status indicators.

### 🌟 Bonus Features Built
* **Real Authentication (2-Step OTP):** Secure JWT-based login/registration with real OTP verification via email.
* **Email Notifications:** Integrated Nodemailer with real SMTP to send Registration OTPs, Login OTPs, Welcome emails, Login alerts, and Order Cancellation notifications.
* **Stripe Payment Gateway:** Integrated Stripe checkout flow. 
* **Wishlist System:** DB-persisted wishlist with heart-icon toggles and a dedicated wishlist management page.
* **Order Management:** Dedicated Orders page for users to view order history and cancel active orders (which triggers real email notifications and stock restoration).

---

## 💻 Tech Stack

**Frontend:**
* React.js (Vite)
* React Router DOM (Navigation)
* Vanilla CSS (BEM Methodology for styling)
* Context API (Global State Management for Auth, Cart, Wishlist)

**Backend:**
* Node.js & Express.js
* PostgreSQL (node-postgres `pg` library)
* JSON Web Tokens (JWT) for secure authentication
* bcryptjs (Password hashing)
* Nodemailer (Email services)
* Stripe SDK (Payments)

**Deployment & Hosting:**
* **Frontend & Backend:** Vercel (Serverless Functions)
* **Database:** Neon (Serverless PostgreSQL)

---

## ⚙️ Setup Instructions

### Prerequisites
1. **Node.js** (v18+ recommended)
2. **PostgreSQL** (Running locally on port 5432)

### 1. Database Setup
1. Open pgAdmin or your terminal (`psql`) and create a database named `sde_ecommerce`:
   ```sql
   CREATE DATABASE sde_ecommerce;
   ```
2. Run the SQL scripts located in the `backend/database/` folder in this exact order to build the schema and seed realistic Amazon product data:
   * `schema.sql` (Creates tables)
   * `seed.sql` (Inserts initial products)
   * `add_specs.sql` (Adds technical specifications)
   * `migration_phase3.sql` (Adds OTP, Wishlist, and Order schemas)
   * `migration_phase4.sql` (Adds payment method columns)

*Note: If your PostgreSQL runs on a custom port or requires a specific username (other than `postgres`), you will need to update those values in the `.env` file in the next step.*

### 2. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure Environment Variables:
   * Copy the example environment file:
     ```bash
     cp .env.example .env
     ```
   * Open `.env` and fill in your PostgreSQL `DB_PASSWORD`.
   * (Optional) Add your Gmail App Password for real emails, or leave blank to fallback to Ethereal/test mode.
4. Start the backend server:
   ```bash
   npm run dev
   ```
   *The API will run on `http://localhost:5000`.*

### 3. Frontend Setup
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The application will run on `http://localhost:5173`.*

---

## 🧠 Assumptions & Design Decisions

1. **Authentication:** While the assignment stated a default user could be assumed, a fully functioning JWT + Email OTP authentication system was built to provide a realistic end-to-end e-commerce experience.
2. **Payment Simulation:** The Stripe integration is built to automatically detect expired/placeholder keys. If real Stripe keys aren't provided, the backend falls back to a secure "Simulation Mode" that successfully processes the order and returns a realistic `pi_test_...` token so the user flow is never blocked during evaluation.
3. **Email Delivery:** The email service uses a real Gmail SMTP account. If Google blocks the connection (due to location changes or security flags), the system automatically falls back to **Ethereal Email** to prevent server crashes, ensuring the app remains testable.
4. **Database:** Transactions (`BEGIN` / `COMMIT`) are used during order placement and cancellation to ensure data integrity between orders, order items, and inventory stock levels.

---

<div align="center">
  <p>Built with ❤️ for Scaler</p>
</div>
