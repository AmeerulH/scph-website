"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import {
  heroStaggerContainer,
  heroStaggerItem,
  heroStaggerItemReduced,
} from "@/lib/motion-presets";

export function GtpHeroGradient() {
  const prefersReducedMotion = useReducedMotion();
  const containerVariants = prefersReducedMotion
    ? { animate: { transition: { staggerChildren: 0, delayChildren: 0 } } }
    : heroStaggerContainer;
  const itemVariants = prefersReducedMotion ? heroStaggerItemReduced : heroStaggerItem;

  return (
    <div className="relative w-full">

      <motion.div
        className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-start gap-8 px-6 pb-8 pt-28 md:flex-row md:items-center md:gap-16 md:pb-10 md:pt-32 lg:px-12"
        variants={containerVariants}
        initial="initial"
        animate="animate"
      >
        {/* Left: text content */}
        <div className="flex-1">
          <motion.span
            variants={itemVariants}
            className="inline-block rounded-full border border-white/30 bg-white/10 px-5 py-2 text-sm font-semibold text-white/90 backdrop-blur-sm lg:text-base"
          >
            12–15 October 2026 · Kuala Lumpur, Malaysia
          </motion.span>

          <motion.h1
            variants={itemVariants}
            className="mt-5 font-heading text-4xl font-bold leading-tight text-white sm:text-5xl md:text-6xl lg:text-7xl"
          >
            Global Tipping Points Conference 2026
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="mt-4 max-w-2xl text-base font-light leading-snug text-white/85 sm:text-lg md:text-xl"
          >
            From Understanding to Imagination to Action: Crossing Thresholds
            for a Thriving Planet
          </motion.p>
        </div>

        {/* Right: stacked CTA buttons */}
        <motion.div
          variants={itemVariants}
          className="flex w-full flex-row flex-wrap gap-4 md:w-auto md:min-w-60 md:flex-col"
        >
          <Button
            variant="gtpCta"
            size="lg"
            className="flex-1 justify-center py-7 text-base md:flex-none"
            asChild
          >
            <Link href="/events/gtp-2026/register">Register Now →</Link>
          </Button>
          <Button
            size="lg"
            className="flex-1 justify-center rounded-full border-2 border-white/50 bg-transparent py-7 text-base text-white hover:border-white hover:bg-white/10 md:flex-none"
            asChild
          >
            <Link href="/events/gtp-2026/about#about">Learn More</Link>
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}
