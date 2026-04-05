import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type PartnerMarqueeSlot = "f1" | "f2" | "r1" | "r2";

export type PartnerMarqueeProps = {
  /** Renders one horizontal strip; called four times with unique keys for duplicated marquee content. */
  renderRow: (slot: PartnerMarqueeSlot) => ReactNode;
  maskClassName?: string;
  /** Default adds bottom margin below the forward strip (e.g. `mb-5` on GTP sponsors). */
  forwardStripClassName?: string;
  reverseStripClassName?: string;
};

export function PartnerMarquee({
  renderRow,
  maskClassName,
  forwardStripClassName,
  reverseStripClassName,
}: PartnerMarqueeProps) {
  return (
    <div className={cn("overflow-hidden", maskClassName)}>
      <div
        className={cn(
          "flex w-max animate-marquee will-change-transform",
          forwardStripClassName ?? "mb-4",
        )}
      >
        {renderRow("f1")}
        {renderRow("f2")}
      </div>
      <div
        className={cn(
          "flex w-max animate-marquee-reverse will-change-transform",
          reverseStripClassName,
        )}
      >
        {renderRow("r1")}
        {renderRow("r2")}
      </div>
    </div>
  );
}

export type PartnerLogoPlaceholderProps = {
  className?: string;
  /** Adds shadow-sm (GTP sponsors strip). */
  elevated?: boolean;
};

export function PartnerLogoPlaceholder({
  className,
  elevated,
}: PartnerLogoPlaceholderProps) {
  return (
    <div
      className={cn(
        "mr-4 flex h-20 w-40 shrink-0 items-center justify-center rounded-xl border border-gray-100 bg-gray-50",
        elevated && "shadow-sm",
        className,
      )}
    >
      <span className="text-xs font-medium text-gray-400">Partner Logo</span>
    </div>
  );
}
