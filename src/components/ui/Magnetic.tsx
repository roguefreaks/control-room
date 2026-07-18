"use client";

import { useRef, type ReactNode } from "react";

/**
 * Magnetic hover for primary CTAs: the element leans toward the cursor.
 * Pure transform, capped at 6px, disabled for touch and reduced motion.
 */
export function Magnetic({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el || e.pointerType !== "mouse") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = el.getBoundingClientRect();
    const dx = ((e.clientX - r.left) / r.width - 0.5) * 12;
    const dy = ((e.clientY - r.top) / r.height - 0.5) * 12;
    el.style.transform = `translate(${dx.toFixed(1)}px, ${dy.toFixed(1)}px)`;
  };

  const onLeave = () => {
    if (ref.current) ref.current.style.transform = "";
  };

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className="inline-block transition-transform duration-150 ease-out"
    >
      {children}
    </div>
  );
}
