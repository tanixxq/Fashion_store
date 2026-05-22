import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { PATHS } from "../navigation";

export default function PaymentSuccessPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const order = state?.order;

  return (
    <div className="page-shell min-h-[70vh] flex items-center justify-center px-4">
      <motion.div
        className="max-w-md w-full text-center p-8 rounded-2xl border border-white/10 bg-neutral-900"
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-3xl">
          ✓
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Payment successful</h1>
        <p className="text-neutral-400 text-sm mb-6">
          {order?.id
            ? `Order ${order.id} is confirmed. We'll email you updates.`
            : "Your order has been placed."}
        </p>
        {order?.total != null && (
          <p className="text-white font-semibold mb-6">Total paid: ₹{order.total}</p>
        )}
        <div className="flex flex-col gap-3">
          <button
            type="button"
            className="btn-primary w-full py-3"
            onClick={() => navigate(PATHS.track, { state: { highlightOrderId: order?.id } })}
          >
            Track order
          </button>
          <button
            type="button"
            className="btn-ghost w-full py-3"
            onClick={() => navigate(PATHS.shop)}
          >
            Continue shopping
          </button>
        </div>
      </motion.div>
    </div>
  );
}
