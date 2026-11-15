"use client";

import { useSyncExternalStore } from "react";

const query = "(prefers-reduced-motion: reduce)";
const getSnapshot = () => window.matchMedia(query).matches;
const getServerSnapshot = () => false;

function subscribe(onChange: () => void) {
  const mediaQuery = window.matchMedia(query);
  mediaQuery.addEventListener("change", onChange);
  return () => mediaQuery.removeEventListener("change", onChange);
}

/**
 * Returns true when the user prefers reduced motion.
 * Respects the prefers-reduced-motion media query for accessibility.
 */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
