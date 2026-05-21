# DripKart — MERN setup (6 steps)

Beginner guide for your e-commerce project.

---

## Step 1 — Express folder structure

```
backend/
├── .env                 # Secrets & config (not committed to git)
├── .env.example         # Template to copy
├── package.json
└── src/
    ├── index.js         # Main server (start here)
    ├── config/
    │   └── db.js        # MongoDB connection
    ├── models/
    │   └── Product.js   # Product schema
    ├── routes/
    │   ├── products.routes.js
    │   └── index.js     # Other APIs (auth, orders, …)
    ├── data/
    │   └── dummyProducts.js
    └── scripts/
        └── seedDummy.js # Load dummy data into MongoDB
```

**Why split folders?**

- `models/` — database shape (schemas)
- `routes/` — URL handlers (`GET /api/products`)
- `config/` — shared setup (DB)
- `data/` — static JSON for testing

---

## Step 2 — Basic Express server

File: `src/index.js`

```javascript
import express from "express";
const app = express();
const PORT = 5000;

app.get("/", (req, res) => {
  res.send("Backend is running successfully");
});

app.listen(PORT, () => {
  console.log(`Server on http://localhost:${PORT}`);
});
```

Run: `npm run dev`

---

## Step 3 — MongoDB + mongoose + dotenv

**Install:** `mongoose`, `dotenv` (already in `package.json`)

**`.env` file:**

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/dripkart
CLIENT_ORIGIN=http://localhost:5173
```

**`src/config/db.js`:**

```javascript
import mongoose from "mongoose";

export async function connectDB() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("MongoDB connected");
}
```

**In `index.js`:** `import "dotenv/config"` at the top, then `await connectDB()` before `app.listen`.

Start MongoDB locally or use MongoDB Atlas and paste the Atlas URI into `MONGODB_URI`.

---

## Step 4 — Product schema

File: `src/models/Product.js`

| Field         | Type   | Purpose              |
|---------------|--------|----------------------|
| `name`        | String | Product title        |
| `price`       | Number | Price in ₹           |
| `image`       | String | Image URL            |
| `category`    | String | T-Shirts, Sneakers…  |
| `description` | String | Short text           |

Mongoose saves documents in a MongoDB collection called `products`.

---

## Step 5 — GET /api/products

File: `src/routes/products.routes.js`

- Reads products from MongoDB if any exist
- Otherwise returns **dummy** JSON from `src/data/dummyProducts.js`

**Test:**

```bash
curl http://localhost:5000/api/products
```

**Response example:**

```json
{
  "success": true,
  "source": "dummy",
  "products": [
    {
      "id": 1,
      "name": "Core Cotton Tee",
      "price": 999,
      "image": "https://...",
      "category": "T-Shirts",
      "description": "Soft cotton tee..."
    }
  ],
  "total": 6
}
```

**Save dummy data to MongoDB:**

```bash
npm run seed:dummy
```

Then `source` becomes `"database"`.

---

## Step 6 — React frontend connection

### A. Vite proxy (`frontend/vite.config.js`)

```javascript
server: {
  proxy: {
    "/api": { target: "http://localhost:5000", changeOrigin: true },
  },
},
```

So `fetch("/api/products")` hits your Express server.

### B. Fetch in React (`frontend/src/hooks/useProducts.js`)

```javascript
const res = await fetch("/api/products");
const data = await res.json();
setProducts(data.products);
```

### C. Display products

`App.jsx` maps `products` into cards:

```jsx
{products.map((product) => (
  <article key={product.id}>
    <img src={product.image} alt={product.name} />
    <h4>{product.name}</h4>
    <p>₹{product.price}</p>
  </article>
))}
```

### Using axios (optional)

```bash
npm install axios --prefix frontend
```

```javascript
import axios from "axios";
const { data } = await axios.get("/api/products");
console.log(data.products);
```

---

## Run full stack

**Terminal 1 — Backend**

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

**Terminal 2 — Frontend**

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173 — products load from the API when the backend is running.

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Empty `curl` response | Server not running — `npm run dev` in `backend` |
| Port 5000 busy (macOS) | Turn off AirPlay Receiver or use `PORT=5001` in `.env` |
| CORS error in browser | Check `CLIENT_ORIGIN` matches Vite URL |
| No products | Run `npm run seed:dummy` or rely on dummy fallback |
