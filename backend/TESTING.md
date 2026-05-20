# Backend testing guide

**Main server file:** `backend/src/index.js`

## 1. Start the server

```bash
cd backend
npm run dev
```

You should see:

```
✓ Express server listening on http://localhost:5000
  Test:  curl http://localhost:5000/api/test
```

When you run curl, the terminal should log:

```
→ GET /api/test
[HIT] GET /api/test
```

## 2. Test with curl

```bash
# Root route (plain text)
curl http://localhost:5000/

# Test API (JSON)
curl http://localhost:5000/api/test
```

**Expected:**

```
Backend is running successfully
```

```json
{"success":true,"message":"API working successfully"}
```

Verbose (shows status code):

```bash
curl -v http://localhost:5000/api/test
```

## 3. Troubleshooting empty curl output

| Symptom | Fix |
|--------|-----|
| Empty response, server not running | Run `npm run dev` in `backend` and keep terminal open |
| Port 5000 used by macOS AirPlay | System Settings → General → AirDrop & Handoff → turn off **AirPlay Receiver**, or set `PORT=5001` in `backend/.env` |
| `EADDRINUSE` | Another process uses port 5000 — change `PORT` in `.env` |
| Request hangs | Server used to wait for MongoDB before listening; now test routes respond immediately |

Test routes (`/` and `/api/test`) do **not** require MongoDB or JWT.

## 4. Connect React (fetch)

Vite proxies `/api` to the backend — use relative URLs in dev:

```javascript
// frontend — during npm run dev
const res = await fetch("/api/test");
const data = await res.json();
console.log(data.success, data.message);
```

Direct to Express (bypass proxy):

```javascript
const res = await fetch("http://localhost:5000/api/test");
const data = await res.json();
```

Helper module: `frontend/src/api/testBackend.js`

```javascript
import { runBackendTests } from "./api/testBackend";
runBackendTests().then(console.log);
```

## 5. Connect React (axios)

```bash
npm install axios --prefix frontend
```

```javascript
import axios from "axios";

// Via Vite proxy
const { data } = await axios.get("/api/test");
console.log(data.message);

// Direct
const { data: direct } = await axios.get("http://localhost:5000/api/test");
```

## 6. Route order (why tests work)

In `index.js`:

1. CORS + `express.json()`
2. Request logger
3. `GET /` and `GET /api/test` (no auth)
4. `app.use("/api", apiRoutes)`
5. `notFound` + `errorHandler` last

Protected routes (`/api/users`, `/api/admin`, etc.) use JWT only on their sub-routers — they never block `/api/test`.
