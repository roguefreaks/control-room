"use client";

import { useEffect } from "react";
import { isSectionId } from "@/lib/state-machine";
import { useConsole } from "./ConsoleProvider";

/**
 * Watches the console modules: advances the visitor state machine when a
 * section scrolls into view, and applies the .revealed class for the
 * scroll-in animation of any element carrying .reveal.
 */
export function SectionObserver() {
  const { reachSection } = useConsole();

  useEffect(() => {
    // No IntersectionObserver (very old browser / restricted webview):
    // show everything and leave the state machine at RECEIVED.
    if (typeof IntersectionObserver === "undefined") {
      document
        .querySelectorAll<HTMLElement>(".reveal")
        .forEach((el) => el.classList.add("revealed"));
      return;
    }

    const sections = document.querySelectorAll<HTMLElement>("section[data-module]");
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const id = entry.target.id;
          if (isSectionId(id)) reachSection(id);
        }
      },
      { rootMargin: "-25% 0px -25% 0px" },
    );
    sections.forEach((s) => sectionObserver.observe(s));

    const reveals = document.querySelectorAll<HTMLElement>(".reveal");
    const revealObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            revealObserver.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    reveals.forEach((el) => revealObserver.observe(el));

    return () => {
      sectionObserver.disconnect();
      revealObserver.disconnect();
    };
  }, [reachSection]);

  return null;
}
