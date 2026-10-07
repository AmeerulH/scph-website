"use client";

import * as React from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import type { GtpActionWorkshopPartnerDay } from "@/data/gtp-programme-activity-defaults";
import type { GtpSessionModalHostedBy } from "@/sanity/queries";
import type { ActivityRegistrationState } from "@/lib/gtp-activity-registration";
import { cn } from "@/lib/utils";
import { normalizeActionWorkshopTitle, type ActionWorkshopListingItem } from "./action-workshop-listing";
import { ActionWorkshopPartnerRow } from "./action-workshop-partner-row";
import { WorkshopModal } from "./workshop-modal";

const SelectionContext = React.createContext<{
  onSelect: (workshop: ActionWorkshopListingItem) => void;
  highlightedWorkshop: ActionWorkshopListingItem | null;
  highlightedRef: React.RefObject<HTMLButtonElement | null>;
} | null>(null);

export function ActionWorkshopRow({
  id, title, description, workshops, partnerDays,
}: {
  id: string;
  title: string;
  description: string;
  workshops: ActionWorkshopListingItem[];
  partnerDays: GtpActionWorkshopPartnerDay[];
}) {
  const selection = React.useContext(SelectionContext);
  const [emblaRef, emblaApi] = useEmblaCarousel({align: "start", dragFree: true, containScroll: "trimSnaps"});
  const [controls, setControls] = React.useState({previous: false, next: false});
  React.useEffect(() => {
    if (!emblaApi) return;
    const update = () => setControls({previous: emblaApi.canScrollPrev(), next: emblaApi.canScrollNext()});
    update();
    emblaApi.on("select", update).on("reInit", update);
    return () => {emblaApi.off("select", update).off("reInit", update);};
  }, [emblaApi]);

  return <section aria-labelledby={`${id}-workshops`}>
    <div className="flex items-center justify-between gap-4">
      <h3 id={`${id}-workshops`} className="font-heading text-xl font-bold text-gtp-dark-teal sm:text-2xl">{title}</h3>
      {workshops.length > 0 ? <div className="flex shrink-0 gap-2">
        {(["previous", "next"] as const).map((direction) => <button key={direction} type="button" disabled={!controls[direction]}
          onClick={() => direction === "previous" ? emblaApi?.scrollPrev() : emblaApi?.scrollNext()}
          aria-label={`${direction === "previous" ? "Previous" : "Next"} workshops for ${id === "day-13" ? "13 October" : id === "day-14" ? "14 October" : title}`}
          className="flex size-10 items-center justify-center rounded-full border border-gtp-dark-teal/20 bg-white text-gtp-dark-teal transition-colors hover:bg-gtp-dark-teal hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gtp-teal focus-visible:ring-offset-2 disabled:opacity-35">
          {direction === "previous" ? <ChevronLeft className="size-4" aria-hidden /> : <ChevronRight className="size-4" aria-hidden />}
        </button>)}
      </div> : null}
    </div>
    {description ? <p className="mt-3 max-w-[70ch] whitespace-pre-line text-sm leading-relaxed text-gtp-dark-teal/85 sm:text-base">{description}</p> : null}
    {workshops.length ? <div className="-my-3 mt-4 overflow-hidden py-3" ref={emblaRef}>
      <div className="flex gap-4">
        {workshops.map((workshop) => {
          const highlighted = workshop === selection?.highlightedWorkshop;
          return <button key={workshop.id}
            ref={highlighted ? selection?.highlightedRef : undefined} type="button" onClick={() => selection?.onSelect(workshop)}
            aria-label={`View details: ${workshop.title}`} aria-current={highlighted ? "true" : undefined}
            className={cn("group relative flex h-[318px] w-52 shrink-0 flex-col overflow-hidden rounded-xl bg-gtp-dark-teal text-left text-white transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-gtp-orange focus-visible:ring-offset-2 sm:h-[360px] sm:w-60", highlighted && "ring-3 ring-gtp-orange ring-offset-2")}>
            <div className="relative min-h-0 flex-1">
              {workshop.posterUrl ? <Image src={workshop.posterUrl} alt={workshop.posterAlt || `${workshop.title} poster`} fill sizes="(max-width: 640px) 208px, 240px" fetchPriority="low" className="object-contain" />
                : <div className="flex h-full items-center p-5"><span className="line-clamp-9 font-heading text-lg font-bold leading-snug">{workshop.title}</span></div>}
            </div>
            <span className="flex h-11 shrink-0 items-center justify-between gap-3 px-4 text-xs font-semibold transition-colors group-hover:bg-gtp-orange-dark">View details<ArrowRight className="size-4" aria-hidden /></span>
          </button>;
        })}
      </div>
    </div> : <p className="mt-5 text-sm text-gtp-dark-teal/80">Workshop details will be confirmed.</p>}
    {partnerDays.map((day) => <ActionWorkshopPartnerRow key={day.dateLabel} day={day} />)}
  </section>;
}

/** One selection/deep-link owner serves every workshop day on the combined page. */
export function ActionWorkshopsCarousel({items, hostedBy, registration, verificationEndpoint, children}: {
  items: ActionWorkshopListingItem[];
  hostedBy: GtpSessionModalHostedBy;
  registration: ActivityRegistrationState;
  verificationEndpoint?: string;
  children: React.ReactNode;
}) {
  const [selected, setSelected] = React.useState<ActionWorkshopListingItem | null>(null);
  const searchParams = useSearchParams();
  const requested = searchParams.get("workshop")?.trim() || null;
  const requestedKey = requested ? normalizeActionWorkshopTitle(requested) : null;
  const [highlightedWorkshop, setHighlightedWorkshop] = React.useState<ActionWorkshopListingItem | null>(null);
  const highlightedRef = React.useRef<HTMLButtonElement | null>(null);
  const triggerRef = React.useRef<HTMLElement | null>(null);

  function select(workshop: ActionWorkshopListingItem) {
    triggerRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setSelected(workshop);
  }
  function close() {
    setSelected(null);
    window.requestAnimationFrame(() => triggerRef.current?.focus({preventScroll: true}));
  }
  React.useEffect(() => {
    if (!requestedKey) return;
    const match = items.find((item) => normalizeActionWorkshopTitle(item.title) === requestedKey);
    if (!match) return;
    setSelected(match);
    setHighlightedWorkshop(match);
    const frame = window.requestAnimationFrame(() => {
      const trigger = highlightedRef.current;
      triggerRef.current = trigger;
      trigger?.scrollIntoView({behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "center", inline: "center"});
    });
    const timeout = window.setTimeout(() => setHighlightedWorkshop(null), 5000);
    return () => {window.cancelAnimationFrame(frame); window.clearTimeout(timeout);};
  }, [items, requestedKey]);

  return <SelectionContext.Provider value={{onSelect: select, highlightedWorkshop, highlightedRef}}>
    {children}
    <WorkshopModal context={selected ? {workshop: selected.workshop, parent: selected.parent} : null}
      dayLabel={selected?.dayLabel} calendarTabId={selected?.calendarTabId || "day2"} hostedBy={hostedBy}
      workshopRegistration="inline" registration={registration} verificationEndpoint={verificationEndpoint} onClose={close} />
  </SelectionContext.Provider>;
}
