"use client";

import { useEffect } from "react";
import { isSectionId } from "@/lib/state-machine";
import { useConsole } from "./ConsoleProvider";

/**
 * Watches the console modules inside the scrollable screen: advances the
 * visitor state machine, tracks the active module for the rail LEDs, and
 * applies .revealed for the power-on wipe of any .reveal element.
 */
export function SectionObserver() {
  const { reachSection, setActiveSection } = useConsole();

  useEffect(() => {
    // No IntersectionObserver (very old browser / restricted webview):
    // show everything and leave the state machine at RECEIVED.
    if (typeof IntersectionObserver === "undefined") {
      document
        .querySelectorAll<HTMLElement>(".reveal")
        .forEach((el) => el.classList.add("revealed"));
      return;
    }

    const root = document.getElementById("console-screen");
    const sections = document.querySelectorAll<HTMLElement>("section[data-module]");

    const sectionObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const id = entry.target.id;
          if (isSectionId(id)) {
            reachSection(id);
            setActiveSection(id);
          } else if (id === "top") {
            setActiveSection(null);
          }
        }
      },
      { root, rootMargin: "-35% 0px -35% 0px" },
    );
    sections.forEach((s) => sectionObserver.observe(s));
    const hero = document.getElementById("top");
    if (hero) sectionObserver.observe(hero);

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
      { root, rootMargin: "0px 0px -8% 0px" },
    );
    reveals.forEach((el) => revealObserver.observe(el));

    return () => {
      sectionObserver.disconnect();
      revealObserver.disconnect();
    };
  }, [reachSection, setActiveSection]);

  return null;
}
