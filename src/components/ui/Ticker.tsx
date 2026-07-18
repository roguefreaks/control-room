"use client";

import { useEffect, useRef } from "react";

/**
 * Number ticker: counts up when it enters the viewport. Server-renders the
 * final value (SEO + no-JS), then animates textContent imperatively — no
 * React state, ~380ms, skipped entirely under reduced motion.
 */
export function Ticker({ value, className = "" }: { value: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver((entries) => {
      if (!entries[0].isIntersecting || started.current) return;
      started.current = true;
      io.disconnect();
      const t0 = performance.now();
      const dur = 380;
      const step = (t: number) => {
        const p = Math.min((t - t0) / dur, 1);
        const n = Math.round(value * (1 - Math.pow(1 - p, 3)));
        el.textContent = n.toLocaleString("en-IN");
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
    io.observe(el);
    return () => io.disconnect();
  }, [value]);

  return (
    <span ref={ref} className={className}>
      {value.toLocaleString("en-IN")}
    </span>
  );
}
