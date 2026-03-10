"use client";

import * as React from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

interface ScrollProgressProps {
  /** Ref to the scroll container (usually the section element) */
  targetRef: React.RefObject<HTMLElement | null>;
  className?: string;
}

/**
 * Scroll-driven progress bar for long resource articles.
 * Fills based on scroll position within the target element.
 */
export function ScrollProgress({ targetRef, className }: ScrollProgressProps) {
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end end"],
  });

  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

  if (prefersReducedMotion) {
    return null;
  }

  return (
    <div
      className={cn(
        "fixed left-0 right-0 top-0 z-40 h-1 bg-gray-100/50",
        className
      )}
      aria-hidden
    >
      <motion.div
        className="h-full origin-left bg-scph-green"
        style={{ scaleX }}
      />
    </div>
  );
}
