import { useEffect, useState } from "react";

/** Hide navbar on scroll down, show on scroll up (Apple-style) */
export function useScrollHeader(threshold = 12) {
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let lastY = window.scrollY;

    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 8);
      if (Math.abs(y - lastY) < threshold) return;
      if (y > lastY && y > 80) setHidden(true);
      else setHidden(false);
      lastY = y;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  return { hidden, scrolled };
}
