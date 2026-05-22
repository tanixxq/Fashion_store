import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { ToastProvider } from "./context/ToastContext";
import AuthBootstrap from "./components/AuthBootstrap";
import LoadingSpinner from "./components/ui/LoadingSpinner";
import "./index.css";
import "./styles/premium.css";
import "./styles/dark-theme.css";
import "./styles/responsive.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ToastProvider>
      <BrowserRouter>
        <AuthProvider useApi={true}>
          <AuthBootstrap>
            <CartProvider>
              <App />
            </CartProvider>
          </AuthBootstrap>
        </AuthProvider>
      </BrowserRouter>
    </ToastProvider>
  </React.StrictMode>
);
