"use client";

import * as React from "react";
import { CalendarPlus } from "lucide-react";
import { cn } from "@/lib/utils";

export function AddToGoogleCalendarLink({
  href,
  className,
  children,
  stopPropagation = true,
}: {
  href: string | null;
  className?: string;
  /** When nested inside a clickable card, prevent opening the parent handler. */
  stopPropagation?: boolean;
  children?: React.ReactNode;
}) {
  if (!href) return null;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "inline-flex items-center gap-1.5 font-semibold text-gtp-teal transition-colors hover:text-gtp-teal-dark hover:underline",
        className,
      )}
      onClick={stopPropagation ? (e) => e.stopPropagation() : undefined}
      onKeyDown={
        stopPropagation
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") e.stopPropagation();
            }
          : undefined
      }
    >
      <CalendarPlus className="h-3.5 w-3.5 shrink-0" aria-hidden />
      {children ?? "Add to Google Calendar"}
    </a>
  );
}
