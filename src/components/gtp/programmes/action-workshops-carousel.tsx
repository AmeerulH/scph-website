"use client";

import * as React from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { GtpSessionModalHostedBy } from "@/sanity/queries";
import { cn } from "@/lib/utils";
import {
  normalizeActionWorkshopTitle,
  type ActionWorkshopListingItem,
} from "./action-workshop-listing";
import { WorkshopModal } from "./workshop-modal";

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

function WorkshopRow({
  date,
  workshops,
  onSelect,
  highlightedWorkshopTitle,
  highlightedWorkshopRef,
}: {
  date: string;
  workshops: ActionWorkshopListingItem[];
  onSelect: (workshop: ActionWorkshopListingItem) => void;
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
            const isHighlighted =
              normalizeActionWorkshopTitle(workshop.title) === highlightedWorkshopTitle;

            return (
              <button
                key={`${workshop.calendarTabId}-${workshop.workshop.number}-${workshop.title}`}
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
  items,
  hostedBy,
}: {
  items: ActionWorkshopListingItem[];
  hostedBy: GtpSessionModalHostedBy;
}) {
  const [selected, setSelected] = React.useState<ActionWorkshopListingItem | null>(null);
  const searchParams = useSearchParams();
  const requestedWorkshopTitle = searchParams.get("workshop")?.trim() || null;
  const requestedKey = requestedWorkshopTitle
    ? normalizeActionWorkshopTitle(requestedWorkshopTitle)
    : null;
  const [highlightedWorkshopTitle, setHighlightedWorkshopTitle] = React.useState<string | null>(null);
  const highlightedWorkshopRef = React.useRef<HTMLButtonElement | null>(null);
  const groups = items.reduce<Record<string, ActionWorkshopListingItem[]>>((result, entry) => {
    const date = entry.dateLabel || "To be confirmed";
    (result[date] ??= []).push(entry);
    return result;
  }, {});

  React.useEffect(() => {
    if (!requestedKey) return;
    const match = items.find(
      (item) => normalizeActionWorkshopTitle(item.title) === requestedKey,
    );
    if (match) setSelected(match);
    setHighlightedWorkshopTitle(requestedKey);
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
  }, [items, requestedKey]);

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
      <WorkshopModal
        context={
          selected
            ? { workshop: selected.workshop, parent: selected.parent }
            : null
        }
        dayLabel={selected?.dayLabel}
        calendarTabId={selected?.calendarTabId ?? "day2"}
        hostedBy={hostedBy}
        workshopRegistration="inline"
        onClose={() => setSelected(null)}
      />
    </>
  );
}
