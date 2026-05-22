# DripKart 👟🔥

DripKart is a modern fashion and sneaker e-commerce platform built for streetwear enthusiasts.  
Browse 110+ curated products, outfit sets, cart, checkout, favourites, and order tracking — powered by a full-stack React + Node.js + MongoDB architecture.

## 🚀 Features

- User Authentication (JWT)
- Product Listings (110+ items, 8 categories)
- Search, Filters & Sorting
- Shopping Cart & Wishlist (cloud sync when logged in)
- Secure Checkout & Order Tracking
- Newsletter subscriptions
- Admin API (orders, products, users, analytics)
- Responsive UI

## 🛠️ Tech Stack

| Layer | Stack |
|-------|-------|
| Frontend | React 19, Vite, custom CSS |
| Backend | Node.js, Express 5 |
| Database | MongoDB, Mongoose |

## 📁 Project Structure

```
frontend/   → React storefront
backend/    → REST API (/api)
```

## ▶️ Run the full stack

### Prerequisites

- Node.js 18+
- MongoDB (local or [Atlas](https://www.mongodb.com/cloud/atlas))

### 1. Install everything

```bash
npm run install:all
```

### 2. Backend

```bash
cd backend
cp .env.example .env    # set MONGODB_URI if needed
npm run seed            # optional — auto-seeds on first start
npm run dev             # http://localhost:5001 (see backend/.env PORT)
```

### 3. Frontend (new terminal)

```bash
npm run dev:frontend    # http://localhost:5173
```

Or from the repo root:

```bash
npm run dev:backend     # terminal 1
npm run dev:frontend    # terminal 2
```

The frontend calls `http://localhost:5001/api` (see `frontend/.env`).  
Vite also proxies `/api` → the backend port in `vite.config.js`.  
On macOS, **do not use port 5000** for the API — AirPlay often returns **403 Forbidden**.

If the API is offline, the storefront falls back to built-in static data.

### Admin access

After seeding:

- **Email:** `admin@dripkart.com`
- **Password:** `admin123`

Use the JWT from `POST /api/auth/login` for admin endpoints (`/api/admin/*`). See [backend/README.md](backend/README.md).

## 📖 Documentation

- [Production roadmap & deployment](docs/PRODUCTION.md)
- [Backend API reference](backend/README.md)

### Cart drawer

Click **Bag** in the navbar to open the slide-out cart (add to cart opens it automatically). Full page at `/cart`.

### Admin dashboard

Login: `admin@dripkart.com` / `admin123` → Profile → **Admin dashboard** or visit `/admin`  
Analytics charts, order management, product CRUD, user list.

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for cart/admin structure.  
**Deploy:** [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) (Render + Vercel + Atlas step-by-step) · **Env:** `frontend/src/config/env.js`

### Payments (Razorpay)

Add `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` to `backend/.env`. Without keys, checkout uses **mock** Razorpay for development.

## 👨‍💻 Author

Tanishq Singhhal
