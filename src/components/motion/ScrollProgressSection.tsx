"use client";

import * as React from "react";
import { ScrollProgress } from "./ScrollProgress";

interface ScrollProgressSectionProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Wraps long-form content with a scroll-driven progress bar.
 * Use for resource articles and long sections.
 */
export function ScrollProgressSection({
  children,
  className,
}: ScrollProgressSectionProps) {
  const targetRef = React.useRef<HTMLDivElement>(null);

  return (
    <>
      <ScrollProgress targetRef={targetRef} />
      <div ref={targetRef} className={className}>
        {children}
      </div>
    </>
  );
}
