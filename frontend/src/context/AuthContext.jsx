import { createContext, useContext, useEffect, useState } from "react";
import {
  fetchMe,
  fetchMyOrders,
  loginUser,
  registerUser,
  setToken,
  syncUserData,
} from "../api/client";
import { loadJson, saveJson } from "../utils/storage";

const AuthContext = createContext(null);

export function AuthProvider({ children, useApi = false }) {
  const [user, setUser] = useState(() => loadJson("dripkart_user", null));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    saveJson("dripkart_user", user);
  }, [user]);

  useEffect(() => {
    const token = localStorage.getItem("dripkart_token");
    if (!useApi || !token) return;

    fetchMe()
      .then(({ user: sessionUser }) => {
        setUser({
          name: sessionUser.name,
          email: sessionUser.email,
          role: sessionUser.role,
        });
      })
      .catch(() => {
        setToken(null);
        setUser(null);
      });
  }, [useApi]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      if (useApi) {
        const res = await loginUser(email, password);
        setToken(res.token);
        setUser({ name: res.user.name, email: res.user.email, role: res.user.role });
        return res;
      }
      setUser({ name: email.split("@")[0], email });
      return { user: { name: email.split("@")[0], email } };
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    setLoading(true);
    try {
      if (useApi) {
        const res = await registerUser(name, email, password);
        setToken(res.token);
        setUser({ name: res.user.name, email: res.user.email, role: res.user.role });
        return res;
      }
      setUser({ name: name || email.split("@")[0], email });
      return { user: { name, email } };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
  };

  const isAuthenticated = Boolean(user);

  const value = {
    user,
    setUser,
    loading,
    login,
    register,
    logout,
    isAuthenticated,
    fetchMe,
    fetchMyOrders,
    syncUserData,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
