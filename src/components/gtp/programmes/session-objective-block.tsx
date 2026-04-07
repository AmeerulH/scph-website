"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/** Label + body for optional programme session / workshop objectives from CMS. */
export function SessionObjectiveBlock({
  text,
  className,
  /** On viewports below `md`, clamp objective to 3 lines with View more / View less when it overflows. */
  collapsibleOnMobile = false,
}: {
  text: string | undefined;
  className?: string;
  collapsibleOnMobile?: boolean;
}) {
  const t = typeof text === "string" ? text.trim() : "";
  const [expanded, setExpanded] = React.useState(false);
  const [isOverflowing, setIsOverflowing] = React.useState(false);
  const contentRef = React.useRef<HTMLParagraphElement>(null);

  const measureOverflow = React.useCallback(() => {
    if (!collapsibleOnMobile) return;
    const el = contentRef.current;
    if (!el) return;
    if (expanded) {
      setIsOverflowing(true);
      return;
    }
    setIsOverflowing(el.scrollHeight > el.clientHeight + 1);
  }, [collapsibleOnMobile, expanded]);

  React.useLayoutEffect(() => {
    measureOverflow();
  }, [measureOverflow, t]);

  React.useEffect(() => {
    if (!collapsibleOnMobile || typeof window === "undefined") return;
    const ro = new ResizeObserver(() => measureOverflow());
    const el = contentRef.current;
    if (el) ro.observe(el);
    return () => ro.disconnect();
  }, [collapsibleOnMobile, measureOverflow, t]);

  if (!t) return null;

  return (
    <div className={cn("min-w-0", className)}>
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-gtp-teal/80">
        Objective
      </p>
      <p
        ref={contentRef}
        className={cn(
          "mt-1.5 whitespace-pre-wrap wrap-anywhere text-sm leading-relaxed text-gray-600",
          collapsibleOnMobile && !expanded && "max-md:line-clamp-3",
        )}
      >
        {t}
      </p>
      {collapsibleOnMobile && isOverflowing ? (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setExpanded((x) => !x);
          }}
          className="mt-1.5 text-xs font-semibold text-gtp-teal hover:underline md:hidden"
        >
          {expanded ? "View less" : "View more"}
        </button>
      ) : null}
    </div>
  );
}
