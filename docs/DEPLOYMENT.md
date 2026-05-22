# DripKart — Full production deployment (Render + Vercel + Atlas)

Follow these steps in order. Replace placeholders with your real URLs.

| Placeholder | Your value |
|-------------|------------|
| `YOUR-API` | e.g. `dripkart-api.onrender.com` |
| `YOUR-APP` | e.g. `dripkart.vercel.app` |

---

## Phase 0 — Pre-flight (local)

```bash
cd frontend && npm run build
cd backend && npm start
```

Build must pass. Backend health: `curl http://localhost:5001/api/health`

---

## Phase 1 — MongoDB Atlas

1. [cloud.mongodb.com](https://cloud.mongodb.com) → **Create cluster** (M0 free tier is fine).
2. **Database Access** → Add user with password (save password).
3. **Network Access** → **Add IP Address** → **Allow Access from Anywhere** (`0.0.0.0/0`)  
   Required for Render (dynamic IPs). For stricter security, use Render static outbound IPs on paid plans.
4. **Connect** → Drivers → copy connection string:
   ```
   mongodb+srv://USER:PASSWORD@cluster0.xxxxx.mongodb.net/dripkart?retryWrites=true&w=majority
   ```
5. Replace `<password>` with URL-encoded password (`@` → `%40`, etc.).

**Verify:** In Atlas → Collections, after first deploy you should see `users`, `products`, `orders`.

---

## Phase 2 — Deploy backend (Render)

### Create service

1. [dashboard.render.com](https://dashboard.render.com) → **New +** → **Web Service**
2. Connect GitHub repo `Fashion_store`
3. Settings:

| Setting | Value |
|---------|--------|
| **Name** | `dripkart-api` |
| **Root Directory** | `backend` |
| **Runtime** | Node |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |
| **Health Check Path** | `/api/health` |

### Environment variables (Render → Environment)

```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://YOUR_USER:YOUR_PASS@cluster.mongodb.net/dripkart?retryWrites=true&w=majority
JWT_SECRET=PASTE_64_CHAR_RANDOM_STRING_HERE
CLIENT_ORIGIN=https://YOUR-APP.vercel.app
ALLOW_VERCEL_PREVIEWS=true
ADMIN_EMAIL=admin@dripkart.com
ADMIN_PASSWORD=your-secure-admin-password
```

**Razorpay (test mode first):**

```env
RAZORPAY_KEY_ID=rzp_test_xxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxx
```

(`RAZORPAY_SECRET` works as an alias for `RAZORPAY_KEY_SECRET`.)

**Do not set `PORT` manually** — Render injects it automatically.

### Generate JWT_SECRET

```bash
openssl rand -base64 48
```

Never commit this value. Never use `change-in-production` or `dev-secret` in production.

### Deploy & verify

1. Click **Deploy** → wait for **Live** (free tier cold start: 30–60s).
2. Test:

```bash
curl https://YOUR-API.onrender.com/api/health
# Expected: {"ok":true,"database":"connected",...}

curl https://YOUR-API.onrender.com/api/products
# Expected: JSON with products array
```

3. Render **Logs** should show:
   - `[CORS] Allowed origins: https://YOUR-APP.vercel.app`
   - `MongoDB connected ✅`

### Render cold starts

- Free tier spins down after ~15 min idle.
- First request after sleep returns **502/503** for ~30–60s — **retry**.
- Mitigations: upgrade plan, use [cron-job.org](https://cron-job.org) to ping `/api/health` every 14 min, or accept delay on first visit.

---

## Phase 3 — Deploy frontend (Vercel)

### Import project

1. [vercel.com](https://vercel.com) → **Add New** → **Project** → import repo
2. Settings:

| Setting | Value |
|---------|--------|
| **Root Directory** | `frontend` |
| **Framework Preset** | Vite |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |

### Environment variables (Vercel → Settings → Environment Variables)

Apply to **Production** and **Preview**:

```env
VITE_API_URL=https://YOUR-API.onrender.com/api
VITE_RAZORPAY_KEY_ID=rzp_test_xxxxxxxx
VITE_SITE_URL=https://YOUR-APP.vercel.app
VITE_APP_NAME=DripKart
```

**Critical:** `VITE_API_URL` must:
- Use **HTTPS**
- End with `/api` (no trailing slash after `api`)
- Match your Render service URL exactly

Example: `https://dripkart-api.onrender.com/api`

### Redeploy after env changes

Vite bakes env vars at **build time**. After changing any `VITE_*` variable:

**Deployments → ⋯ → Redeploy** (required).

### Verify Vercel routing

`frontend/vercel.json` rewrites all routes to `index.html` for React Router.

Test:
- `https://YOUR-APP.vercel.app/shop` — should load (not 404)
- `https://YOUR-APP.vercel.app/product/1` — product page

---

## Phase 4 — Connect frontend ↔ backend

### CORS checklist

On Render, `CLIENT_ORIGIN` must include your **exact** Vercel URL:

```
https://dripkart.vercel.app
```

For preview deployments, either:
- Set `ALLOW_VERCEL_PREVIEWS=true` (default — allows `*.vercel.app`), or
- Add each preview URL to `CLIENT_ORIGIN` comma-separated:

```
https://dripkart.vercel.app,https://dripkart-git-main-user.vercel.app
```

### Browser test (production)

1. Open `https://YOUR-APP.vercel.app`
2. **DevTools → Network** → filter `api`
3. Login request must go to: `https://YOUR-API.onrender.com/api/auth/login`
4. **Not** `localhost` or `5000`

### Persistent login test

1. Register / login
2. Refresh page — still logged in
3. Application → Local Storage → `dripkart_token` present

### Cart & orders test

1. Add item to bag (drawer opens)
2. Login — cart merges
3. Checkout → Razorpay mock or test payment
4. Land on `/order/success`
5. Track order page shows order

### Admin test

1. Login: `admin@dripkart.com` / password from `ADMIN_PASSWORD` on Render
2. Profile → **Admin dashboard** or `/admin`
3. Stats, orders, products load (JWT + role `admin`)

---

## Environment variable reference

### Backend (Render)

| Variable | Required | Example |
|----------|----------|---------|
| `NODE_ENV` | Yes | `production` |
| `MONGODB_URI` | Yes | `mongodb+srv://...` |
| `JWT_SECRET` | Yes | 48+ char random |
| `CLIENT_ORIGIN` | Yes | `https://YOUR-APP.vercel.app` |
| `ALLOW_VERCEL_PREVIEWS` | No | `true` |
| `RAZORPAY_KEY_ID` | No | `rzp_test_...` |
| `RAZORPAY_KEY_SECRET` | No | secret key |
| `RAZORPAY_SECRET` | No | alias for above |
| `ADMIN_EMAIL` | No | `admin@dripkart.com` |
| `ADMIN_PASSWORD` | No | strong password |
| `PORT` | Auto | set by Render |

### Frontend (Vercel)

| Variable | Required | Example |
|----------|----------|---------|
| `VITE_API_URL` | Yes | `https://YOUR-API.onrender.com/api` |
| `VITE_RAZORPAY_KEY_ID` | No | `rzp_test_...` (public key only) |
| `VITE_SITE_URL` | No | `https://YOUR-APP.vercel.app` |
| `VITE_APP_NAME` | No | `DripKart` |

**Never put `JWT_SECRET` or Razorpay secret on Vercel** — backend only.

---

## Troubleshooting

### Login / API fails with CORS error

- Fix `CLIENT_ORIGIN` on Render (no trailing slash)
- Redeploy Render after env change
- Check browser request URL is Render HTTPS URL

### 401 on every API call after login

- `JWT_SECRET` changed between deploys → users must log in again
- Token missing: check `Authorization: Bearer` header in Network tab

### 502 / 503 on first API call

- Render cold start — wait 60s and retry
- Ping `/api/health` to wake service

### `database: disconnected` in health

- Wrong `MONGODB_URI`
- Atlas IP not allowlisted
- Wrong password / special chars not URL-encoded

### Products show but login fails

- API health OK but auth route error — check Render logs for stack trace

### Blank page on Vercel refresh

- Confirm `vercel.json` exists in `frontend/`
- Root directory must be `frontend`

### Razorpay does not open

- Set `VITE_RAZORPAY_KEY_ID` on Vercel + redeploy
- Set `RAZORPAY_KEY_ID` + `RAZORPAY_KEY_SECRET` on Render
- Test mode keys only work with test cards

### Admin dashboard empty / 403

- Login as admin user (seeded on first start with `ADMIN_EMAIL` / `ADMIN_PASSWORD`)
- Token must be sent — login again

### Build fails on Vercel

```bash
cd frontend && npm run build
```

Fix errors locally first. Common: missing dependency → `npm install` in `frontend/`.

---

## Production security checklist

- [ ] Strong `JWT_SECRET` (48+ random bytes)
- [ ] Strong `ADMIN_PASSWORD` (not `admin123`)
- [ ] MongoDB user with least privilege (readWrite on `dripkart` db only)
- [ ] Razorpay **live** keys only when going live (separate from test)
- [ ] `.env` files in `.gitignore` (never commit secrets)
- [ ] `NODE_ENV=production` on Render
- [ ] HTTPS only (Vercel + Render default)

---

## Postman production tests

**Base URL:** `https://YOUR-API.onrender.com/api`

| # | Method | Path | Auth |
|---|--------|------|------|
| 1 | GET | `/health` | No |
| 2 | POST | `/auth/register` | No — body: `{name,email,password}` |
| 3 | POST | `/auth/login` | No |
| 4 | GET | `/auth/me` | Bearer token |
| 5 | GET | `/products` | No |
| 6 | GET | `/cart` | Bearer |
| 7 | POST | `/orders` | Bearer |

---

## Performance notes

- Admin dashboard is **lazy-loaded** (~400KB chunk) — only loads on `/admin`
- Main bundle ~470KB — acceptable; further split optional
- Enable Vercel **Analytics** for Web Vitals
- Render free tier: expect cold starts

---

## Quick command reference

```bash
# Wake Render API
curl https://YOUR-API.onrender.com/api/health

# Test login
curl -X POST https://YOUR-API.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@dripkart.com","password":"YOUR_ADMIN_PASSWORD"}'

# Local prod simulation
cd frontend
VITE_API_URL=https://YOUR-API.onrender.com/api npm run build && npm run preview
```

---

## Deployment order (summary)

1. MongoDB Atlas → connection string  
2. Render backend → env vars → verify `/api/health`  
3. Copy Render URL → set `VITE_API_URL` on Vercel  
4. Set `CLIENT_ORIGIN` on Render to Vercel URL  
5. Vercel deploy → **Redeploy** after env  
6. End-to-end test: register → shop → cart → checkout → admin  

Your repo already includes `render.yaml` (Blueprint) and `frontend/vercel.json` for SPA routing.
