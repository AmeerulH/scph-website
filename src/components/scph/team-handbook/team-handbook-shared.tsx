import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Shared pieces for the internal team handbook (SCPH + GTP).
 *
 * Layout: flex column + `h-full` so in a CSS grid row, siblings share the same
 * card height; the image area grows (`flex-1`) when captions differ in length.
 */
export function HandbookScreenshotFigure({
  src,
  width,
  height,
  alt,
  caption,
  className,
}: {
  src: string;
  width: number;
  height: number;
  alt: string;
  caption: string;
  className?: string;
}) {
  return (
    <figure
      className={cn(
        "flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm",
        className,
      )}
    >
      <div className="flex min-h-0 flex-1 items-start justify-center bg-gray-50 p-2 sm:p-3">
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className="h-auto w-full object-contain object-top"
          sizes="(max-width: 896px) 100vw, 448px"
        />
      </div>
      <figcaption className="flex-shrink-0 border-t border-gray-100 bg-gray-50/90 px-4 py-3 text-sm leading-snug text-gray-600">
        {caption}
      </figcaption>
    </figure>
  );
}

export function HandbookScreenshotPlaceholder({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <figure className="rounded-2xl border-2 border-dashed border-gray-300 bg-gradient-to-b from-gray-50 to-gray-100/80 p-8 text-center shadow-inner">
      <figcaption className="text-sm font-semibold text-gray-800">
        {title}
      </figcaption>
      <p className="mt-2 text-sm leading-relaxed text-gray-600">{description}</p>
      <p className="mt-4 text-xs text-gray-500">
        <strong>For your team:</strong> export a PNG from Sanity or your
        browser, save it as e.g.{" "}
        <code className="rounded bg-white px-1.5 py-0.5 font-mono text-[11px] shadow-sm">
          public/images/handbook/your-file.png
        </code>
        , then ask a developer to drop in a{" "}
        <code className="rounded bg-white px-1 py-0.5 font-mono text-[11px]">
          next/image
        </code>{" "}
        here—or paste a hosted image URL if we add that field later.
      </p>
    </figure>
  );
}
