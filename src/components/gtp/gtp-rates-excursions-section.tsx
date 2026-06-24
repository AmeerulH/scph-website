"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, MapPin, ExternalLink } from "lucide-react";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { GtpAccommodationActivityCardCopy } from "@/data/gtp-accommodation-activities-defaults";
import type { GtpAccommodationActivitiesBandCopy } from "@/data/gtp-accommodation-activities-defaults";
import { DEFAULT_GTP_ACCOMMODATION_ACTIVITIES_BAND } from "@/data/gtp-accommodation-activities-defaults";

function FeaturedCardContent({ card }: { card: GtpAccommodationActivityCardCopy }) {
  const primaryHref = card.primaryCtaHref?.trim() ?? "";
  const primaryDisabled = !primaryHref || primaryHref === "#";
  const mapsHref = card.mapsHref?.trim();

  return (
    <>
      <p className="mt-2 text-sm leading-relaxed text-white/75">
        {card.description}
      </p>
      {card.address && mapsHref ? (
        <a
          href={mapsHref}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 flex items-start gap-2 text-xs text-white/55 transition-colors hover:text-white/80"
        >
          <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          <span>{card.address}</span>
        </a>
      ) : null}
      <div className="mt-5 flex flex-wrap gap-3">
        {primaryDisabled ? (
          <Button variant="gtpOutline" size="sm" disabled>
            {card.primaryCtaLabel}
          </Button>
        ) : (
          <Button variant="gtpSecondary" size="sm" asChild>
            <a href={primaryHref} target="_blank" rel="noopener noreferrer">
              {card.primaryCtaLabel}
              <ExternalLink className="ml-2 h-3.5 w-3.5" />
            </a>
          </Button>
        )}
        {mapsHref ? (
          <Button variant="gtpOutline" size="sm" asChild>
            <a href={mapsHref} target="_blank" rel="noopener noreferrer">
              Open in Maps
            </a>
          </Button>
        ) : null}
      </div>
    </>
  );
}

function CarouselCard({
  card,
  isFeatured,
}: {
  card: GtpAccommodationActivityCardCopy;
  isFeatured: boolean;
}) {
  const imageUrl = card.imageUrl?.trim();

  return (
    <div
      className="relative flex h-full w-full flex-col overflow-hidden rounded-2xl"
      style={imageUrl ? undefined : { background: card.backgroundGradient }}
    >
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={card.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 512px"
          priority={card.id === "sunway-lagoon-hotel"}
        />
      ) : (
        <div
          className="absolute inset-0"
          style={{ background: card.backgroundGradient }}
        />
      )}

      <div className="relative z-10 p-5 pb-0">
        <span className="inline-block rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white/90">
          {card.categoryLabel}
        </span>
      </div>

      <div
        className="relative z-10 mt-auto pt-12"
        style={{
          background:
            "linear-gradient(to top, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.1) 60%, transparent 100%)",
        }}
      >
        <div className="bg-black/30 p-4 backdrop-blur-sm ring-1 ring-white/10">
          <h3 className="font-heading text-xl font-bold leading-tight text-white md:text-2xl">
            {card.title}
          </h3>
          {isFeatured ? <FeaturedCardContent card={card} /> : null}
        </div>
      </div>
    </div>
  );
}

export function GtpRatesExcursionsSection({
  band = DEFAULT_GTP_ACCOMMODATION_ACTIVITIES_BAND,
}: {
  band?: GtpAccommodationActivitiesBandCopy;
}) {
  const cards = band.cards ?? [];
  const [current, setCurrent] = useState(0);

  const prev = useCallback(
    () => setCurrent((i) => (i - 1 + cards.length) % cards.length),
    [cards.length],
  );
  const next = useCallback(
    () => setCurrent((i) => (i + 1) % cards.length),
    [cards.length],
  );

  if (cards.length === 0) return null;

  const safeCurrent = current >= cards.length ? 0 : current;

  return (
    <SectionWrapper
      title={band.title}
      subtitle={band.subtitle.trim() ? band.subtitle : undefined}
      theme="gtp"
      background="dark"
      id="rates-excursions"
      scrollReveal={false}
    >
      {band.intro.trim() ? (
        <p className="mb-10 max-w-xl text-lg leading-relaxed text-white/70">
          {band.intro}
        </p>
      ) : null}

      <div
        className="relative"
        role="region"
        aria-label="Accommodation and activities carousel"
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") prev();
          if (e.key === "ArrowRight") next();
        }}
        tabIndex={0}
      >
        <div className="relative mx-auto h-[440px] w-full max-w-lg overflow-visible md:h-[480px]">
          {cards.map((card, i) => {
            const offset = i - safeCurrent;
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

        <div className="mt-8 flex items-center justify-center gap-6">
          <button
            onClick={prev}
            aria-label="Previous card"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white/70 transition-colors hover:border-white/50 hover:text-white"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <div className="flex gap-2" role="tablist" aria-label="Carousel position">
            {cards.map((card, i) => (
              <button
                key={card.id}
                role="tab"
                aria-selected={i === safeCurrent}
                aria-label={`Go to ${card.title}`}
                onClick={() => setCurrent(i)}
                className={cn(
                  "h-2 rounded-full transition-all duration-300",
                  i === safeCurrent
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
