"use client";

import { motion } from "motion/react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { atmosphericFade, atmosphericFadeReduced } from "@/lib/motion-presets";
import { cn } from "@/lib/utils";

interface AtmosphericRevealProps {
  children: React.ReactNode;
  className?: string;
  /**
   * Skip opacity/blur entrance. Use under GTP layout so <main> is not invisible while
   * the footer (outside <main>) stays visible — avoids a “footer only” frame and CLS.
   */
  disableEntrance?: boolean;
}

/**
 * Atmospheric Fade: opacity + 10px blur + 1% scale-up.
 * Pages feel like they are coming into focus.
 * Respects prefers-reduced-motion.
 */
export function AtmosphericReveal({
  children,
  className,
  disableEntrance = false,
}: AtmosphericRevealProps) {
  const prefersReducedMotion = useReducedMotion();
  const variants = prefersReducedMotion ? atmosphericFadeReduced : atmosphericFade;

  return (
    <motion.div
      initial={disableEntrance ? false : variants.initial}
      animate={variants.animate}
      transition={variants.transition}
      className={cn("contain-[layout_paint]", className)}
    >
      {children}
    </motion.div>
  );
}
