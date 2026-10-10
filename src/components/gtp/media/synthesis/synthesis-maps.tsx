"use client";

import * as React from "react";
import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import type { GtpSynthesisMap } from "@/data/gtp-visual-synthesis-defaults";
import { cn } from "@/lib/utils";

const controlClass =
  "inline-flex touch-manipulation items-center justify-center gap-2 rounded-full border border-white/25 text-white transition-[background-color,transform] duration-150 ease-[var(--ease-out-strong)] hover:bg-white/10 active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gtp-teal-light";

function Reveal({
  enabled,
  children,
}: {
  enabled: boolean;
  children: React.ReactNode;
}) {
  return enabled ? (
    <ScrollReveal margin="0px 0px -8% 0px">{children}</ScrollReveal>
  ) : (
    <>{children}</>
  );
}

function ViewerBody({
  map,
  position,
  total,
  onClose,
  onStep,
}: {
  map: GtpSynthesisMap;
  position: number;
  total: number;
  onClose: () => void;
  onStep: (dir: 1 | -1) => void;
}) {
  // Remounted per map (key), so every map opens fitted to the screen.
  const [actual, setActual] = React.useState(false);
  const touchX = React.useRef<number | null>(null);
  const scroller = React.useRef<HTMLDivElement>(null);
  const actualImg = React.useRef<HTMLImageElement>(null);
  // Where on the map (0 to 1) the reader asked to zoom into; the centre when they used the button.
  const anchor = React.useRef({ x: 0.5, y: 0.5 });
  const { image } = map;

  // Opening actual size would otherwise start at the top-left corner; land on the chosen point.
  React.useLayoutEffect(() => {
    const box = scroller.current;
    const img = actualImg.current;
    if (!actual || !box || !img) return;
    box.scrollLeft =
      img.offsetLeft + anchor.current.x * img.offsetWidth - box.clientWidth / 2;
    box.scrollTop =
      img.offsetTop +
      anchor.current.y * img.offsetHeight -
      box.clientHeight / 2;
  }, [actual]);

  return (
    <div
      className="flex h-full flex-col"
      onTouchStart={(e) => {
        touchX.current = actual ? null : e.touches[0].clientX;
      }}
      onTouchEnd={(e) => {
        if (touchX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        if (Math.abs(dx) > 60) onStep(dx < 0 ? 1 : -1);
        touchX.current = null;
      }}
    >
      <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <p className="min-w-0 truncate text-sm text-white/70" title={map.title}>
          <span className="font-semibold text-white">{map.title}</span>
          {total > 1 ? (
            <span className="ml-3 tabular-nums">
              {position + 1} / {total}
            </span>
          ) : null}
        </p>
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={() => {
              anchor.current = { x: 0.5, y: 0.5 };
              setActual((v) => !v);
            }}
            aria-pressed={actual}
            className={cn(controlClass, "h-10 px-4 text-sm font-medium")}
          >
            {actual ? (
              <ZoomOut className="size-4" aria-hidden />
            ) : (
              <ZoomIn className="size-4" aria-hidden />
            )}
            {actual ? "Fit to screen" : "Actual size"}
          </button>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close full size viewer"
            className={cn(controlClass, "size-10")}
          >
            <X className="size-5" aria-hidden />
          </button>
        </div>
      </div>

      <div
        ref={scroller}
        className={cn(
          "relative min-h-0 flex-1 overflow-auto overscroll-contain px-4 pb-4 sm:px-6",
          actual
            ? "[touch-action:pan-x_pan-y_pinch-zoom]"
            : "flex items-center justify-center",
        )}
      >
        {actual ? (
          <Image
            ref={actualImg}
            src={image.src}
            alt={image.alt}
            width={image.width}
            height={image.height}
            sizes={`${image.width}px`}
            className="h-auto max-w-none cursor-zoom-out"
            style={{ width: image.width }}
            onClick={() => setActual(false)}
          />
        ) : (
          <Image
            src={image.src}
            alt={image.alt}
            width={image.width}
            height={image.height}
            sizes="100vw"
            className="h-auto max-h-full w-auto max-w-full cursor-zoom-in object-contain"
            onClick={(e) => {
              const r = e.currentTarget.getBoundingClientRect();
              anchor.current = {
                x: (e.clientX - r.left) / r.width,
                y: (e.clientY - r.top) / r.height,
              };
              setActual(true);
            }}
          />
        )}
      </div>

      {total > 1 ? (
        <div className="flex items-center justify-center gap-3 px-4 pb-4">
          <button
            type="button"
            onClick={() => onStep(-1)}
            aria-label="Previous map"
            className={cn(controlClass, "size-11")}
          >
            <ChevronLeft className="size-6" aria-hidden />
          </button>
          <button
            type="button"
            onClick={() => onStep(1)}
            aria-label="Next map"
            className={cn(controlClass, "size-11")}
          >
            <ChevronRight className="size-6" aria-hidden />
          </button>
        </div>
      ) : null}
    </div>
  );
}

function Viewer({
  maps,
  index,
  onClose,
  onIndex,
}: {
  maps: GtpSynthesisMap[];
  index: number | null;
  onClose: () => void;
  onIndex: (i: number) => void;
}) {
  const ref = React.useRef<HTMLDialogElement>(null);
  const open = index !== null;
  const total = maps.length;

  React.useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  const step = React.useCallback(
    (dir: 1 | -1) => {
      if (index === null) return;
      onIndex((index + dir + total) % total);
    },
    [index, total, onIndex],
  );

  const map = index !== null ? maps[index] : null;

  return (
    <dialog
      ref={ref}
      aria-label="Full size map viewer"
      onClose={onClose}
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
      onKeyDown={(e) => {
        if (total < 2) return;
        if (e.key === "ArrowRight") step(1);
        if (e.key === "ArrowLeft") step(-1);
      }}
      className="synthesis-viewer m-0 h-dvh max-h-none w-screen max-w-none bg-gtp-dark-teal-dark p-0 text-white"
    >
      {map && index !== null ? (
        <ViewerBody
          key={map.id}
          map={map}
          position={index}
          total={total}
          onClose={onClose}
          onStep={step}
        />
      ) : null}
    </dialog>
  );
}

/** The maps for one day, shown whole, with a full size viewer for reading the small text. */
export function SynthesisMaps({ maps }: { maps: GtpSynthesisMap[] }) {
  const [viewer, setViewer] = React.useState<number | null>(null);

  return (
    <>
      {maps.length > 3 ? (
        <nav aria-label="Maps on this day" className="mb-12">
          <ol className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
            {maps.map((m, i) => (
              <li key={m.id}>
                <a
                  href={`#map-${m.id}`}
                  className="text-white/70 underline decoration-white/25 underline-offset-4 transition-colors hover:text-white hover:decoration-white/60 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gtp-teal-light"
                >
                  <span className="tabular-nums text-white/45">{i + 1}.</span>{" "}
                  {m.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>
      ) : null}

      <ol className="space-y-16 lg:space-y-24">
        {maps.map((m, i) => (
          <li key={m.id} id={`map-${m.id}`} className="scroll-mt-28">
            {/* The first map is the likely LCP image and stays still; later maps settle in as the reader arrives. */}
            <Reveal enabled={i > 0}>
              <article>
                <header className="mb-5 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                  <h3 className="font-heading text-xl font-semibold text-balance text-white md:text-2xl">
                    {m.title}
                  </h3>
                  {m.timeLabel ? (
                    <p className="text-sm tabular-nums text-white/60">
                      {m.timeLabel}
                    </p>
                  ) : null}
                </header>

                <figure>
                  <div onClick={() => setViewer(i)} className="cursor-zoom-in">
                    <Image
                      src={m.image.src}
                      alt={m.image.alt}
                      width={m.image.width}
                      height={m.image.height}
                      sizes="(min-width: 1280px) 62rem, (min-width: 1024px) 70vw, 100vw"
                      priority={i === 0}
                      className="h-auto w-full shadow-[0_28px_70px_-28px_rgb(0_0_0/0.65)]"
                    />
                  </div>
                  {m.summary ? (
                    <figcaption className="mt-5 max-w-[65ch] text-base leading-relaxed text-white/80">
                      {m.summary}
                    </figcaption>
                  ) : null}
                </figure>

                <button
                  type="button"
                  onClick={() => setViewer(i)}
                  className={cn(
                    controlClass,
                    "mt-5 h-11 px-5 text-sm font-medium",
                  )}
                >
                  <Maximize2 className="size-4" aria-hidden />
                  View full size
                  <span className="sr-only">: {m.title}</span>
                </button>
              </article>
            </Reveal>
          </li>
        ))}
      </ol>

      <Viewer
        maps={maps}
        index={viewer}
        onClose={() => setViewer(null)}
        onIndex={setViewer}
      />
    </>
  );
}
