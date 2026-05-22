import { AnimatePresence, motion } from "framer-motion";
import { useCart } from "../../context/CartContext";
import CartLineItem from "./CartLineItem";
import CartSummary from "./CartSummary";

export default function CartDrawer({ onCheckout, onViewFullCart }) {
  const {
    cart,
    cartCount,
    cartSubtotal,
    shipping,
    orderTotal,
    isDrawerOpen,
    closeDrawer,
    updateCartQty,
    removeFromCart,
    syncing,
  } = useCart();

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-[90] bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeDrawer}
            aria-hidden="true"
          />
          <motion.aside
            role="dialog"
            aria-label="Shopping bag"
            className="fixed top-0 right-0 z-[100] h-full w-full max-w-md flex flex-col bg-neutral-950 shadow-2xl border-l border-white/10"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 380, damping: 36 }}
          >
            <header className="flex items-center justify-between px-5 py-4 border-b border-white/10">
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-500">
                  DripKart
                </p>
                <h2 className="text-lg font-bold text-white">
                  Your Bag ({cartCount})
                </h2>
              </div>
              <button
                type="button"
                onClick={closeDrawer}
                className="w-10 h-10 rounded-full border border-white/15 text-white hover:bg-white/10 transition text-xl leading-none"
                aria-label="Close cart"
              >
                ×
              </button>
            </header>

            {syncing && (
              <p className="px-5 py-2 text-xs text-neutral-500 border-b border-white/5">
                Syncing with your account…
              </p>
            )}

            <div className="flex-1 overflow-y-auto px-5">
              {cart.length === 0 ? (
                <div className="py-16 text-center">
                  <p className="text-neutral-400 text-sm">Your bag is empty.</p>
                  <button
                    type="button"
                    onClick={closeDrawer}
                    className="mt-4 text-xs uppercase tracking-widest text-white underline"
                  >
                    Continue shopping
                  </button>
                </div>
              ) : (
                <ul className="divide-y divide-white/5">
                  <AnimatePresence initial={false}>
                    {cart.map((item) => (
                      <CartLineItem
                        key={item.id}
                        item={item}
                        onUpdateQty={updateCartQty}
                        onRemove={removeFromCart}
                      />
                    ))}
                  </AnimatePresence>
                </ul>
              )}
            </div>

            {cart.length > 0 && (
              <CartSummary
                subtotal={cartSubtotal}
                shipping={shipping}
                total={orderTotal}
                itemCount={cartCount}
                compact
                onCheckout={() => {
                  closeDrawer();
                  onCheckout?.();
                }}
                onViewBag={() => {
                  closeDrawer();
                  onViewFullCart?.();
                }}
              />
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
