# DripKart — Production roadmap

## Current status (already built)

| Feature | Status | Location |
|---------|--------|----------|
| JWT auth + bcrypt | Done | `backend/src/routes/auth.routes.js` |
| Persistent login | Done | `localStorage` + `AuthContext` |
| Protected routes | Done | `ProtectedRoute.jsx`, `/cart`, `/checkout`, `/profile` |
| Cart + API sync | Done | `CartContext`, `PUT/GET/POST /api/cart` |
| Product detail | Done | `ProductDetailPage.jsx`, `GET /api/products/:id` |
| Search / filter / sort | Done | `ShopPage.jsx`, home catalog in `App.jsx` |
| Wishlist | Done | `syncUserData`, favourites page |
| Order tracking | Done | `TrackOrderPage`, `GET /api/orders` |
| Admin API | Done | `backend/src/routes/admin.routes.js` |
| Premium UI + motion | Done | `premium.css`, Framer Motion |
| React Router URLs | Done | `navigation.js`, `BrowserRouter` |

## Target folder structure

```
Fashion_store/
├── backend/
│   ├── src/
│   │   ├── config/          # db.js
│   │   ├── middleware/      # auth, admin, errors
│   │   ├── models/          # User, Product, Order
│   │   ├── routes/          # auth, cart, orders, admin, payments
│   │   ├── utils/
│   │   └── index.js
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/             # client.js, admin.js
│   │   ├── components/      # ui/, ProtectedRoute, AdminRoute
│   │   ├── context/         # Auth, Cart
│   │   ├── hooks/
│   │   ├── pages/           # shop, cart, checkout, admin/
│   │   ├── styles/
│   │   └── App.jsx
│   ├── vercel.json
│   └── .env.production.example
├── docs/PRODUCTION.md
└── render.yaml
```

## Step-by-step implementation

### 1. Persistent login (JWT)

- Token: `localStorage.dripkart_token`
- Profile cache: `dripkart_user`
- On app load: `AuthContext` → `GET /api/auth/me`
- **Test:** Login → refresh page → still logged in

### 2. Protected routes

- `ProtectedRoute` redirects to `/login?state.from=...`
- Extend with `AdminRoute` for `/admin` (role `admin`)

### 3. Cart system

- Guest: localStorage
- Logged in: merge on login + debounced `PUT /api/cart`
- **Test:** Add items → login → cart persists in MongoDB

### 4. Product details

- Route: `/product/:id`
- API: `GET /api/products/:id`

### 5. Search, filter, sort

- `ShopPage` toolbar + `useProducts` hook
- Query params ready for backend: `?search=&category=&sort=`

### 6. Admin dashboard

- UI: `frontend/src/pages/admin/AdminDashboard.jsx`
- Login as `admin@dripkart.com` / `admin123` (after seed)
- APIs: `GET /api/admin/stats`, `/orders`, `/products` CRUD

### 7. Payments (Razorpay)

1. Create account at [razorpay.com](https://razorpay.com)
2. Add to `backend/.env`:
   ```
   RAZORPAY_KEY_ID=rzp_test_xxx
   RAZORPAY_KEY_SECRET=xxx
   ```
3. Add to `frontend/.env`:
   ```
   VITE_RAZORPAY_KEY_ID=rzp_test_xxx
   ```
4. Checkout → select **Razorpay** → pay → verify → order created

**Stripe (optional):** use `stripe` npm on backend + `@stripe/stripe-js` on frontend; mirror the same create-intent → confirm → create order flow.

### 8. Responsive UI

- Existing CSS uses `clamp()` and mobile grids
- Tailwind utilities enabled via `@import "tailwindcss"` for new components
- Test at 375px width in DevTools

### 9. Loading & errors

- `LoadingSpinner`, `ErrorMessage` components
- `[API]` logs in dev (`api/client.js`)

### 10. Deploy (Vercel + Render)

See sections below.

---

## Environment variables

### Backend (`backend/.env`)

| Variable | Required | Description |
|----------|----------|-------------|
| `PORT` | No | Default `5001` (avoid 5000 on macOS) |
| `MONGODB_URI` | Yes | Atlas connection string |
| `JWT_SECRET` | Yes | Long random string |
| `CLIENT_ORIGIN` | Yes | `https://your-app.vercel.app` |
| `RAZORPAY_KEY_ID` | For payments | Test/live key |
| `RAZORPAY_KEY_SECRET` | For payments | Secret |

### Frontend (Vercel)

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | `https://your-api.onrender.com/api` |
| `VITE_RAZORPAY_KEY_ID` | Razorpay public key |

---

## Deploy on Render (backend)

1. New **Web Service** → connect repo → root: `backend`
2. Build: `npm install`
3. Start: `npm start`
4. Env: `MONGODB_URI`, `JWT_SECRET`, `CLIENT_ORIGIN`, `PORT=10000`
5. Health check: `/api/health`

## Deploy on Vercel (frontend)

1. Import repo → root: `frontend`
2. Framework: Vite
3. Build: `npm run build` → output `dist`
4. Env: `VITE_API_URL=https://<render-service>.onrender.com/api`
5. `vercel.json` rewrites SPA routes to `index.html`

---

## Postman checklist

| Method | URL | Auth |
|--------|-----|------|
| POST | `/api/auth/register` | No |
| POST | `/api/auth/login` | No |
| GET | `/api/auth/me` | Bearer token |
| GET | `/api/products` | No |
| GET | `/api/cart` | Bearer |
| POST | `/api/orders` | Bearer (optional guest) |
| GET | `/api/admin/stats` | Bearer (admin) |

---

## Best practices

- Never commit `.env` files
- Use `httpOnly` cookies for tokens in a future hardening pass
- Rate-limit auth routes in production
- Validate all `req.body` on admin mutations
- Use Atlas IP allowlist `0.0.0.0/0` only for dev; restrict in prod
