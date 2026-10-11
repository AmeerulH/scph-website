import Image from "next/image";
import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

/** Keep supplied artwork whole, including when a sticky column has limited height. */
export function ProgrammePosterImage({
  src,
  alt,
  width,
  height,
  sizes,
  priority = false,
  className,
}: {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  sizes: string;
  priority?: boolean;
  className?: string;
}) {
  // Sanity asset URLs carry dimensions, including for legacy programme records.
  const dimensions = src.match(/-(\d+)x(\d+)\.[a-z]+(?:[?#]|$)/i);
  const imageWidth = width || Number(dimensions?.[1]) || 900;
  const imageHeight = height || Number(dimensions?.[2]) || 1200;

  return (
    <Image
      src={src}
      alt={alt}
      width={imageWidth}
      height={imageHeight}
      sizes={sizes}
      priority={priority}
      style={{ "--poster-ratio": imageWidth / imageHeight } as CSSProperties}
      className={cn("h-auto w-full max-w-full object-contain", className)}
    />
  );
}
