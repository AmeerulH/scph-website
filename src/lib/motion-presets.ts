// SCPH Motion Design System — "Quiet Premium"
// Spring: stiffness 90, damping 22 — "weighted" feel per spec

export const scphSpring = { stiffness: 90, damping: 22, mass: 1 };

// Atmospheric Fade: opacity + 10px blur + 1% scale-up
export const atmosphericFade = {
  initial: { opacity: 0, filter: "blur(10px)", scale: 0.99 },
  animate: { opacity: 1, filter: "blur(0px)", scale: 1 },
  transition: { type: "spring" as const, ...scphSpring },
};

// Reduced motion: instant, no blur/scale
export const atmosphericFadeReduced = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.01 },
};

// Stagger delay per child (organic growth) — slower for scroll-triggered
export const staggerContainer = {
  animate: {
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

export const staggerItem = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { type: "spring" as const, stiffness: 55, damping: 22, mass: 1 },
};

// Stagger for longer lists (e.g. 7 pillars)
export const staggerContainerLong = {
  animate: {
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
};

export const staggerItemReduced = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.01 },
};

// Magnetic hover: subtle pull toward cursor
export const magneticConfig = { stiffness: 90, damping: 22 };

// Hero text: sleek staggered entrance (slower, more deliberate)
export const heroStaggerContainer = {
  animate: {
    transition: { staggerChildren: 0.2, delayChildren: 0.25 },
  },
};
export const heroStaggerItem = {
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { type: "spring" as const, stiffness: 55, damping: 24, mass: 1 },
};
export const heroStaggerItemReduced = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.01 },
};

// Scroll reveal: content animates when scrolled into view
// Slower spring for a more relaxed, deliberate feel
export const scrollRevealSpring = { stiffness: 55, damping: 22, mass: 1 };
export const scrollReveal = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  transition: { type: "spring" as const, ...scrollRevealSpring },
};

export const scrollRevealReduced = {
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  transition: { duration: 0.01 },
};
