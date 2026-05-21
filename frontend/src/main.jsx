import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import "./index.css";
import "./styles/premium.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <CartProvider>
      <AuthProvider useApi={true}>
        <App />
      </AuthProvider>
    </CartProvider>
  </React.StrictMode>
);
