"use client";

import { motion } from "motion/react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { scrollReveal, scrollRevealReduced } from "@/lib/motion-presets";
import { cn } from "@/lib/utils";

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  /** Custom viewport margin */
  margin?: string;
  /** Fraction of element that must be visible to trigger (0–1). Default 0.1 */
  amount?: number;
}

/**
 * Scroll-triggered reveal: content animates in when ~50% of section is visible.
 * Uses opacity + subtle Y translate. Respects prefers-reduced-motion.
 */
export function ScrollReveal({
  children,
  className,
  margin,
  amount = 0.1,
}: ScrollRevealProps) {
  const prefersReducedMotion = useReducedMotion();
  const variants = prefersReducedMotion ? scrollRevealReduced : scrollReveal;

  return (
    <motion.div
      initial={variants.initial}
      whileInView={variants.whileInView}
      viewport={{
        once: true,
        amount,
        margin: prefersReducedMotion ? undefined : margin,
      }}
      transition={variants.transition}
      className={cn("overflow-visible", className)}
    >
      {children}
    </motion.div>
  );
}
