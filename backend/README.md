# DripKart Backend

Node.js + Express + MongoDB API for the DripKart storefront.

## Quick start

```bash
npm install
cp .env.example .env   # edit MONGODB_URI if needed
npm run seed           # optional — also auto-seeds on first server start
npm run dev            # http://localhost:5000
```

**Default admin** (created by seed / auto-seed):

- Email: `admin@dripkart.com`
- Password: `admin123` (override with `ADMIN_PASSWORD` in `.env`)

## Environment

| Variable | Description |
|----------|-------------|
| `PORT` | API port (default `5000`) |
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | JWT signing secret |
| `CLIENT_ORIGIN` | Frontend URL for CORS |
| `ADMIN_EMAIL` | Admin account email |
| `ADMIN_PASSWORD` | Admin account password |

## API reference

Base URL: `http://localhost:5000/api`

See [TESTING.md](TESTING.md) for browser tests and React `fetch` / `axios` examples.

### Health & content

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/` | — | Root text: "Backend is running successfully" |
| GET | `/test` | — | JSON test: `{ "message": "API working successfully" }` |
| GET | `/health` | — | Health check |
| GET | `/content` | — | Stats, inspiration, perks, testimonials |

### Auth

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/register` | — | Create account |
| POST | `/auth/login` | — | Sign in → JWT |
| GET | `/auth/me` | User | Current session + cart/wishlist |

### Products

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/products` | — | List (`category`, `search`, `sort`, `filter`) |
| GET | `/products/categories` | — | Category counts |
| GET | `/products/:id` | — | Single product |
| GET | `/products/:id/details` | — | Extended product details |

**Sort values:** `featured`, `price-low`, `price-high`, `rating`

### Outfits

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/outfits` | — | Outfit sets (`?type=Tracksuit`) |
| GET | `/outfits/:setId` | — | Single outfit set |

### Orders

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/orders` | Optional | Place order (clears user cart if logged in) |
| GET | `/orders` | User | Your order history |
| GET | `/orders/track/:orderId` | — | Track by ID |
| GET | `/orders/lookup?orderId=&email=` | — | Track with optional email verify |

### User data

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| PUT | `/users/cart` | User | Sync cart |
| PUT | `/users/wishlist/products` | User | Sync product favourites |
| PUT | `/users/wishlist/outfits` | User | Sync outfit favourites |
| PUT | `/users/profile` | User | Update name |

### Newsletter

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/newsletter` | — | Subscribe email |

### Admin (requires admin JWT)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/admin/stats` | Dashboard metrics |
| GET | `/admin/orders` | All orders (`?status=shipped`) |
| PATCH | `/admin/orders/:orderId/status` | Update order status |
| GET | `/admin/products` | All products |
| POST | `/admin/products` | Add product |
| PATCH | `/admin/products/:legacyId` | Update product |
| DELETE | `/admin/products/:legacyId` | Delete product |
| GET | `/admin/users` | List shoppers |

**Order statuses:** `placed` → `processing` → `shipped` → `out_for_delivery` → `delivered`

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start with file watch |
| `npm start` | Production start |
| `npm run seed` | Seed DB (skips if data exists) |
| `npm run seed -- --force` | Wipe & re-seed products/outfits |

## Project layout

```
src/
  config/db.js
  data/           # catalog, content, product details
  models/         # User, Product, Order, OutfitSet, Newsletter
  middleware/     # auth, admin, errors
  routes/         # API route modules
  scripts/seed.js
  utils/          # autoSeed, formatters
  index.js
```
