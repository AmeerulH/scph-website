"use client";

import { motion } from "motion/react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { atmosphericFade, atmosphericFadeReduced } from "@/lib/motion-presets";
import { cn } from "@/lib/utils";

interface AtmosphericRevealProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Atmospheric Fade: opacity + 10px blur + 1% scale-up.
 * Pages feel like they are coming into focus.
 * Respects prefers-reduced-motion.
 */
export function AtmosphericReveal({
  children,
  className,
}: AtmosphericRevealProps) {
  const prefersReducedMotion = useReducedMotion();
  const variants = prefersReducedMotion ? atmosphericFadeReduced : atmosphericFade;

  return (
    <motion.div
      initial={variants.initial}
      animate={variants.animate}
      transition={variants.transition}
      className={cn("contain-[layout_paint]", className)}
    >
      {children}
    </motion.div>
  );
}
