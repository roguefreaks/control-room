"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * Theme is external state (the <html data-theme> attribute, set before paint
 * by the head script), so it's read via useSyncExternalStore. A MutationObserver
 * keeps this button in sync no matter who flips the theme (palette included).
 */
function subscribe(onChange: () => void): () => void {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
  const mq = window.matchMedia("(prefers-color-scheme: dark)");
  const onSystemChange = () => {
    // follow system only while the user has no stored preference
    if (!localStorage.getItem("cr-theme")) {
      document.documentElement.setAttribute("data-theme", mq.matches ? "dark" : "light");
    }
    onChange();
  };
  mq.addEventListener("change", onSystemChange);
  return () => {
    observer.disconnect();
    mq.removeEventListener("change", onSystemChange);
  };
}

function getSnapshot(): "light" | "dark" {
  return document.documentElement.getAttribute("data-theme") === "dark"
    ? "dark"
    : "light";
}

export function ThemeToggle({ className = "" }: { className?: string }) {
  const theme = useSyncExternalStore(subscribe, getSnapshot, () => "light" as const);

  const toggle = useCallback(() => {
    const next = getSnapshot() === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("cr-theme", next);
    } catch {}
  }, []);

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
      className={`chip cursor-pointer transition-colors hover:border-line-strong hover:text-signal-text ${className}`}
    >
      {theme === "dark" ? (
        <>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" aria-hidden>
            <circle cx="12" cy="12" r="4.2" fill="currentColor" />
            <path
              d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M19.1 4.9L17 7M7 17l-2.1 2.1"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
          LIGHT
        </>
      ) : (
        <>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M20 13.5A8.5 8.5 0 0 1 10.5 4 7.5 7.5 0 1 0 20 13.5Z"
              fill="currentColor"
            />
          </svg>
          DARK
        </>
      )}
    </button>
  );
}
