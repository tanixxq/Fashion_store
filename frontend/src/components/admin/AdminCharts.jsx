import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const COLORS = ["#ffffff", "#737373", "#404040", "#262626", "#171717"];

export function RevenueChart({ orders = [] }) {
  const byDay = orders.slice(0, 14).reduce((acc, o) => {
    const day = o.date?.slice(0, 10) || "Unknown";
    acc[day] = (acc[day] || 0) + (o.total || 0);
    return acc;
  }, {});

  const data = Object.entries(byDay)
    .map(([name, revenue]) => ({ name, revenue }))
    .reverse();

  if (!data.length) {
    return <p className="text-neutral-500 text-sm py-8 text-center">No order data yet</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data}>
        <XAxis dataKey="name" tick={{ fill: "#737373", fontSize: 10 }} />
        <YAxis tick={{ fill: "#737373", fontSize: 10 }} />
        <Tooltip
          contentStyle={{ background: "#141414", border: "1px solid #333", borderRadius: 8 }}
          labelStyle={{ color: "#fff" }}
        />
        <Bar dataKey="revenue" fill="#fff" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function StatusPieChart({ orders = [] }) {
  const counts = orders.reduce((acc, o) => {
    const s = o.status || "placed";
    acc[s] = (acc[s] || 0) + 1;
    return acc;
  }, {});

  const data = Object.entries(counts).map(([name, value]) => ({ name, value }));

  if (!data.length) {
    return <p className="text-neutral-500 text-sm py-8 text-center">No orders</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70}>
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{ background: "#141414", border: "1px solid #333", borderRadius: 8 }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
