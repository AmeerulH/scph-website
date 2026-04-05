import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type TwoColumnTextImagesProps = {
  text: ReactNode;
  media: ReactNode;
  align?: "center" | "start";
  gapClassName?: string;
  className?: string;
  textColumnClassName?: string;
  mediaColumnClassName?: string;
};

export function TwoColumnTextImages({
  text,
  media,
  align = "center",
  gapClassName = "gap-12",
  className,
  textColumnClassName,
  mediaColumnClassName,
}: TwoColumnTextImagesProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 lg:grid-cols-2",
        gapClassName,
        align === "center" ? "items-center" : "items-start",
        className,
      )}
    >
      <div className={cn("min-w-0", textColumnClassName)}>{text}</div>
      <div className={mediaColumnClassName}>{media}</div>
    </div>
  );
}
