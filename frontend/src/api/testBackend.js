/**
 * Examples: connect React to the Express backend
 *
 * Dev (Vite proxy):  fetch("/api/test")
 * Direct backend:    fetch("http://localhost:5000/api/test")
 */

const API_BASE = import.meta.env.VITE_API_URL || "/api";
const SERVER_ROOT = import.meta.env.VITE_SERVER_URL || "http://localhost:5000";

/** GET / — plain text health check */
export async function testRootRoute() {
  const res = await fetch(SERVER_ROOT);
  if (!res.ok) throw new Error(`Root route failed (${res.status})`);
  return res.text();
}

/** GET /api/test — JSON test route */
export async function testApiRoute() {
  const res = await fetch(`${API_BASE}/test`);
  if (!res.ok) throw new Error(`Test API failed (${res.status})`);
  const data = await res.json();
  if (!data.success) throw new Error(data.message || "API test failed");
  return data;
}

/**
 * Run both checks — call from a button or useEffect during development
 * @example
 * import { runBackendTests } from "./api/testBackend";
 * runBackendTests().then(console.log).catch(console.error);
 */
export async function runBackendTests() {
  const [root, api] = await Promise.all([testRootRoute(), testApiRoute()]);
  return { root, api };
}

// --- axios alternative (npm install axios) ---
// import axios from "axios";
// const { data } = await axios.get("http://localhost:5000/api/test");
// console.log(data.message);
