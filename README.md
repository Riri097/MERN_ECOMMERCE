# MERN Ecommerce Platform

A fully featured e-commerce platform built with the MERN stack (MongoDB, Express, React, Node.js). This application includes a complete shopping cart, user reviews, admin dashboard, and order management system.

## Features

### User Features

- **Product Browsing:**
  - View all products with pagination.
  - Search for products by keyword.
  - Filter products by category.
  - Sort products by top ratings and new arrivals.
- **Shopping Cart:**
  - Add/remove items to cart.
  - Adjust quantities.
- **Checkout Process:**
  - Login/Register (JWT Authentication).
  - Shipping address entry.
  - Payment method selection.
  - Order summary and placement.
- **User Profile:**
  - Update user details.
  - View order history and status.
- **Reviews:**
  - Rate and review products.

### Admin Features

- **Dashboard:**
  - overview of total sales, orders, and users.
  - Visual charts for daily revenue and order trends.
  - Low stock alerts.
- **Product Management:**
  - List, create, edit, and delete products.
  - Upload product images.
- **Order Management:**
  - View all orders.
  - Mark orders as **Paid** (Simulated Payment flow).
  - Mark orders as **Delivered**.
- **User Management:**
  - View all users.
  - Edit user details (promote to admin).
  - Delete users.

## Tech Stack

- **Frontend:** React.js, Redux Toolkit (State Management), React Router v6, Tailwind CSS.
- **Backend:** Node.js, Express.js.
- **Database:** MongoDB, Mongoose.
- **Authentication:** JSON Web Tokens (JWT).
- **Tooling:** Vite/Create React App, Concurrent support for running dev servers.

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (Local or Atlas URI)

### Installation

1. **Clone the repository:**

   ```bash
   git clone <repository_url>
   cd MERN_ECOMMERCE
   ```

2. **Install Root/Backend Dependencies:**

   ```bash
   npm install
   ```

3. **Install Frontend Dependencies:**
   ```bash
   cd frontend
   npm install
   cd ..
   ```

### Environment Configuration

Create a `.env` file in the root directory and add the following variables:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=<your_mongodb_connection_string>
JWT_SECRET=<your_jwt_secret>

# Pagination
PAGINATION_LIMIT=4

# Email Service (for password resets/notifications if enabled)
EMAIL_USER=<your_email_address>
EMAIL_PASS=<your_email_password>
```

### Running the Application

**Development Mode (Run Backend & Frontend Concurrently):**

```bash
npm run dev
```

- Frontend runs on: `http://localhost:3000` (proxied to 5000)
- Backend runs on: `http://localhost:5000`

## Project Structure

```
├── backend/
│   ├── config/         # Database configuration
│   ├── controllers/    # Route controllers (Order, Product, User)
│   ├── middleware/     # Auth and Error handling middleware
│   ├── models/         # Mongoose models
│   ├── routes/         # API routes
│   ├── utils/          # Helper functions (Token generation, Email)
│   └── server.js       # Entry point
├── frontend/
│   ├── public/
│   └── src/
│       ├── assets/     # Static assets
│       ├── components/ # Reusable UI components
│       ├── screens/    # Page views (Admin & User)
│       ├── slices/     # Redux Toolkit slices & API endpoints
│       └── utils/      # Client-side utilities
├── uploads/            # Uploaded product images
└── package.json        # Root scripts and backend dependencies
```

## API Endpoints

### Products

- `GET /api/products` - Fetch all products
- `GET /api/products/:id` - Fetch single product
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)
- `POST /api/products/:id/reviews` - Create review

### Users

- `POST /api/users/login` - Authenticate user
- `POST /api/users` - Register user
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `GET /api/users` - Get all users (Admin)

### Orders

- `POST /api/orders` - Create new order
- `GET /api/orders/:id` - Get order details
- `PUT /api/orders/:id/pay` - Mark order as paid
- `PUT /api/orders/:id/deliver` - Mark order as delivered (Admin)
- `GET /api/orders/myorders` - Get logged in user's orders
- `GET /api/orders` - Get all orders (Admin)

