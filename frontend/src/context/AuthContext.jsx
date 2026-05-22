import { createContext, useCallback, useContext, useEffect, useState } from "react";
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
  const [authReady, setAuthReady] = useState(!useApi);

  useEffect(() => {
    saveJson("dripkart_user", user);
  }, [user]);

  const applySession = useCallback((sessionUser) => {
    if (!sessionUser) {
      setUser(null);
      return null;
    }
    const next = {
      name: sessionUser.name,
      email: sessionUser.email,
      role: sessionUser.role,
      id: sessionUser.id,
    };
    setUser(next);
    return {
      user: next,
      cart: sessionUser.cart || [],
      wishlist: sessionUser.wishlist || [],
      favouriteOutfits: sessionUser.favouriteOutfits || [],
    };
  }, []);

  const refreshSession = useCallback(async () => {
    const token = localStorage.getItem("dripkart_token");
    if (!useApi || !token) {
      setAuthReady(true);
      return null;
    }
    try {
      const { user: sessionUser } = await fetchMe();
      return applySession(sessionUser);
    } catch {
      setToken(null);
      setUser(null);
      return null;
    } finally {
      setAuthReady(true);
    }
  }, [useApi, applySession]);

  useEffect(() => {
    if (!useApi) {
      setAuthReady(true);
      return;
    }
    const token = localStorage.getItem("dripkart_token");
    if (!token) {
      setAuthReady(true);
      return;
    }
    refreshSession();
  }, [useApi, refreshSession]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      if (useApi) {
        const res = await loginUser(email, password);
        setToken(res.token);
        return { ...res, session: applySession(res.user) };
      }
      const localUser = { name: email.split("@")[0], email };
      setUser(localUser);
      return { user: localUser };
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
        return { ...res, session: applySession(res.user) };
      }
      const localUser = { name: name || email.split("@")[0], email };
      setUser(localUser);
      return { user: localUser };
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
    authReady,
    login,
    register,
    logout,
    isAuthenticated,
    applySession,
    refreshSession,
    fetchMe,
    fetchMyOrders,
    syncUserData,
    useApi,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
