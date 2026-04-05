import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type PlaceholderNoticeProps = {
  children: ReactNode;
  className?: string;
};

/** Muted footer line under marquees, grids, etc. (e.g. “coming soon” + link). */
export function PlaceholderNotice({ children, className }: PlaceholderNoticeProps) {
  return (
    <p className={cn("mt-8 text-center text-sm text-gray-400", className)}>
      {children}
    </p>
  );
}
