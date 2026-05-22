import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  fetchCart,
  removeCartLine,
  replaceCart,
  updateCartLine,
} from "../api/client";
import { useAuth } from "./AuthContext";
import { useToast } from "./ToastContext";
import { mergeCartLines } from "../utils/cartMerge";
import { loadJson, saveJson } from "../utils/storage";

const CartContext = createContext(null);

const FREE_SHIPPING_MIN = 2999;
const STANDARD_SHIPPING = 99;

function buildLine(product, size, qty = 1) {
  const cartLineId = size ? `${product.id}-${size}` : String(product.id);
  const displayName = size ? `${product.name} · Size ${size}` : product.name;
  return {
    ...product,
    id: cartLineId,
    productId: product.id,
    name: displayName,
    size: size || null,
    qty,
  };
}

export function CartProvider({ children }) {
  const { user, isAuthenticated, useApi } = useAuth();
  const { showSuccess } = useToast();
  const [cart, setCart] = useState(() => loadJson("dripkart_cart", []));
  const [syncing, setSyncing] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const skipNextSync = useRef(false);
  const mergedForUser = useRef(null);

  const openDrawer = useCallback(() => setIsDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setIsDrawerOpen(false), []);
  const toggleDrawer = useCallback(() => setIsDrawerOpen((v) => !v), []);

  useEffect(() => {
    saveJson("dripkart_cart", cart);
  }, [cart]);

  const cartCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.qty, 0),
    [cart]
  );

  const cartSubtotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.qty, 0),
    [cart]
  );

  const shipping = useMemo(() => {
    if (cart.length === 0) return 0;
    return cartSubtotal >= FREE_SHIPPING_MIN ? 0 : STANDARD_SHIPPING;
  }, [cart.length, cartSubtotal]);

  const orderTotal = useMemo(() => cartSubtotal + shipping, [cartSubtotal, shipping]);
  const cartTotal = cartSubtotal;

  const loadServerCart = useCallback(async () => {
    if (!useApi || !isAuthenticated) return;
    try {
      const { cart: serverCart } = await fetchCart();
      skipNextSync.current = true;
      setCart((prev) => mergeCartLines(prev, serverCart));
    } catch {
      /* keep local cart */
    }
  }, [useApi, isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated || !user?.email) {
      mergedForUser.current = null;
      return;
    }
    if (mergedForUser.current === user.email) return;
    mergedForUser.current = user.email;
    loadServerCart();
  }, [isAuthenticated, user?.email, loadServerCart]);

  useEffect(() => {
    if (!useApi || !isAuthenticated) return undefined;
    if (skipNextSync.current) {
      skipNextSync.current = false;
      return undefined;
    }

    const timer = setTimeout(async () => {
      setSyncing(true);
      try {
        await replaceCart(cart);
      } catch {
        /* debounced sync */
      } finally {
        setSyncing(false);
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [cart, useApi, isAuthenticated]);

  const applySessionCart = useCallback((serverCart = []) => {
    if (!serverCart?.length) return;
    skipNextSync.current = true;
    setCart((prev) => mergeCartLines(prev, serverCart));
  }, []);

  const addToCart = (product, size, qty = 1) => {
    if (product.inStock === false) return;
    const line = buildLine(product, size, qty);
    const amount = Math.max(1, Number(qty) || 1);

    setCart((prev) => {
      const existing = prev.find((item) => item.id === line.id);
      if (existing) {
        return prev.map((item) =>
          item.id === line.id ? { ...item, qty: item.qty + amount } : item
        );
      }
      return [...prev, { ...line, qty: amount }];
    });
    showSuccess(`${line.name} added to bag`);
    setIsDrawerOpen(true);
  };

  const addOutfitToCart = (outfit, size) => {
    const cartItem = {
      id: outfit.id,
      name: `${outfit.name} (Set · ${size})`,
      price: outfit.price,
      image: outfit.image,
      qty: 1,
      isSet: true,
    };
    setCart((prev) => {
      const existing = prev.find((item) => item.id === outfit.id);
      if (existing) {
        return prev.map((item) =>
          item.id === outfit.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, cartItem];
    });
    showSuccess(`"${outfit.name}" added to bag`);
    setIsDrawerOpen(true);
  };

  const updateCartQty = async (id, delta) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, qty: Math.max(0, item.qty + delta) } : item
        )
        .filter((item) => item.qty > 0)
    );

    if (useApi && isAuthenticated) {
      const item = cart.find((i) => i.id === id);
      const newQty = Math.max(0, (item?.qty || 0) + delta);
      try {
        if (newQty < 1) await removeCartLine(id);
        else await updateCartLine(id, newQty);
      } catch {
        /* debounced PUT */
      }
    }
  };

  const removeFromCart = async (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
    if (useApi && isAuthenticated) {
      try {
        await removeCartLine(id);
      } catch {
        /* sync later */
      }
    }
  };

  const clearCart = () => {
    skipNextSync.current = true;
    setCart([]);
  };

  const value = {
    cart,
    setCart,
    cartCount,
    cartTotal,
    cartSubtotal,
    shipping,
    orderTotal,
    isDrawerOpen,
    openDrawer,
    closeDrawer,
    toggleDrawer,
    addToCart,
    addOutfitToCart,
    updateCartQty,
    removeFromCart,
    clearCart,
    applySessionCart,
    loadServerCart,
    syncing,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
