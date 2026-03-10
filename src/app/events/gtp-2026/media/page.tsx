"use client";

import * as React from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { SectionWrapper } from "@/components/shared/section-wrapper";

// ─── Media item data ───────────────────────────────────────────────────────────

type DayId = "all" | "day1" | "day2" | "day3" | "day4";
type ThemeId = "all" | "shift" | "imagination" | "action";
type MediaTypeId = "all" | "plenary" | "workshop" | "special" | "exhibition";

interface MediaItem {
  id: string;
  src: string;
  alt: string;
  title: string;
  day: DayId;
  theme: ThemeId;
  type: MediaTypeId;
}

const DAY_LABELS: Record<Exclude<DayId, "all">, string> = {
  day1: "12 Oct",
  day2: "13 Oct",
  day3: "14 Oct",
  day4: "15 Oct",
};

const THEME_LABELS: Record<Exclude<ThemeId, "all">, string> = {
  shift: "Understanding the Shift",
  imagination: "Igniting Imagination",
  action: "Accelerating Action",
};

const TYPE_LABELS: Record<Exclude<MediaTypeId, "all">, string> = {
  plenary: "Plenary",
  workshop: "Workshop",
  special: "Special Event",
  exhibition: "Exhibition",
};

// Sample media items using existing GTP images
const MEDIA_ITEMS: MediaItem[] = [
  {
    id: "1",
    src: "/images/gtp/carousel/pexels-arthousestudio-4534200.jpg",
    alt: "Conference session",
    title: "Opening Plenary",
    day: "day1",
    theme: "shift",
    type: "plenary",
  },
  {
    id: "2",
    src: "/images/gtp/carousel/pexels-baskincreativeco-1480807.jpg",
    alt: "Leaders in discussion",
    title: "Leaders Shaping the Future",
    day: "day1",
    theme: "imagination",
    type: "plenary",
  },
  {
    id: "3",
    src: "/images/gtp/carousel/pexels-manuela-adler-344311-949194.jpg",
    alt: "Science and action",
    title: "Science Meeting Action",
    day: "day2",
    theme: "action",
    type: "workshop",
  },
  {
    id: "4",
    src: "/images/gtp/carousel/pexels-pok-rie-33563-2049422.jpg",
    alt: "Planetary health",
    title: "Tipping Points for a Healthy Planet",
    day: "day2",
    theme: "shift",
    type: "plenary",
  },
  {
    id: "5",
    src: "/images/gtp/conference/leaves.jpg",
    alt: "Nature and sustainability",
    title: "Nature-Based Solutions",
    day: "day2",
    theme: "action",
    type: "workshop",
  },
  {
    id: "6",
    src: "/images/gtp/conference/river.jpg",
    alt: "River ecosystem",
    title: "Regional Perspectives",
    day: "day3",
    theme: "shift",
    type: "workshop",
  },
  {
    id: "7",
    src: "/images/gtp/conference/solar.jpg",
    alt: "Solar energy",
    title: "Energy Transition",
    day: "day3",
    theme: "action",
    type: "plenary",
  },
  {
    id: "8",
    src: "/images/gtp/carousel/pexels-arthousestudio-4534200.jpg",
    alt: "Conference moments",
    title: "Deep Dive Session",
    day: "day3",
    theme: "imagination",
    type: "workshop",
  },
  {
    id: "9",
    src: "/images/gtp/carousel/pexels-baskincreativeco-1480807.jpg",
    alt: "Closing ceremony",
    title: "Road to COP31",
    day: "day4",
    theme: "action",
    type: "special",
  },
  {
    id: "10",
    src: "/images/gtp/conference/leaves.jpg",
    alt: "Gallery",
    title: "Poster Exhibit",
    day: "day2",
    theme: "imagination",
    type: "exhibition",
  },
];

// ─── Hero ─────────────────────────────────────────────────────────────────────

function MediaHero() {
  return (
    <div className="relative overflow-hidden px-4 pb-16 pt-40 text-center">
      <Image
        src="/images/gtp/forest-bg.jpg"
        alt=""
        fill
        className="object-cover object-center"
        priority
      />
      <div className="absolute inset-0 bg-gtp-dark-teal/75" />
      <div className="relative mx-auto max-w-4xl">
        <span className="inline-block rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-white/80 backdrop-blur-sm">
          GTP 2026
        </span>
        <h1 className="mt-6 font-heading text-3xl font-bold leading-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">
          Media
        </h1>
        <div className="mx-auto mt-6 h-1 w-20 rounded-full bg-gtp-teal" />
        <p className="mx-auto mt-6 max-w-2xl text-base text-white/70 md:text-lg">
          Photos and highlights from the Global Tipping Points Conference 2026
        </p>
      </div>
    </div>
  );
}

// ─── Filter chip ──────────────────────────────────────────────────────────────

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-200 whitespace-nowrap",
        active
          ? "bg-gtp-teal text-white shadow-sm"
          : "text-white/80 hover:bg-white/15 hover:text-white",
      )}
    >
      {children}
    </button>
  );
}

// ─── Media grid section ────────────────────────────────────────────────────────

