import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { PATHS } from "../navigation";

export default function PaymentFailurePage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const message = state?.message || "Payment was cancelled or failed.";

  return (
    <div className="page-shell min-h-[70vh] flex items-center justify-center px-4">
      <motion.div
        className="max-w-md w-full text-center p-8 rounded-2xl border border-red-500/20 bg-neutral-900"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold text-white mb-2">Payment failed</h1>
        <p className="text-neutral-400 text-sm mb-8">{message}</p>
        <div className="flex flex-col gap-3">
          <button
            type="button"
            className="btn-primary w-full py-3"
            onClick={() => navigate(PATHS.checkout)}
          >
            Try again
          </button>
          <button
            type="button"
            className="btn-ghost w-full py-3"
            onClick={() => navigate(PATHS.cart)}
          >
            Back to bag
          </button>
        </div>
      </motion.div>
    </div>
  );
}
