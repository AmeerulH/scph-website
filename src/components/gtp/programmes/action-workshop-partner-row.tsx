"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import type {
  GtpActionWorkshopPartnerDay,
  GtpActionWorkshopPartnerLogo,
} from "@/data/gtp-programme-activity-defaults";
import { cn } from "@/lib/utils";

const DAY_THEN_MONTH = /(\d{1,2})\s+([a-z]{3,})/i;
const MONTH_THEN_DAY = /([a-z]{3,})\s+(\d{1,2})/i;

function normalizeLabel(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function dayMonthKey(value: string): string | null {
  const normalized = normalizeLabel(value);
  const dayFirst = normalized.match(DAY_THEN_MONTH);
  if (dayFirst) return `${Number(dayFirst[1])}-${dayFirst[2].slice(0, 3)}`;
  const monthFirst = normalized.match(MONTH_THEN_DAY);
  if (monthFirst) return `${Number(monthFirst[2])}-${monthFirst[1].slice(0, 3)}`;
  return null;
}

/** Match a workshop day heading to the CMS logo row, including "13 Oct" vs "13 October 2026". */
export function matchActionWorkshopPartnerDay(
  dateLabel: string,
  days: readonly GtpActionWorkshopPartnerDay[],
): GtpActionWorkshopPartnerDay | undefined {
  const exact = normalizeLabel(dateLabel);
  const byLabel = days.find((day) => normalizeLabel(day.dateLabel) === exact);
  if (byLabel) return byLabel;
  const key = dayMonthKey(dateLabel);
  if (!key) return undefined;
  return days.find((day) => dayMonthKey(day.dateLabel) === key);
}

function isSvg(url: string): boolean {
  return /\.svg(?:$|\?)/i.test(url);
}

const CHIP =
  "flex h-16 w-36 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-gtp-teal/15 bg-white px-3.5 py-2.5 sm:w-40";

const CHIP_LINK = cn(
  CHIP,
  "transition-colors hover:border-gtp-teal/50 focus-visible:border-gtp-teal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gtp-teal/40 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-50",
);

function PartnerLogo({
  partner,
  tabIndex,
}: {
  partner: GtpActionWorkshopPartnerLogo;
  tabIndex?: number;
}) {
  const image = (
    <Image
      src={partner.logoUrl}
      alt={partner.href ? "" : partner.logoAlt}
      width={152}
      height={48}
      sizes="160px"
      className="h-10 w-full object-contain"
      unoptimized={isSvg(partner.logoUrl)}
    />
  );

  if (!partner.href) {
    return <div className={CHIP}>{image}</div>;
  }

  if (partner.href.startsWith("/")) {
    return (
      <Link href={partner.href} className={CHIP_LINK} tabIndex={tabIndex} aria-label={partner.name}>
        {image}
      </Link>
    );
  }

  return (
    <a
      href={partner.href}
      className={CHIP_LINK}
      tabIndex={tabIndex}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${partner.name} (opens in a new tab)`}
    >
      {image}
    </a>
  );
}

function PartnerLogoList({
  partners,
  clone = false,
  listRef,
  scrolling,
  labelId,
}: {
  partners: readonly GtpActionWorkshopPartnerLogo[];
  clone?: boolean;
  listRef?: React.RefObject<HTMLUListElement | null>;
  scrolling: boolean;
  labelId?: string;
}) {
  return (
    <ul
      ref={listRef}
      aria-labelledby={clone ? undefined : labelId}
      aria-hidden={clone ? true : undefined}
      className={cn(
        "flex items-center",
        scrolling ? "w-max shrink-0 gap-8 pr-8" : "w-max gap-8",
        clone && "action-workshop-partner-clone",
      )}
    >
      {partners.map((partner, index) => (
        <li key={`${clone ? "copy" : "logo"}-${partner.name}-${index}`} className="flex shrink-0">
          <PartnerLogo partner={partner} tabIndex={clone ? -1 : undefined} />
        </li>
      ))}
    </ul>
  );
}

export function ActionWorkshopPartnerRow({ day }: { day: GtpActionWorkshopPartnerDay }) {
  const partners = day.partners;
  const viewportRef = React.useRef<HTMLDivElement>(null);
  const listRef = React.useRef<HTMLUListElement>(null);
  const [scrolling, setScrolling] = React.useState(partners.length >= 4);
  const [paused, setPaused] = React.useState(false);
  const labelId = React.useId();

  React.useEffect(() => {
    const viewport = viewportRef.current;
    const list = listRef.current;
    if (!viewport || !list) return;

    const measure = () => {
      setScrolling(list.scrollWidth > viewport.clientWidth + 1);
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(viewport);
    observer.observe(list);
    return () => observer.disconnect();
  }, [partners]);

  if (partners.length === 0) return null;

  const duration = `${Math.max(36, partners.length * 5)}s`;

  return (
    <div className="mt-5">
      <div className="mb-3 flex items-center justify-between gap-3">
        <p id={labelId} className="font-heading text-xs font-semibold uppercase tracking-[0.16em] text-gtp-dark-teal">
          {day.label}
        </p>
        {scrolling ? (
          <button
            type="button"
            aria-pressed={paused}
            onClick={() => setPaused((current) => !current)}
            className="motion-reduce:hidden rounded-full px-2.5 py-1 text-xs font-semibold text-gtp-dark-teal hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gtp-teal/50"
          >
            {paused ? "Play" : "Pause"}
          </button>
        ) : null}
      </div>
      <div
        ref={viewportRef}
        className={cn("action-workshop-partner-viewport", scrolling && "is-scrolling")}
      >
        <div
          className={cn(
            "action-workshop-partner-track flex",
            scrolling ? "w-max" : "w-full",
            paused && "is-paused",
          )}
          style={
            scrolling
              ? ({ "--partner-marquee-duration": duration } as React.CSSProperties)
              : undefined
          }
        >
          <PartnerLogoList partners={partners} listRef={listRef} scrolling={scrolling} labelId={labelId} />
          {scrolling ? <PartnerLogoList partners={partners} clone scrolling /> : null}
        </div>
      </div>
    </div>
  );
}
