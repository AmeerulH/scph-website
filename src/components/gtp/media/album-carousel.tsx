"use client";

import * as React from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { GtpMediaImage } from "@/data/gtp-media-page-defaults";
import { cn } from "@/lib/utils";

type Props = {
  photos: GtpMediaImage[];
  /** Opens the full-screen viewer at this photo. */
  onOpen: (index: number) => void;
};

const MAX_SLIDES = 12;

/** Small-screen album view: swipeable main photo with a thumbnail strip underneath. */
export function AlbumCarousel({ photos, onOpen }: Props) {
  const slides = photos.slice(0, MAX_SLIDES);
  const [index, setIndex] = React.useState(0);
  const track = React.useRef<HTMLUListElement>(null);
  const strip = React.useRef<HTMLUListElement>(null);
  const frame = React.useRef(0);

  const goTo = (i: number) => {
    const el = track.current;
    if (!el) return;
    const next = Math.max(0, Math.min(slides.length - 1, i));
    el.scrollTo({ left: next * el.clientWidth, behavior: "smooth" });
  };

  const onScroll = () => {
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      const el = track.current;
      if (el) setIndex(Math.round(el.scrollLeft / el.clientWidth));
    });
  };

  // Keep the active thumbnail centred in its strip without scrolling the page.
  React.useEffect(() => {
    const list = strip.current;
    const thumb = list?.children[index] as HTMLElement | undefined;
    if (!list || !thumb) return;
    list.scrollTo({
      left: thumb.offsetLeft - (list.clientWidth - thumb.clientWidth) / 2,
      behavior: "smooth",
    });
  }, [index]);

  React.useEffect(() => () => cancelAnimationFrame(frame.current), []);

  return (
    <div>
      <div className="relative">
        <ul
          ref={track}
          onScroll={onScroll}
          aria-label="Album photos"
          className="flex snap-x snap-mandatory overflow-x-auto rounded-2xl [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {slides.map((photo, i) => (
            <li
              key={`${photo.src}-${i}`}
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${slides.length}`}
              className="relative aspect-4/3 w-full shrink-0 snap-center sm:aspect-3/2"
            >
              <button
                type="button"
                onClick={() => onOpen(i)}
                aria-label={`Open photo ${i + 1} full screen: ${photo.alt}`}
                className="absolute inset-0 bg-gtp-dark-teal focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-gtp-teal-light"
              >
                <Image
                  src={photo.src}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 100vw, 0px"
                  className="object-cover"
                />
              </button>
            </li>
          ))}
        </ul>

        <span className="pointer-events-none absolute bottom-3 right-3 rounded-full bg-gtp-dark-teal-dark/85 px-3 py-1 text-xs font-semibold tabular-nums text-white">
          {index + 1} / {slides.length}
        </span>

        {slides.length > 1 ? (
          <>
            <button
              type="button"
              onClick={() => goTo(index - 1)}
              disabled={index === 0}
              aria-label="Previous photo"
              className="absolute left-3 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-gtp-dark-teal-dark/80 text-white transition-opacity disabled:opacity-0"
            >
              <ChevronLeft className="size-5" aria-hidden />
            </button>
            <button
              type="button"
              onClick={() => goTo(index + 1)}
              disabled={index === slides.length - 1}
              aria-label="Next photo"
              className="absolute right-3 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-gtp-dark-teal-dark/80 text-white transition-opacity disabled:opacity-0"
            >
              <ChevronRight className="size-5" aria-hidden />
            </button>
          </>
        ) : null}
      </div>

      {slides.length > 1 ? (
        <ul
          ref={strip}
          aria-label="Photo thumbnails"
          className="relative -mx-4 mt-3 flex gap-2 overflow-x-auto px-4 py-1 [scrollbar-width:none] sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden"
        >
          {slides.map((photo, i) => (
            <li key={`${photo.src}-thumb-${i}`} className="shrink-0">
              <button
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Show photo ${i + 1}`}
                aria-current={i === index ? "true" : undefined}
                className={cn(
                  "relative block h-16 w-20 overflow-hidden rounded-lg bg-gtp-dark-teal ring-2 ring-offset-2 ring-offset-gtp-dark-teal-dark transition-[opacity,box-shadow] duration-300 ease-out sm:h-20 sm:w-28",
                  i === index ? "opacity-100 ring-gtp-orange" : "opacity-55 ring-transparent",
                )}
              >
                <Image
                  src={photo.src}
                  alt=""
                  fill
                  sizes="112px"
                  className="object-cover"
                />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
