"use client";

import * as React from "react";
import * as ReactDOM from "react-dom";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import useEmblaCarousel from "embla-carousel-react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { ActionWorkshopRegistration } from "./action-workshop-registration";
import type { GtpProgrammeActivityPage } from "@/data/gtp-programme-activity-defaults";
import { cn } from "@/lib/utils";

type Workshop = GtpProgrammeActivityPage["entries"][number];

function ScrollButton({
  direction,
  disabled,
  onClick,
}: {
  direction: "previous" | "next";
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={`Scroll ${direction}`}
      className={cn(
        "flex size-9 items-center justify-center rounded-full border border-gtp-teal/20 bg-white text-gtp-dark-teal shadow-sm transition-colors",
        disabled ? "cursor-not-allowed opacity-35" : "hover:border-gtp-teal hover:bg-gtp-teal hover:text-white",
      )}
    >
      {direction === "previous" ? <ChevronLeft className="size-4" /> : <ChevronRight className="size-4" />}
    </button>
  );
}

function WorkshopDetailModal({
  workshop,
  onClose,
}: {
  workshop: Workshop | null;
  onClose: () => void;
}) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  React.useEffect(() => {
    if (!workshop) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [workshop]);

  if (!mounted) return null;

  return ReactDOM.createPortal(
    <AnimatePresence>
      {workshop ? (
        <motion.div
          className="fixed inset-0 z-60 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-gtp-dark-teal/70 backdrop-blur-sm" />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="action-workshop-title"
            className="relative z-10 w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl"
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="relative min-h-28 bg-linear-to-br from-gtp-dark-teal to-gtp-teal px-6 pb-5 pt-6 text-white">
              <div className="absolute inset-0 bg-[radial-gradient(circle,white_1px,transparent_1px)] bg-size-[28px_28px] opacity-[0.1]" />
              <button
                type="button"
                onClick={onClose}
                className="absolute right-3 top-3 z-10 flex size-8 items-center justify-center rounded-full bg-black/25 transition-colors hover:bg-black/40"
                aria-label="Close workshop details"
              >
                <X className="size-4" />
              </button>
              <p className="relative text-xs font-semibold uppercase tracking-[0.16em] text-white/70">
                {workshop.dateLabel}
              </p>
              <h2 id="action-workshop-title" className="relative mt-2 max-w-xl font-heading text-xl font-bold leading-snug">
                {workshop.title}
              </h2>
            </div>
            <div className="p-6">
              <p className="whitespace-pre-line text-sm leading-relaxed text-slate-600">
                {workshop.description || "Workshop details will be announced soon."}
              </p>
              <div className="mt-7 border-t border-slate-100 pt-6">
                <p className="mb-3 text-sm font-semibold text-gtp-dark-teal">
                  Ready to register?
                </p>
                <ActionWorkshopRegistration />
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}

function WorkshopRow({
  date,
  workshops,
  onSelect,
  highlightedWorkshopTitle,
  highlightedWorkshopRef,
}: {
  date: string;
  workshops: Workshop[];
  onSelect: (workshop: Workshop) => void;
  highlightedWorkshopTitle: string | null;
  highlightedWorkshopRef: React.RefObject<HTMLButtonElement | null>;
}) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    dragFree: true,
    containScroll: "trimSnaps",
  });
  const [canScrollPrev, setCanScrollPrev] = React.useState(false);
  const [canScrollNext, setCanScrollNext] = React.useState(true);

  const updateControls = React.useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  React.useEffect(() => {
    if (!emblaApi) return;
    updateControls();
    emblaApi.on("select", updateControls);
    emblaApi.on("reInit", updateControls);
    return () => {
      emblaApi.off("select", updateControls);
      emblaApi.off("reInit", updateControls);
    };
  }, [emblaApi, updateControls]);

  return (
    <section aria-labelledby={`action-workshops-${date.replaceAll(" ", "-")}`}>
      <div className="mb-4 flex items-center justify-between">
        <h2 id={`action-workshops-${date.replaceAll(" ", "-")}`} className="font-heading text-2xl font-bold text-gtp-dark-teal">
          {date}
        </h2>
        <div className="flex gap-2">
          <ScrollButton direction="previous" disabled={!canScrollPrev} onClick={() => emblaApi?.scrollPrev()} />
          <ScrollButton direction="next" disabled={!canScrollNext} onClick={() => emblaApi?.scrollNext()} />
        </div>
      </div>
      <div className="-my-10 overflow-hidden py-10" ref={emblaRef}>
        <div className="flex gap-4">
          {workshops.map((workshop) => {
            const isHighlighted = workshop.title === highlightedWorkshopTitle;

            return (
              <button
                key={workshop.title}
                ref={isHighlighted ? highlightedWorkshopRef : undefined}
                type="button"
                onClick={() => onSelect(workshop)}
                aria-current={isHighlighted ? "true" : undefined}
                className={cn(
                  "group relative h-80 w-60 shrink-0 overflow-hidden rounded-2xl bg-gtp-dark-teal text-left shadow-lg transition-transform duration-300 hover:z-10 hover:scale-[1.03] focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-gtp-teal",
                  isHighlighted && "z-10 scale-[1.03] ring-4 ring-gtp-orange ring-offset-4",
                )}
              >
              {workshop.posterUrl ? (
                <Image
                  src={workshop.posterUrl}
                  alt={workshop.posterAlt || `${workshop.title} poster`}
                  fill
                  sizes="240px"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="absolute inset-0 bg-linear-to-br from-gtp-dark-teal via-gtp-teal to-gtp-dark-teal">
                  <div className="absolute inset-0 bg-[radial-gradient(circle,white_1px,transparent_1px)] bg-size-[28px_28px] opacity-[0.14]" />
                </div>
              )}
              {!workshop.posterUrl ? (
                <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/15 to-transparent" />
              ) : null}
              <div className="absolute left-3 top-3">
                <span className="rounded-full bg-black/35 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-sm ring-1 ring-white/20">
                  Action Workshop
                </span>
              </div>
              <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                {workshop.posterUrl ? null : (
                  <h3 className="line-clamp-3 font-heading text-base font-bold leading-snug">
                    {workshop.title}
                  </h3>
                )}
                <p
                  className={cn(
                    "text-xs font-semibold text-white/70",
                    workshop.posterUrl ? "" : "mt-2",
                  )}
                >
                  View details →
                </p>
              </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function ActionWorkshopsCarousel({
  entries,
}: {
  entries: GtpProgrammeActivityPage["entries"];
}) {
  const [selected, setSelected] = React.useState<Workshop | null>(null);
  const searchParams = useSearchParams();
  const requestedWorkshopTitle = searchParams.get("workshop")?.trim() || null;
  const [highlightedWorkshopTitle, setHighlightedWorkshopTitle] = React.useState<string | null>(null);
  const highlightedWorkshopRef = React.useRef<HTMLButtonElement | null>(null);
  const groups = entries.reduce<Record<string, Workshop[]>>((result, entry) => {
    const date = entry.dateLabel || "To be confirmed";
    (result[date] ??= []).push(entry);
    return result;
  }, {});

  React.useEffect(() => {
    if (!requestedWorkshopTitle) return;

    setHighlightedWorkshopTitle(requestedWorkshopTitle);
    const frame = window.requestAnimationFrame(() => {
      highlightedWorkshopRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center",
      });
      highlightedWorkshopRef.current?.focus({ preventScroll: true });
    });
    const timeout = window.setTimeout(() => setHighlightedWorkshopTitle(null), 5000);

    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(timeout);
    };
  }, [requestedWorkshopTitle]);

  return (
    <>
      <div id="action-workshops" className="mt-12 space-y-12">
        {Object.entries(groups).map(([date, workshops]) => (
          <WorkshopRow
            key={date}
            date={date}
            workshops={workshops}
            onSelect={setSelected}
            highlightedWorkshopTitle={highlightedWorkshopTitle}
            highlightedWorkshopRef={highlightedWorkshopRef}
          />
        ))}
      </div>
      <WorkshopDetailModal workshop={selected} onClose={() => setSelected(null)} />
    </>
  );
}
