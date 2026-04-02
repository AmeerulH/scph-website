"use client";

import { useLayoutEffect, useState } from "react";
import { createPortal } from "react-dom";
import clsx from "clsx";
import styles from "./route-loading.module.css";

export type RouteLoadingVariant = "scph" | "gtp";

type Props = {
  variant?: RouteLoadingVariant;
  /** Announced to screen readers */
  label?: string;
};

/**
 * Full-viewport loader (morphing shape). Portals to `document.body` so it sits above
 * nav/modals and is not trapped by ancestors with transform/filter (e.g. AtmosphericReveal).
 */
export function FullPageLoadingOverlay({
  variant = "scph",
  label = "Loading",
}: Props) {
  const [mounted, setMounted] = useState(false);

  useLayoutEffect(() => {
    setMounted(true);
  }, []);

  const node = (
    <div
      className="fixed inset-0 z-10000 flex items-center justify-center bg-black/35 backdrop-blur-sm"
      role="status"
      aria-busy="true"
      aria-live="polite"
      aria-modal="true"
    >
      <div className="flex flex-col items-center gap-4">
        <div
          className={clsx(
            styles.loader,
            variant === "gtp" ? styles.gtp : styles.scph,
          )}
          aria-hidden
        />
        <span className="sr-only">{label}</span>
      </div>
    </div>
  );

  if (!mounted) return null;
  return createPortal(node, document.body);
}
