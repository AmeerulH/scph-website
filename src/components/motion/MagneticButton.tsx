"use client";

import * as React from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { magneticConfig } from "@/lib/motion-presets";
import { cn } from "@/lib/utils";

const MAGNETIC_STRENGTH = 4;

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  asChild?: boolean;
}

/**
 * Subtle "magnetic" hover effect: button gently pulls toward cursor.
 * Respects prefers-reduced-motion (disables effect).
 */
export function MagneticButton({
  children,
  className,
  asChild = false,
}: MagneticButtonProps) {
  const prefersReducedMotion = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { stiffness: magneticConfig.stiffness, damping: magneticConfig.damping };
  const xSpring = useSpring(x, springConfig);
  const ySpring = useSpring(y, springConfig);

  const handleMouseMove = React.useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (prefersReducedMotion) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const deltaX = (e.clientX - centerX) / rect.width;
      const deltaY = (e.clientY - centerY) / rect.height;
      x.set(deltaX * MAGNETIC_STRENGTH);
      y.set(deltaY * MAGNETIC_STRENGTH);
    },
    [prefersReducedMotion, x, y]
  );

  const handleMouseLeave = React.useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  if (asChild && React.isValidElement(children)) {
    return (
      <motion.div
        style={{ x: prefersReducedMotion ? 0 : xSpring, y: prefersReducedMotion ? 0 : ySpring }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={cn("inline-block", className)}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      style={{ x: prefersReducedMotion ? 0 : xSpring, y: prefersReducedMotion ? 0 : ySpring }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn("inline-block", className)}
    >
      {children}
    </motion.div>
  );
}
