"use client";

import { useState, useCallback } from "react";
import { ChevronLeft, ChevronRight, MapPin, ExternalLink } from "lucide-react";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type CardData = {
  id: string;
  type: string;
  title: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
  address?: string;
  mapsHref?: string;
  /** Inline CSS background value — swap for next/image once real photos are provided. */
  background: string;
};

const CARDS: CardData[] = [
  {
    id: "sunway-lagoon-hotel",
    type: "Official Hotel",
    title: "Sunway Lagoon Hotel",
    description:
      "Preferred delegate rates. Check-in 9 Oct · Check-out 18 Oct 2026.",
    ctaLabel: "Book Now",
    ctaHref: "https://reservations.travelclick.com/110621?RatePlanId=11226966",
    address:
      "Jalan 11/15, Bandar Sunway, 47500 Petaling Jaya, Selangor, Malaysia",
    mapsHref:
      "https://maps.google.com/maps?q=Sunway+Lagoon+Hotel,+Jalan+11/15,+Bandar+Sunway,+47500+Petaling+Jaya",
    // TODO: replace with next/image once hotel photos are provided
    background: "radial-gradient(ellipse at top left, #1a7a96 0%, #0a3d4d 100%)",
  },
  {
    id: "excursion-1",
    type: "Day Excursion",
    title: "Coming Soon",
    description:
      "Excursion trip details will be announced. Applications open to all registered delegates.",
    ctaLabel: "Stay Tuned",
    ctaHref: "#",
    // TODO: replace with next/image once excursion photos are provided
    background: "radial-gradient(ellipse at top right, #3a6e14 0%, #1c3a08 100%)",
  },
  {
    id: "excursion-2",
    type: "Day Excursion",
    title: "Coming Soon",
    description:
      "Excursion trip details will be announced. Applications open to all registered delegates.",
    ctaLabel: "Stay Tuned",
    ctaHref: "#",
    // TODO: replace with next/image once excursion photos are provided
    background: "radial-gradient(ellipse at bottom left, #7a3200 0%, #3d1800 100%)",
  },
];

function HotelCard({ card }: { card: CardData }) {
  return (
    <>
      <p className="mt-2 text-sm leading-relaxed text-white/75">
        {card.description}
      </p>
      {card.address && (
        <a
          href={card.mapsHref}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 flex items-start gap-2 text-xs text-white/55 transition-colors hover:text-white/80"
        >
          <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          <span>{card.address}</span>
        </a>
      )}
      <div className="mt-5 flex flex-wrap gap-3">
        <Button variant="gtpSecondary" size="sm" asChild>
          <a href={card.ctaHref} target="_blank" rel="noopener noreferrer">
            {card.ctaLabel}
            <ExternalLink className="ml-2 h-3.5 w-3.5" />
          </a>
        </Button>
        {card.mapsHref && (
          <Button variant="gtpOutline" size="sm" asChild>
            <a href={card.mapsHref} target="_blank" rel="noopener noreferrer">
              Open in Maps
            </a>
          </Button>
        )}
      </div>
    </>
  );
}

function ExcursionCard({ card }: { card: CardData }) {
  return (
    <>
      <p className="mt-2 text-sm leading-relaxed text-white/75">
        {card.description}
      </p>
      <div className="mt-5">
        <Button variant="gtpOutline" size="sm" disabled={card.ctaHref === "#"}>
          {card.ctaLabel}
        </Button>
      </div>
    </>
  );
}

function CarouselCard({
  card,
  isFeatured,
}: {
  card: CardData;
  isFeatured: boolean;
}) {
  return (
    <div
      className="relative flex h-full w-full flex-col overflow-hidden rounded-2xl"
      style={{ background: card.background }}
    >
      {/* Type badge */}
      <div className="relative z-10 p-5 pb-0">
        <span className="inline-block rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white/90">
          {card.type}
        </span>
      </div>

      {/* Bottom info panel */}
      <div
        className="relative z-10 mt-auto p-5 pt-16"
        style={{
          background:
            "linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)",
        }}
      >
        <h3 className="font-heading text-xl font-bold leading-tight text-white md:text-2xl">
          {card.title}
        </h3>
        {isFeatured &&
          (card.type === "Official Hotel" ? (
            <HotelCard card={card} />
          ) : (
            <ExcursionCard card={card} />
          ))}
      </div>
    </div>
  );
}

export function GtpRatesExcursionsSection() {
  const [current, setCurrent] = useState(0);

  const prev = useCallback(
    () => setCurrent((i) => (i - 1 + CARDS.length) % CARDS.length),
    [],
  );
  const next = useCallback(
    () => setCurrent((i) => (i + 1) % CARDS.length),
    [],
  );

  return (
    <SectionWrapper
      title="Special Rates & Excursion Trips"
      subtitle="Plan Your Stay"
      theme="gtp"
      background="dark"
      id="rates-excursions"
      scrollReveal={false}
    >
      <p className="mb-10 max-w-xl text-lg leading-relaxed text-white/70">
        Let us inspire your visit to Malaysia
      </p>

      {/* Carousel */}
      <div
        className="relative"
        role="region"
        aria-label="Rates and excursion trips carousel"
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") prev();
          if (e.key === "ArrowRight") next();
        }}
        tabIndex={0}
      >
        {/* Cards track — overflow-visible so flanking cards peek out */}
        <div className="relative mx-auto h-[440px] w-full max-w-lg overflow-visible md:h-[480px]">
          {CARDS.map((card, i) => {
            const offset = i - current;
            const absOffset = Math.abs(offset);

            if (absOffset > 1) return null;

            return (
              <div
                key={card.id}
                aria-current={offset === 0 ? "true" : undefined}
                className="absolute inset-0 cursor-pointer"
                style={{
                  transform: `translateX(${offset * 68}%) scale(${offset === 0 ? 1 : 0.86})`,
                  opacity: offset === 0 ? 1 : 0.5,
                  zIndex: offset === 0 ? 10 : 5,
                  transition:
                    "transform 0.45s cubic-bezier(0.16,1,0.3,1), opacity 0.45s ease-out",
                }}
                onClick={() => {
                  if (offset !== 0) setCurrent(i);
                }}
              >
                <CarouselCard card={card} isFeatured={offset === 0} />
              </div>
            );
          })}
        </div>

        {/* Navigation */}
        <div className="mt-8 flex items-center justify-center gap-6">
          <button
            onClick={prev}
            aria-label="Previous card"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white/70 transition-colors hover:border-white/50 hover:text-white"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <div className="flex gap-2" role="tablist" aria-label="Carousel position">
            {CARDS.map((card, i) => (
              <button
                key={card.id}
                role="tab"
                aria-selected={i === current}
                aria-label={`Go to ${card.title}`}
                onClick={() => setCurrent(i)}
                className={cn(
                  "h-2 rounded-full transition-all duration-300",
                  i === current
                    ? "w-6 bg-gtp-teal"
                    : "w-2 bg-white/30 hover:bg-white/50",
                )}
              />
            ))}
          </div>

          <button
            onClick={next}
            aria-label="Next card"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white/70 transition-colors hover:border-white/50 hover:text-white"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </SectionWrapper>
  );
}
