"use client";

import * as React from "react";
import Link from "next/link";
import { Clock, UserCircle2, ChevronLeft, ChevronRight } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import { cn } from "@/lib/utils";
import { TYPE_META, TYPE_GRADIENTS } from "@/components/gtp/programmes/data";
import type { GtpFeaturedCarouselSession } from "@/sanity/queries";

// ─── Individual event card ────────────────────────────────────────────────────

function EventCard({ session }: { session: GtpFeaturedCarouselSession }) {
  const meta = TYPE_META[session.type];
  const MetaIcon = meta.Icon;
  const gradient =
    TYPE_GRADIENTS[session.type] ?? "from-gtp-dark-teal to-gtp-teal";

  const href = `/events/gtp-2026/programmes?tab=${session.tabId}&session=${encodeURIComponent(session.title)}`;

  const speakers = session.speakers ?? [];
  const displaySpeakers = speakers.slice(0, 2);
  const extraCount = speakers.length - displaySpeakers.length;

  return (
    <Link
      href={href}
      // Portrait shape: taller than wide. Scale-up on hover, z-index lifted so it renders above siblings.
      className="group relative h-80 w-60 shrink-0 overflow-hidden rounded-2xl shadow-lg transition-all duration-300 ease-out hover:z-10 hover:scale-105 hover:shadow-2xl"
    >
      {/* Full-card gradient background */}
      <div className={cn("absolute inset-0 bg-linear-to-br", gradient)}>
        {/* Dot grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.13]"
          style={{
            backgroundImage:
              "radial-gradient(circle, white 1.5px, transparent 1.5px)",
            backgroundSize: "28px 28px",
          }}
        />
        {/* Radial glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_40%,rgba(255,255,255,0.18),transparent_65%)]" />
      </div>

      {/* Day + date chip — top-left */}
      <div className="absolute left-3 top-3 z-10">
        <span className="rounded-full bg-black/35 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-sm ring-1 ring-white/20">
          {session.dayNumber} · {session.dateLabel}
        </span>
      </div>

      {/* Session type badge — centred in upper gradient area (above glass panel) */}
      <div className="absolute inset-x-0 top-0 z-10 flex h-[calc(100%-96px)] items-center justify-center">
        <span className="flex items-center gap-1.5 rounded-full bg-white/20 px-4 py-1.5 text-xs font-semibold text-white backdrop-blur-sm ring-1 ring-white/30">
          <MetaIcon className="h-3.5 w-3.5" />
          {meta.label}
        </span>
      </div>

      {/* Glass text panel — pinned to bottom */}
      <div className="absolute inset-x-0 bottom-0 z-10 bg-black/40 px-4 py-3 backdrop-blur-md">
        <h3 className="line-clamp-1 font-heading text-sm font-bold leading-snug text-white">
          {session.title}
        </h3>

        <div className="mt-1 flex items-center gap-1.5 text-[11px] text-white/60">
          <Clock className="h-3 w-3 shrink-0" />
          <span>{session.time}</span>
          {session.durationMins && (
            <span className="text-white/40">· {session.durationMins} mins</span>
          )}
        </div>

        <div className="mt-1">
          {displaySpeakers.length > 0 ? (
            <div className="flex items-center gap-1.5">
              <UserCircle2 className="h-3 w-3 shrink-0 text-white/50" />
              <span className="truncate text-[11px] text-white/70">
                {displaySpeakers.map((s) => s.name).join(", ")}
                {extraCount > 0 && (
                  <span className="text-white/45"> +{extraCount} more</span>
                )}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <UserCircle2 className="h-3 w-3 shrink-0 text-white/30" />
              <span className="text-[11px] italic text-white/35">Speakers TBC</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

// ─── Carousel nav button ──────────────────────────────────────────────────────

function NavButton({
  onClick,
  disabled,
  direction,
}: {
  onClick: () => void;
  disabled: boolean;
  direction: "prev" | "next";
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === "prev" ? "Scroll left" : "Scroll right"}
      className={cn(
        "hidden h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-sm transition-all duration-200 md:flex",
        disabled
          ? "cursor-not-allowed opacity-25"
          : "hover:border-white/40 hover:bg-white/20",
      )}
    >
      {direction === "prev" ? (
        <ChevronLeft className="h-4 w-4" />
      ) : (
        <ChevronRight className="h-4 w-4" />
      )}
    </button>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function GtpEventsPreviewCarousel({
  sessions,
}: {
  sessions: GtpFeaturedCarouselSession[];
}) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    dragFree: true,
    containScroll: "trimSnaps",
  });

  const [canScrollPrev, setCanScrollPrev] = React.useState(false);
  const [canScrollNext, setCanScrollNext] = React.useState(true);

  const onSelect = React.useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  React.useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <section className="relative w-full pt-6 pb-8">
      {/* Section header */}
      <div className="mb-4 flex items-center justify-between px-4 sm:px-6 lg:px-10">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gtp-teal">
            Conference Programme
          </p>
          <h2 className="mt-0.5 font-heading text-xl font-bold text-white sm:text-2xl">
            What&apos;s On
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <NavButton
            direction="prev"
            onClick={() => emblaApi?.scrollPrev()}
            disabled={!canScrollPrev}
          />
          <NavButton
            direction="next"
            onClick={() => emblaApi?.scrollNext()}
            disabled={!canScrollNext}
          />
        </div>
      </div>

      {/*
        -my-16 py-16: gives 64px of visual overflow room above/below the track
        so hover:scale-105 and shadow-2xl (~63px spread) are never clipped.
        The negative margin cancels the padding from the layout flow.
      */}
      <div className="-my-16 overflow-hidden py-16 px-4 sm:px-6 lg:px-10" ref={emblaRef}>
        <div className="flex gap-3 sm:gap-4">
          {sessions.map((session, i) => (
            <EventCard key={`${session.tabId}-${session.title}-${session.time}-${i}`} session={session} />
          ))}
        </div>
      </div>

      {/* Footer link */}
      <div className="mt-6 px-4 text-right sm:px-6 lg:px-10">
        <Link
          href="/events/gtp-2026/programmes"
          className="text-xs font-semibold text-gtp-teal/80 hover:text-gtp-teal hover:underline"
        >
          View full programme →
        </Link>
      </div>
    </section>
  );
}
