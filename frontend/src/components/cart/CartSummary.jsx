export default function CartSummary({
  subtotal,
  shipping,
  total,
  itemCount,
  onCheckout,
  onViewBag,
  compact = false,
}) {
  return (
    <div
      className={`${compact ? "p-4" : "p-5"} border-t border-white/10 bg-neutral-950/80`}
    >
      <div className="space-y-2 text-sm">
        <div className="flex justify-between text-neutral-400">
          <span>Subtotal ({itemCount} items)</span>
          <span className="text-white">₹{subtotal}</span>
        </div>
        <div className="flex justify-between text-neutral-400">
          <span>Shipping</span>
          <span className="text-white">{shipping === 0 ? "Free" : `₹${shipping}`}</span>
        </div>
        <div className="flex justify-between text-base font-bold pt-2 border-t border-white/10">
          <span className="text-white">Total</span>
          <span className="text-white">₹{total}</span>
        </div>
      </div>
      <div className={`flex flex-col gap-2 ${compact ? "mt-3" : "mt-4"}`}>
        <button
          type="button"
          onClick={onCheckout}
          className="w-full py-3.5 bg-white text-black text-xs font-bold uppercase tracking-wider rounded-full hover:bg-neutral-200 transition"
        >
          Checkout
        </button>
        {onViewBag && (
          <button
            type="button"
            onClick={onViewBag}
            className="w-full py-2.5 text-xs text-neutral-400 hover:text-white transition uppercase tracking-wide"
          >
            View full bag
          </button>
        )}
      </div>
    </div>
  );
}
