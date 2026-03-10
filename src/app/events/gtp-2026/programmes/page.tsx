"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

import { TABS, TabId, TYPE_META, day1, day2, day3, day4 } from "@/components/gtp/programmes/data";
import { ProgrammesHero } from "@/components/gtp/programmes/programmes-hero";
import { PreConferencePlaceholder } from "@/components/gtp/programmes/pre-conference-placeholder";
import { DayAgenda } from "@/components/gtp/programmes/day-agenda";
import type { Session, SessionType } from "@/components/gtp/programmes/types";

// ─── Filter config ─────────────────────────────────────────────────────────────

// Session types that make sense as user-facing filters (exclude housekeeping types)
const FILTERABLE_TYPES: (SessionType | "all")[] = [
  "all",
  "opening",
  "plenary",
  "lightning",
  "fireside",
  "concurrent",
  "special",
  "closing",
];

const THEMES = [
  { id: "all",         label: "All Themes" },
  { id: "shift",      label: "Understanding the Shift" },
  { id: "imagination",label: "Igniting Imagination" },
  { id: "action",     label: "Accelerating Action" },
] as const;

type ThemeId = (typeof THEMES)[number]["id"];

// ─── Filter bar ────────────────────────────────────────────────────────────────

function FilterChip({
  active,
  onClick,
  children,
  disabled,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-200 whitespace-nowrap",
        disabled
          ? "cursor-not-allowed opacity-40 text-white/60"
          : active
            ? "bg-gtp-teal text-white shadow-sm"
            : "text-white/80 hover:text-white hover:bg-white/15",
      )}
    >
      {children}
    </button>
  );
}

