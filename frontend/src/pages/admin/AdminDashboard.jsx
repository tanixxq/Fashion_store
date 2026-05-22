import { useEffect, useState } from "react";
import {
  createAdminProduct,
  deleteAdminProduct,
  fetchAdminOrders,
  fetchAdminProducts,
  fetchAdminStats,
  fetchAdminUsers,
  updateAdminProduct,
  updateOrderStatus,
} from "../../api/admin";
import { RevenueChart, StatusPieChart } from "../../components/admin/AdminCharts";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import ErrorMessage from "../../components/ui/ErrorMessage";

const ORDER_STATUSES = [
  "placed",
  "processing",
  "shipped",
  "out_for_delivery",
  "delivered",
];

export default function AdminDashboard({ onBack }) {
  const [tab, setTab] = useState("overview");
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [productForm, setProductForm] = useState({
    name: "",
    category: "Sneakers",
    price: "",
    description: "",
    image: "",
    rating: "4.5",
  });

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const [statsRes, ordersRes, productsRes, usersRes] = await Promise.all([
        fetchAdminStats(),
        fetchAdminOrders(),
        fetchAdminProducts(),
        fetchAdminUsers(),
      ]);
      setStats(statsRes);
      setOrders(ordersRes.orders || []);
      setProducts(productsRes.products || []);
      setUsers(usersRes.users || []);
    } catch (err) {
      setError(err.message || "Failed to load admin data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleStatusChange = async (orderId, status) => {
    try {
      await updateOrderStatus(orderId, status);
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status } : o))
      );
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    try {
      await createAdminProduct({
        ...productForm,
        price: Number(productForm.price),
        rating: Number(productForm.rating),
      });
      setProductForm({
        name: "",
        category: "Sneakers",
        price: "",
        description: "",
        image: "",
        rating: "4.5",
      });
      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  const startEdit = (p) => {
    setEditingId(p.id);
    setEditForm({
      name: p.name,
      price: p.price,
      category: p.category,
      image: p.image,
      description: p.description,
    });
  };

  const saveEdit = async (id) => {
    try {
      await updateAdminProduct(id, {
        ...editForm,
        price: Number(editForm.price),
      });
      setEditingId(null);
      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await deleteAdminProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading && !stats) {
    return (
      <div className="page-shell admin-page">
        <LoadingSpinner label="Loading dashboard…" />
      </div>
    );
  }

  return (
    <div className="page-shell admin-page min-h-screen bg-neutral-950 text-white px-4 py-8 max-w-6xl mx-auto">
      <button type="button" className="back-link" onClick={onBack}>
        ← Storefront
      </button>

      <div className="admin-header">
        <div>
          <span className="eyebrow">DripKart Admin</span>
          <h2>Dashboard</h2>
        </div>
        <button type="button" className="btn-ghost" onClick={load}>
          Refresh
        </button>
      </div>

      <ErrorMessage message={error} onRetry={load} />

      <nav className="admin-tabs flex flex-wrap gap-2 mb-6">
        {["overview", "orders", "products", "users"].map((t) => (
          <button
            key={t}
            type="button"
            className={tab === t ? "active" : ""}
            onClick={() => setTab(t)}
          >
            {t}
          </button>
        ))}
      </nav>

      {tab === "overview" && stats && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[
              ["Products", stats.products],
              ["Orders", stats.orders],
              ["Users", stats.users],
              ["Revenue", `₹${stats.revenue?.toLocaleString()}`],
            ].map(([label, value]) => (
              <div
                key={label}
                className="rounded-xl border border-white/10 bg-neutral-900 p-5"
              >
                <span className="text-[10px] uppercase tracking-widest text-neutral-500">
                  {label}
                </span>
                <strong className="block text-2xl mt-1">{value}</strong>
              </div>
            ))}
          </div>
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="rounded-xl border border-white/10 bg-neutral-900 p-4">
              <h3 className="text-sm font-bold mb-3 uppercase tracking-wide text-neutral-400">
                Revenue trend
              </h3>
              <RevenueChart orders={orders} />
            </div>
            <div className="rounded-xl border border-white/10 bg-neutral-900 p-4">
              <h3 className="text-sm font-bold mb-3 uppercase tracking-wide text-neutral-400">
                Orders by status
              </h3>
              <StatusPieChart orders={orders} />
            </div>
          </div>
          <div className="rounded-xl border border-white/10 bg-neutral-900 p-4">
            <h3 className="text-sm font-bold mb-3 text-neutral-400 uppercase tracking-wide">
              Recent orders
            </h3>
            <ul className="space-y-2 text-sm text-neutral-300">
              {(stats.recentOrders || []).map((o) => (
                <li key={o.id} className="flex justify-between border-b border-white/5 py-2">
                  <span>{o.id}</span>
                  <span>₹{o.total}</span>
                  <span className="text-neutral-500">{o.status}</span>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}

      {tab === "users" && (
        <div className="rounded-xl border border-white/10 bg-neutral-900 overflow-x-auto">
          <table className="admin-table w-full text-sm">
            <thead>
              <tr className="text-left text-neutral-500 border-b border-white/10">
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Joined</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-white/5">
                  <td className="p-3">{u.name}</td>
                  <td className="p-3">{u.email}</td>
                  <td className="p-3 text-neutral-500">
                    {u.joined ? new Date(u.joined).toLocaleDateString() : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "orders" && (
        <div className="admin-table-wrap page-card">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Email</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id}>
                  <td>{o.id}</td>
                  <td>{o.shipping?.email}</td>
                  <td>₹{o.total}</td>
                  <td>
                    <select
                      value={o.status}
                      onChange={(e) => handleStatusChange(o.id, e.target.value)}
                    >
                      {ORDER_STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "products" && (
        <>
          <form className="admin-form page-card" onSubmit={handleCreateProduct}>
            <h3>Add product</h3>
            <div className="admin-form-grid">
              <input
                required
                placeholder="Name"
                value={productForm.name}
                onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
              />
              <input
                required
                placeholder="Category"
                value={productForm.category}
                onChange={(e) =>
                  setProductForm({ ...productForm, category: e.target.value })
                }
              />
              <input
                required
                type="number"
                placeholder="Price"
                value={productForm.price}
                onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
              />
              <input
                placeholder="Image URL"
                value={productForm.image}
                onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
              />
            </div>
            <textarea
              required
              rows={2}
              placeholder="Description"
              value={productForm.description}
              onChange={(e) =>
                setProductForm({ ...productForm, description: e.target.value })
              }
            />
            <button type="submit" className="btn-primary">
              Create product
            </button>
          </form>

          <div className="admin-table-wrap page-card">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Price</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {products.slice(0, 50).map((p) => (
                  <tr key={p.id}>
                    <td>{p.id}</td>
                    <td>
                      {editingId === p.id ? (
                        <input
                          className="bg-neutral-800 border border-white/10 rounded px-2 py-1 text-white w-full"
                          value={editForm.name}
                          onChange={(e) =>
                            setEditForm({ ...editForm, name: e.target.value })
                          }
                        />
                      ) : (
                        p.name
                      )}
                    </td>
                    <td>
                      {editingId === p.id ? (
                        <input
                          type="number"
                          className="bg-neutral-800 border border-white/10 rounded px-2 py-1 text-white w-20"
                          value={editForm.price}
                          onChange={(e) =>
                            setEditForm({ ...editForm, price: e.target.value })
                          }
                        />
                      ) : (
                        `₹${p.price}`
                      )}
                    </td>
                    <td className="flex gap-2 flex-wrap">
                      {editingId === p.id ? (
                        <>
                          <button
                            type="button"
                            className="text-xs text-white underline"
                            onClick={() => saveEdit(p.id)}
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            className="text-xs text-neutral-500"
                            onClick={() => setEditingId(null)}
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            type="button"
                            className="text-xs text-neutral-400 hover:text-white"
                            onClick={() => startEdit(p)}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className="text-xs text-red-400"
                            onClick={() => handleDeleteProduct(p.id)}
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
