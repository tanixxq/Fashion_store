# Super Kicks / DripKart — Next 6 features

## 1. Single product API

**Route:** `GET /api/products/:id`

**File:** `backend/src/routes/products.routes.js`

```bash
curl http://localhost:5000/api/products/1
```

**Response:**

```json
{
  "success": true,
  "product": {
    "id": 1,
    "name": "Core Cotton Tee",
    "price": 999,
    "image": "...",
    "category": "T-Shirts",
    "description": "..."
  }
}
```

---

## 2. Product Details page (React)

**File:** `frontend/src/pages/ProductDetailPage.jsx`

- Fetches `GET /api/products/:id`
- Shows image, price, description, size picker
- **Add to Cart** uses Context API

Open from shop: click any product card → `page = "product-detail"`.

---

## 3. Cart — Context API

**File:** `frontend/src/context/CartContext.jsx`

| Function | Purpose |
|----------|---------|
| `addToCart(product, size)` | Add or increase qty |
| `updateCartQty(id, delta)` | +/- quantity |
| `removeFromCart(id)` | Remove line |
| `cartTotal` | Sum of price × qty |
| `cartCount` | Total items |

Wrapped in `main.jsx`:

```jsx
<CartProvider>
  <App />
</CartProvider>
```

Use anywhere: `const { addToCart, cart } = useCart();`

---

## 4. Cart page

**File:** `frontend/src/pages/CartPage.jsx`

- List items with image, name, price
- **− / +** quantity buttons
- **Remove** button
- **Order summary** with total
- **Proceed to Checkout** (requires login)

Header **Bag** button → Cart page.

---

## 5. Auth backend

**File:** `backend/src/routes/auth.routes.js`

| Route | Method | Description |
|-------|--------|-------------|
| `/api/auth/register` | POST | Signup + bcrypt hash |
| `/api/auth/login` | POST | Login → JWT |
| `/api/auth/me` | GET | Current user (Bearer token) |

**Password:** hashed with `bcrypt.hash(password, 10)`  
**Token:** `jwt.sign({ sub: userId }, JWT_SECRET, { expiresIn: "7d" })`

**Test register:**

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","password":"1234"}'
```

---

## 6. Frontend auth

**Files:**

- `frontend/src/context/AuthContext.jsx` — login, register, logout, JWT in `localStorage`
- `frontend/src/pages/LoginPage.jsx`
- `frontend/src/pages/SignupPage.jsx`
- `frontend/src/components/ProtectedRoute.jsx` — blocks checkout if not logged in

**JWT storage:** `localStorage.setItem("dripkart_token", token)`

**Fetch with token:**

```javascript
headers: { Authorization: `Bearer ${token}` }
```

**Protected checkout:** wrapped in `<ProtectedRoute user={user} onLogin={() => setPage("login")}>`.

---

## Run & test

```bash
# Terminal 1
cd backend && npm run dev

# Terminal 2
cd frontend && npm run dev
```

1. Shop → click product → detail page  
2. Add to cart → Bag → adjust qty → Checkout  
3. Sign up → Login → Checkout (protected)
