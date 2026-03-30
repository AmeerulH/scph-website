"use client";

import * as React from "react";
import { motion } from "motion/react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import {
  staggerContainer,
  staggerItem,
  staggerContainerLong,
  staggerItemReduced,
} from "@/lib/motion-presets";
import { cn } from "@/lib/utils";

interface StaggerRevealProps {
  children: React.ReactNode;
  className?: string;
  /** Use "long" for 7+ items (e.g. pillars), "default" for 3-4 items */
  variant?: "default" | "long";
  /** Fraction of element that must be visible to trigger (0–1). Default 0.15 */
  amount?: number;
}

/**
 * Organic Staggering: children appear sequentially like natural growth.
 * Respects prefers-reduced-motion.
 */
export function StaggerReveal({
  children,
  className,
  variant = "default",
  amount = 0.1,
}: StaggerRevealProps) {
  const prefersReducedMotion = useReducedMotion();
  const containerVariants = prefersReducedMotion
    ? { animate: { transition: { staggerChildren: 0, delayChildren: 0 } } }
    : variant === "long"
      ? staggerContainerLong
      : staggerContainer;
  const itemVariants = prefersReducedMotion ? staggerItemReduced : staggerItem;

  return (
    <motion.div
      variants={containerVariants}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, amount }}
      className={cn(className)}
    >
      {Array.isArray(children)
        ? children.map((child, i) => (
            <motion.div key={i} variants={itemVariants}>
              {child}
            </motion.div>
          ))
        : React.Children.map(children, (child, i) => (
            <motion.div key={i} variants={itemVariants}>
              {child}
            </motion.div>
          ))}
    </motion.div>
  );
}