function MediaGridSection() {
  const [day, setDay] = React.useState<DayId>("all");
  const [theme, setTheme] = React.useState<ThemeId>("all");
  const [type, setType] = React.useState<MediaTypeId>("all");
  const [filtersOpen, setFiltersOpen] = React.useState(false);

  const hasActiveFilter = day !== "all" || theme !== "all" || type !== "all";

  const filtered = React.useMemo(() => {
    return MEDIA_ITEMS.filter((item) => {
      if (day !== "all" && item.day !== day) return false;
      if (theme !== "all" && item.theme !== theme) return false;
      if (type !== "all" && item.type !== type) return false;
      return true;
    });
  }, [day, theme, type]);

  const DAY_OPTIONS: { id: DayId; label: string }[] = [
    { id: "all", label: "All Days" },
    { id: "day1", label: "12 Oct" },
    { id: "day2", label: "13 Oct" },
    { id: "day3", label: "14 Oct" },
    { id: "day4", label: "15 Oct" },
  ];

  const THEME_OPTIONS: { id: ThemeId; label: string }[] = [
    { id: "all", label: "All Themes" },
    { id: "shift", label: "Understanding the Shift" },
    { id: "imagination", label: "Igniting Imagination" },
    { id: "action", label: "Accelerating Action" },
  ];

  const TYPE_OPTIONS: { id: MediaTypeId; label: string }[] = [
    { id: "all", label: "All Types" },
    { id: "plenary", label: "Plenary" },
    { id: "workshop", label: "Workshop" },
    { id: "special", label: "Special Event" },
    { id: "exhibition", label: "Exhibition" },
  ];

  const filterPanel = (
    <div className="flex flex-col gap-4 px-4 py-4 md:px-6">
      {/* Day filter */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="shrink-0 text-xs font-semibold uppercase tracking-widest text-gtp-dark-teal/60">
          Date
        </span>
        <div className="flex flex-wrap gap-1">
          {DAY_OPTIONS.map(({ id, label }) => (
            <FilterChip key={id} active={day === id} onClick={() => setDay(id)}>
              {label}
            </FilterChip>
          ))}
        </div>
      </div>
      <div className="h-px bg-gtp-dark-teal/20" />
      {/* Theme filter */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="shrink-0 text-xs font-semibold uppercase tracking-widest text-gtp-dark-teal/60">
          Theme
        </span>
        <div className="flex flex-wrap gap-1">
          {THEME_OPTIONS.map(({ id, label }) => (
            <FilterChip
              key={id}
              active={theme === id}
              onClick={() => setTheme(id)}
            >
              {label}
            </FilterChip>
          ))}
        </div>
      </div>
      <div className="h-px bg-gtp-dark-teal/20" />
      {/* Type filter */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="shrink-0 text-xs font-semibold uppercase tracking-widest text-gtp-dark-teal/60">
          Type
        </span>
        <div className="flex flex-wrap gap-1">
          {TYPE_OPTIONS.map(({ id, label }) => (
            <FilterChip
              key={id}
              active={type === id}
              onClick={() => setType(id)}
            >
              {label}
            </FilterChip>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Floating filter button — mobile only */}
      <div className="fixed left-4 right-4 top-[72px] z-40 md:hidden">
        <div className="flex justify-end">
          <button
            onClick={() => setFiltersOpen((v) => !v)}
            aria-label="Toggle filters"
            className={cn(
              "relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 shadow-lg backdrop-blur-xl transition-colors",
              filtersOpen
                ? "bg-gtp-teal text-white"
                : "bg-gtp-dark-teal/80 text-white/90 hover:bg-gtp-dark-teal/90",
            )}
          >
            <SlidersHorizontal className="h-4 w-4" />
            {hasActiveFilter && (
              <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-gtp-teal ring-2 ring-gtp-dark-teal/80" />
            )}
          </button>
        </div>

        <AnimatePresence>
          {filtersOpen && (
            <motion.div
              key="filter-panel"
              initial={{ opacity: 0, y: -8, scaleY: 0.95 }}
              animate={{ opacity: 1, y: 0, scaleY: 1 }}
              exit={{ opacity: 0, y: -8, scaleY: 0.95 }}
              transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
              style={{ transformOrigin: "top" }}
              className="mt-2 w-full overflow-hidden rounded-2xl border border-white/10 bg-gtp-dark-teal/95 shadow-xl backdrop-blur-xl"
            >
              {filterPanel}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Spacer so content isn't hidden behind fixed button — mobile only */}
      <div className="h-16 md:hidden" aria-hidden />

      <SectionWrapper
        title="Gallery"
        subtitle="Conference Highlights"
        theme="gtp"
        background="muted"
      >
        {/* Desktop: inline filter bar */}
        <div className="mb-10 hidden flex-col gap-4 rounded-2xl border border-white/10 bg-gtp-dark-teal/50 px-4 py-4 shadow-lg backdrop-blur-xl md:flex md:px-6">
          {filterPanel}
        </div>

        {/* Photo grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item) => (
            <article
              key={item.id}
              className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gtp-dark-teal/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs font-medium text-white backdrop-blur-sm">
                    {DAY_LABELS[item.day]}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-heading text-base font-bold text-gtp-dark-teal">
                  {item.title}
                </h3>
                <p className="mt-1 text-xs text-gray-500">
                  {THEME_LABELS[item.theme]} · {TYPE_LABELS[item.type]}
                </p>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <p className="font-heading text-lg font-semibold text-gtp-dark-teal/50">
            No photos match this filter
          </p>
          <p className="mt-2 text-sm text-gray-400">
            Try selecting different date, theme, or type filters.
          </p>
          <button
            onClick={() => {
              setDay("all");
              setTheme("all");
              setType("all");
            }}
            className="mt-5 rounded-full bg-gtp-teal/10 px-5 py-2 text-sm font-semibold text-gtp-teal transition-colors hover:bg-gtp-teal/20"
          >
            Clear filters
          </button>
        </div>
      )}
      </SectionWrapper>
    </>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function GtpMediaPage() {
  return (
    <>
      <MediaHero />
      <MediaGridSection />
    </>
  );
}
