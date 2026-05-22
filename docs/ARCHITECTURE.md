# DripKart architecture

## Cart system

```
Guest adds item → CartContext (localStorage)
       ↓
User logs in → mergeCartLines(local, server)
       ↓
Debounced PUT /api/cart (800ms)
       ↓
Drawer UI (Framer Motion) + full /cart page
```

| Layer | File |
|-------|------|
| State | `context/CartContext.jsx` |
| UI drawer | `components/cart/CartDrawer.jsx` |
| Line item | `components/cart/CartLineItem.jsx` |
| Totals | `components/cart/CartSummary.jsx` |
| API | `api/client.js` → `/api/cart` |
| Backend | `routes/cart.routes.js` → User.cart[] |

**Duplicate prevention:** line id = `productId-size` (or `productId`).

## Admin

| Layer | File |
|-------|------|
| Guard | `components/AdminRoute.jsx` + `middleware/admin.js` |
| UI | `pages/admin/AdminDashboard.jsx` |
| Charts | `components/admin/AdminCharts.jsx` (Recharts) |
| API | `api/admin.js` |

## Theme

- Dark premium: `styles/dark-theme.css` + `theme-dark` on `.app`
- Tailwind utilities in new components
- Legacy pages use CSS variables (auto-themed)

## Auth

- JWT in `localStorage` → `Authorization: Bearer`
- Protected: cart page, checkout, profile
- Admin: role `admin` on User model
