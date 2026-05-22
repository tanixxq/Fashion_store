import { useCallback, useEffect, useState } from "react";
import {
  createRazorpayOrder,
  fetchPaymentConfig,
  verifyRazorpayPayment,
} from "../api/client";

const SCRIPT_URL = "https://checkout.razorpay.com/v1/checkout.js";

function loadRazorpayScript() {
  return new Promise((resolve, reject) => {
    if (window.Razorpay) {
      resolve(window.Razorpay);
      return;
    }
    const existing = document.querySelector(`script[src="${SCRIPT_URL}"]`);
    if (existing) {
      existing.addEventListener("load", () => resolve(window.Razorpay));
      existing.addEventListener("error", reject);
      return;
    }
    const script = document.createElement("script");
    script.src = SCRIPT_URL;
    script.async = true;
    script.onload = () => resolve(window.Razorpay);
    script.onerror = reject;
    document.body.appendChild(script);
  });
}

export function useRazorpayCheckout() {
  const [config, setConfig] = useState({ razorpayEnabled: false, keyId: null });
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    fetchPaymentConfig()
      .then(setConfig)
      .catch(() => setConfig({ razorpayEnabled: false, keyId: null }));
  }, []);

  const pay = useCallback(
    async ({ amount, user, onSuccess, onError }) => {
      setPaying(true);
      try {
        const orderRes = await createRazorpayOrder(amount);

        if (orderRes.mock) {
          await verifyRazorpayPayment({
            razorpay_order_id: orderRes.orderId,
            razorpay_payment_id: `mock_pay_${Date.now()}`,
            razorpay_signature: "mock",
          });
          onSuccess?.({
            paymentId: orderRes.orderId,
            method: "razorpay-mock",
          });
          return;
        }

        const Razorpay = await loadRazorpayScript();
        const key = orderRes.keyId || config.keyId || import.meta.env.VITE_RAZORPAY_KEY_ID;

        await new Promise((resolve, reject) => {
          const rzp = new Razorpay({
            key,
            amount: orderRes.amount,
            currency: orderRes.currency,
            name: "DripKart",
            description: "Fashion & Sneakers Order",
            order_id: orderRes.orderId,
            prefill: {
              name: user?.name,
              email: user?.email,
            },
            handler: async (response) => {
              try {
                await verifyRazorpayPayment({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                });
                onSuccess?.({
                  paymentId: response.razorpay_payment_id,
                  orderId: response.razorpay_order_id,
                  method: "razorpay",
                });
                resolve();
              } catch (err) {
                reject(err);
              }
            },
            modal: {
              ondismiss: () => reject(new Error("Payment cancelled")),
            },
          });
          rzp.open();
        });
      } catch (err) {
        onError?.(err);
        throw err;
      } finally {
        setPaying(false);
      }
    },
    [config.keyId]
  );

  return { config, paying, pay };
}