function FilterBar({
  selectedType,
  onTypeChange,
  selectedTheme,
  onThemeChange,
}: {
  selectedType: SessionType | "all";
  onTypeChange: (t: SessionType | "all") => void;
  selectedTheme: ThemeId;
  onThemeChange: (t: ThemeId) => void;
}) {
  return (
    <div className="flex justify-center px-4 pb-3">
      <div className="w-full max-w-4xl space-y-2 rounded-2xl border border-white/10 bg-gtp-dark-teal/50 px-4 py-3 shadow-lg backdrop-blur-xl">
        {/* Type filters */}
        <div className="flex items-center gap-3">
          <span className="shrink-0 text-xs font-semibold uppercase tracking-widest text-white/50">
            Type
          </span>
          <div className="flex gap-1 overflow-x-auto [&::-webkit-scrollbar]:hidden">
            {FILTERABLE_TYPES.map((type) => {
              const label =
                type === "all" ? "All" : TYPE_META[type as SessionType].label;
              return (
                <FilterChip
                  key={type}
                  active={selectedType === type}
                  onClick={() => onTypeChange(type)}
                >
                  {label}
                </FilterChip>
              );
            })}
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-white/10" />

        {/* Theme filters */}
        <div className="flex items-center gap-3">
          <span className="shrink-0 text-xs font-semibold uppercase tracking-widest text-white/50">
            Theme
          </span>
          <div className="flex gap-1 overflow-x-auto [&::-webkit-scrollbar]:hidden">
            {THEMES.map(({ id, label }) => (
              <FilterChip
                key={id}
                active={selectedTheme === id}
                onClick={() => onThemeChange(id)}
                disabled={id !== "all"}
              >
                {label}
              </FilterChip>
            ))}
          </div>
          <span className="shrink-0 text-xs italic text-white/30">
            coming soon
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function filterSessions(sessions: Session[], type: SessionType | "all"): Session[] {
  if (type === "all") return sessions;
  // Always keep break/reconvening strips so the timeline stays readable,
  // but only when at least one other session matches.
  const hasMatch = sessions.some(
    (s) => s.type !== "break" && s.type !== "reconvening" && s.type === type,
  );
  if (!hasMatch) return [];
  return sessions.filter(
    (s) => s.type === type || s.type === "break" || s.type === "reconvening",
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ProgrammesPage() {
  const [activeTab, setActiveTab] = React.useState<TabId>("pre");
  const [selectedType, setSelectedType] = React.useState<SessionType | "all">("all");
  const [selectedTheme, setSelectedTheme] = React.useState<ThemeId>("all");
  const [filtersOpen, setFiltersOpen] = React.useState(false);

  const tabStripRef = React.useRef<HTMLDivElement>(null);
  const anchorRef = React.useRef<HTMLDivElement>(null);

  const hasActiveFilter = selectedType !== "all" || selectedTheme !== "all";

  function handleTabClick(id: TabId) {
    setActiveTab(id);
    setSelectedType("all");
    setSelectedTheme("all");
    if (id === "pre") setFiltersOpen(false);
    if (anchorRef.current) {
      const navbarHeight = 72;
      const top =
        anchorRef.current.getBoundingClientRect().top +
        window.scrollY -
        navbarHeight;
      window.scrollTo({ top, behavior: "smooth" });
    }
  }

  const dayMap: Record<Exclude<TabId, "pre">, Session[]> = {
    day1,
    day2,
    day3,
    day4,
  };

  const currentSessions =
    activeTab !== "pre" ? filterSessions(dayMap[activeTab], selectedType) : [];

  return (
    <>
      <ProgrammesHero />

      {/* Scroll anchor */}
      <div ref={anchorRef} />

      {/* Sticky tab strip + filter bar */}
      <div ref={tabStripRef} className="sticky top-[72px] z-40">
        {/* Day tabs row + filter toggle button */}
        <div className="flex items-center justify-center gap-3 px-4 py-3">
          {/* Day tabs pill */}
          <div className="flex overflow-x-auto gap-1 rounded-full border border-white/10 bg-gtp-dark-teal/50 p-1.5 shadow-lg backdrop-blur-xl [&::-webkit-scrollbar]:hidden">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={cn(
                  "shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 whitespace-nowrap",
                  activeTab === tab.id
                    ? "bg-gtp-teal text-white shadow-sm"
                    : "text-white/80 hover:bg-white/15 hover:text-white",
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Filter toggle button — only shown for day tabs */}
          {activeTab !== "pre" && (
            <button
              onClick={() => setFiltersOpen((v) => !v)}
              aria-label="Toggle filters"
              className={cn(
                "relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 shadow-lg backdrop-blur-xl transition-all duration-200",
                filtersOpen
                  ? "bg-gtp-teal text-white"
                  : "bg-gtp-dark-teal/50 text-white/80 hover:bg-gtp-dark-teal/70 hover:text-white",
              )}
            >
              <SlidersHorizontal className="h-4 w-4" />
              {/* Active filter dot */}
              {hasActiveFilter && !filtersOpen && (
                <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-gtp-teal ring-1 ring-gtp-dark-teal/50" />
              )}
            </button>
          )}
        </div>

        {/* Animated filter panel */}
        <AnimatePresence>
          {filtersOpen && activeTab !== "pre" && (
            <motion.div
              key="filter-panel"
              initial={{ opacity: 0, y: -10, scaleY: 0.95 }}
              animate={{ opacity: 1, y: 0, scaleY: 1 }}
              exit={{ opacity: 0, y: -10, scaleY: 0.95 }}
              transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
              style={{ transformOrigin: "top" }}
            >
              <FilterBar
                selectedType={selectedType}
                onTypeChange={setSelectedType}
                selectedTheme={selectedTheme}
                onThemeChange={setSelectedTheme}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Tab content */}
      <div className="bg-gtp-dark-teal/5 min-h-screen">
        <div className="mx-auto max-w-4xl px-4 py-10 md:px-6 lg:px-8">
          {activeTab === "pre" && <PreConferencePlaceholder />}

          {activeTab !== "pre" && currentSessions.length > 0 && (
            <DayAgenda sessions={currentSessions} />
          )}

          {activeTab !== "pre" && currentSessions.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <p className="font-heading text-lg font-semibold text-gtp-dark-teal/50">
                No sessions match this filter
              </p>
              <p className="mt-2 text-sm text-gray-400">
                Try selecting a different session type or switching days.
              </p>
              <button
                onClick={() => setSelectedType("all")}
                className="mt-5 rounded-full bg-gtp-teal/10 px-5 py-2 text-sm font-semibold text-gtp-teal transition-colors hover:bg-gtp-teal/20"
              >
                Clear filter
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
