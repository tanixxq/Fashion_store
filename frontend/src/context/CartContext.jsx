import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { loadJson, saveJson } from "../utils/storage";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => loadJson("dripkart_cart", []));
  const [toast, setToast] = useState(null);

  useEffect(() => {
    saveJson("dripkart_cart", cart);
  }, [cart]);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 2600);
  };

  const cartCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.qty, 0),
    [cart]
  );

  const cartTotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.qty, 0),
    [cart]
  );

  const addToCart = (product, size) => {
    const cartLineId = size ? `${product.id}-${size}` : String(product.id);
    const displayName = size ? `${product.name} · Size ${size}` : product.name;

    setCart((prev) => {
      const existing = prev.find((item) => item.id === cartLineId);
      if (existing) {
        return prev.map((item) =>
          item.id === cartLineId ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [
        ...prev,
        {
          ...product,
          id: cartLineId,
          productId: product.id,
          name: displayName,
          size: size || null,
          qty: 1,
        },
      ];
    });
    showToast(`${displayName} added to cart`);
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
    showToast(`"${outfit.name}" added to cart`);
  };

  const updateCartQty = (id, delta) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, qty: Math.max(0, item.qty + delta) } : item
        )
        .filter((item) => item.qty > 0)
    );
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
    showToast("Removed from cart");
  };

  const clearCart = () => setCart([]);

  const value = {
    cart,
    setCart,
    cartCount,
    cartTotal,
    addToCart,
    addOutfitToCart,
    updateCartQty,
    removeFromCart,
    clearCart,
    toast,
    showToast,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
