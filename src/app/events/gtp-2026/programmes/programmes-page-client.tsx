"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { Lock, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

import { TYPE_META } from "@/components/gtp/programmes/data";
import type { GtpProgrammeCalendarDayTab } from "@/lib/gtp-programme-google-calendar";
import type {
  GtpProgrammeTab,
  GtpProgrammeTabId,
  GtpSessionModalHostedBy,
} from "@/sanity/queries";
import { PreConferencePlaceholder } from "@/components/gtp/programmes/pre-conference-placeholder";
import { DayAgenda } from "@/components/gtp/programmes/day-agenda";
import type { Session } from "@/components/gtp/programmes/types";
import {
  collectSpeakers,
  filterSessionsWithSpeaker,
  findSpeakerAppearances,
  speakerExistsInProgramme,
  type ProgrammeTypeFilter,
  type SpeakerAppearance,
  type ThemeFilterId,
} from "@/components/gtp/programmes/programme-speaker-filter";
import { ProgrammeSpeakerSelect } from "@/components/gtp/programmes/programme-speaker-select";
import type { GtpHighlightSpeaker } from "@/data/gtp-highlight-speakers";

// ─── Filter config ─────────────────────────────────────────────────────────────

// Session types that make sense as user-facing filters (exclude housekeeping types)
const FILTERABLE_TYPES: ProgrammeTypeFilter[] = [
  "all",
  "opening",
  "plenary",
  "lightning",
  "fireside",
  "concurrent",
  "research",
  "special",
];

const THEMES = [
  { id: "all", label: "All Themes" },
  { id: "shift", label: "Understanding the Shift" },
  { id: "imagination", label: "Igniting Imagination" },
  { id: "action", label: "Accelerating Action" },
] as const;

type ThemeId = (typeof THEMES)[number]["id"];

// ─── Shared chip ──────────────────────────────────────────────────────────────

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

// ─── Mobile filter bar (horizontal chip strips) ────────────────────────────────

function ClosedEventFilterButton({
  active,
  onClick,
  fullWidth = false,
}: {
  active: boolean;
  onClick: () => void;
  fullWidth?: boolean;
}) {
  return (
    <button
      type="button"
      onMouseDown={(event) => event.preventDefault()}
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-all duration-150",
        fullWidth ? "w-full text-left" : "shrink-0 rounded-full px-3 py-1.5 text-xs",
        active
          ? "border-white/30 bg-white text-gtp-dark-teal shadow-sm"
          : "border-white/20 bg-transparent text-white/80 hover:border-white/40 hover:bg-white/10 hover:text-white",
      )}
    >
      <Lock className="h-3.5 w-3.5 shrink-0" />
      Closed Event
    </button>
  );
}

function FilterBar({
  selectedType,
  onTypeChange,
  closedOnly,
  onClosedOnlyChange,
  selectedTheme,
  onThemeChange,
  speakerOptions,
  selectedSpeaker,
  onSpeakerChange,
}: {
  selectedType: ProgrammeTypeFilter;
  onTypeChange: (t: ProgrammeTypeFilter) => void;
  closedOnly: boolean;
  onClosedOnlyChange: (value: boolean) => void;
  selectedTheme: ThemeId;
  onThemeChange: (t: ThemeId) => void;
  speakerOptions: ReturnType<typeof collectSpeakers>;
  selectedSpeaker: string | null;
  onSpeakerChange: (name: string | null) => void;
}) {
  return (
    <div className="flex justify-center px-4 pb-3">
      <div className="w-full max-w-4xl space-y-2 rounded-2xl border border-white/10 bg-gtp-dark-teal/50 px-4 py-3 shadow-lg backdrop-blur-xl">
        {/* Speaker filter — first so it stays visible and has room for the menu */}
        <div className="space-y-1.5">
          <span className="text-xs font-semibold uppercase tracking-widest text-white/50">
            Speaker
          </span>
          <ProgrammeSpeakerSelect
            options={speakerOptions}
            value={selectedSpeaker}
            onChange={onSpeakerChange}
          />
        </div>

        <div className="h-px bg-white/10" />

        {/* Type filters */}
        <div className="flex items-center gap-3">
          <span className="shrink-0 text-xs font-semibold uppercase tracking-widest text-white/50">
            Type
          </span>
          <div className="flex gap-1 overflow-x-auto [&::-webkit-scrollbar]:hidden">
            {FILTERABLE_TYPES.map((type) => {
              const label = type === "all" ? "All" : TYPE_META[type].label;
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
        <ClosedEventFilterButton
          active={closedOnly}
          onClick={() => onClosedOnlyChange(!closedOnly)}
        />

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
              >
                {label}
              </FilterChip>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Desktop sidebar filter panel ─────────────────────────────────────────────

function SidebarFilterRow({
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
        "w-full text-left rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150",
        disabled
          ? "cursor-not-allowed opacity-40 text-white/50"
          : active
            ? "bg-gtp-teal text-white shadow-sm"
            : "text-white/70 hover:bg-white/10 hover:text-white",
      )}
    >
      {children}
    </button>
  );
}

function FilterSidebar({
  selectedType,
  onTypeChange,
  closedOnly,
  onClosedOnlyChange,
  selectedTheme,
  onThemeChange,
  speakerOptions,
  selectedSpeaker,
  onSpeakerChange,
}: {
  selectedType: ProgrammeTypeFilter;
  onTypeChange: (t: ProgrammeTypeFilter) => void;
  closedOnly: boolean;
  onClosedOnlyChange: (value: boolean) => void;
  selectedTheme: ThemeId;
  onThemeChange: (t: ThemeId) => void;
  speakerOptions: ReturnType<typeof collectSpeakers>;
  selectedSpeaker: string | null;
  onSpeakerChange: (name: string | null) => void;
}) {
  const listRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    listRef.current?.scrollTo({ top: 0 });
  }, [closedOnly, selectedType, selectedTheme]);

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-white/10 bg-gtp-dark-teal/40 shadow-lg backdrop-blur-sm [overflow-anchor:none]">
      {/* Pinned header — stays visible while Type/Theme scroll */}
      <div className="shrink-0 p-4 pb-0">
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-white/70">
          Filters
        </p>

        <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-white/60">
          Speaker
        </p>
        <ProgrammeSpeakerSelect
          options={speakerOptions}
          value={selectedSpeaker}
          onChange={onSpeakerChange}
        />

        <div className="mt-4 h-px bg-white/10" />
      </div>

      <div
        ref={listRef}
        className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-4 pt-4 [scrollbar-width:thin] [scrollbar-color:rgba(255,255,255,0.25)_transparent]"
      >
        {/* Type section */}
        <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-white/60">
          Type
        </p>
        <div className="flex flex-col gap-0.5">
          {FILTERABLE_TYPES.map((type) => {
            const label = type === "all" ? "All Sessions" : TYPE_META[type].label;
            return (
              <SidebarFilterRow
                key={type}
                active={selectedType === type}
                onClick={() => onTypeChange(type)}
              >
                {label}
              </SidebarFilterRow>
            );
          })}
        </div>
        <div className="mt-3">
          <ClosedEventFilterButton
            fullWidth
            active={closedOnly}
            onClick={() => onClosedOnlyChange(!closedOnly)}
          />
        </div>

        <div className="my-4 h-px bg-white/10" />

        {/* Theme section */}
        <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-white/60">
          Theme
        </p>
        <div className="flex flex-col gap-0.5">
          {THEMES.map(({ id, label }) => (
            <SidebarFilterRow
              key={id}
              active={selectedTheme === id}
              onClick={() => onThemeChange(id)}
            >
              {label}
            </SidebarFilterRow>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Speaker appearance jump list (empty state + below filtered agenda) ───────

function SpeakerAppearancesList({
  appearances,
  onJumpToDay,
}: {
  appearances: SpeakerAppearance[];
  onJumpToDay: (tabId: SpeakerAppearance["tabId"]) => void;
}) {
  return (
    <ul className="mt-5 w-full max-w-lg space-y-2 text-left">
      {appearances.map((a) => (
        <li key={`${a.tabId}-${a.time}-${a.sessionTitle}`}>
          <button
            type="button"
            onClick={() => onJumpToDay(a.tabId)}
            className="w-full rounded-xl border border-gtp-teal/20 bg-white px-4 py-3 text-left shadow-sm transition-colors hover:border-gtp-teal/45 hover:bg-gtp-teal/5"
          >
            <span className="block text-xs font-semibold uppercase tracking-wide text-gtp-teal">
              {a.dayLabel}
            </span>
            <span className="mt-1 block text-sm font-semibold text-gtp-dark-teal">
              {a.time} · {a.sessionTitle}
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
}

function SpeakerAlsoOnOtherDays({
  speakerName,
  appearances,
  onJumpToDay,
}: {
  speakerName: string;
  appearances: SpeakerAppearance[];
  onJumpToDay: (tabId: SpeakerAppearance["tabId"]) => void;
}) {
  if (appearances.length === 0) return null;

  return (
    <div className="mt-10 flex flex-col items-center border-t border-gray-200/80 pt-10 text-center">
      <p className="font-heading text-lg font-semibold text-gtp-dark-teal/50">
        Also speaking on other days
      </p>
      <p className="mt-2 max-w-md text-sm text-gray-400">
        {speakerName} also appears elsewhere in the programme:
      </p>
      <SpeakerAppearancesList appearances={appearances} onJumpToDay={onJumpToDay} />
    </div>
  );
}

// ─── Empty states ─────────────────────────────────────────────────────────────

function SpeakerFilterEmpty({
  speakerName,
  otherAppearances,
  inProgramme,
  hasTypeOrThemeFilter,
  onClear,
  onJumpToDay,
}: {
  speakerName: string;
  otherAppearances: SpeakerAppearance[];
  inProgramme: boolean;
  hasTypeOrThemeFilter: boolean;
  onClear: () => void;
  onJumpToDay: (tabId: SpeakerAppearance["tabId"]) => void;
}) {
  if (!inProgramme) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="font-heading text-lg font-semibold text-gtp-dark-teal/50">
          Not in the published programme
        </p>
        <p className="mt-2 max-w-md text-sm text-gray-400">
          {speakerName} isn&apos;t listed as a speaker on the current programme.
        </p>
        <button
          onClick={onClear}
          className="mt-5 rounded-full bg-gtp-teal/10 px-5 py-2 text-sm font-semibold text-gtp-teal transition-colors hover:bg-gtp-teal/20"
        >
          Clear filters
        </button>
      </div>
    );
  }

  if (otherAppearances.length > 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="font-heading text-lg font-semibold text-gtp-dark-teal/50">
          Not on this day
        </p>
        <p className="mt-2 max-w-md text-sm text-gray-400">
          {speakerName} appears elsewhere in the programme:
        </p>
        <SpeakerAppearancesList
          appearances={otherAppearances}
          onJumpToDay={onJumpToDay}
        />
        <button
          onClick={onClear}
          className="mt-6 rounded-full bg-gtp-teal/10 px-5 py-2 text-sm font-semibold text-gtp-teal transition-colors hover:bg-gtp-teal/20"
        >
          Clear filters
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <p className="font-heading text-lg font-semibold text-gtp-dark-teal/50">
        No sessions match
      </p>
      <p className="mt-2 max-w-md text-sm text-gray-400">
        {hasTypeOrThemeFilter
          ? `Nothing on the programme matches ${speakerName} with these type and theme filters. Try clearing Type or Theme.`
          : `Nothing on the programme matches ${speakerName} with the current filters.`}
      </p>
      <button
        onClick={onClear}
        className="mt-5 rounded-full bg-gtp-teal/10 px-5 py-2 text-sm font-semibold text-gtp-teal transition-colors hover:bg-gtp-teal/20"
      >
        Clear filters
      </button>
    </div>
  );
}

const NAVBAR_OFFSET = 72;

function DesktopFilterSidebar(props: React.ComponentProps<typeof FilterSidebar>) {
  const spacerRef = React.useRef<HTMLElement>(null);
  const [frame, setFrame] = React.useState({ left: 0, maxHeight: 0, ready: false });

  React.useLayoutEffect(() => {
    const spacer = spacerRef.current;
    if (!spacer) return;

    const update = () => {
      const left = Math.round(spacer.getBoundingClientRect().left);
      const footerTop = document.querySelector("footer")?.getBoundingClientRect().top;
      const limit = Math.min(window.innerHeight, footerTop ?? window.innerHeight);
      const maxHeight = Math.max(0, Math.round(limit - NAVBAR_OFFSET));
      setFrame((prev) => {
        if (prev.ready && prev.left === left && prev.maxHeight === maxHeight) return prev;
        return { left, maxHeight, ready: true };
      });
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(document.documentElement);
    const footer = document.querySelector("footer");
    if (footer) observer.observe(footer);
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <aside ref={spacerRef} className="relative z-30 hidden w-56 shrink-0 lg:block">
      <div
        className="fixed top-18 z-30 flex w-56 flex-col overflow-hidden pt-3 [overflow-anchor:none]"
        style={{
          left: frame.left,
          maxHeight: frame.maxHeight,
          visibility: frame.ready ? "visible" : "hidden",
        }}
      >
        <FilterSidebar {...props} />
      </div>
    </aside>
  );
}

// ─── Client body (useSearchParams — must be inside Suspense in parent) ───────

export function ProgrammesPageClient({
  tabs,
  sessionModalHostedBy,
  day1,
  day2,
  day3,
  day4,
  speakerProfiles,
}: {
  tabs: GtpProgrammeTab[];
  sessionModalHostedBy: GtpSessionModalHostedBy;
  day1: Session[];
  day2: Session[];
  day3: Session[];
  day4: Session[];
  speakerProfiles: GtpHighlightSpeaker[];
}) {
  const searchParams = useSearchParams();

  const tabIds = new Set(tabs.map((t) => t.id));
  const tabParam = searchParams.get("tab");
  const isValidTabParam = Boolean(
    tabParam && tabIds.has(tabParam as GtpProgrammeTabId),
  );
  const initialTab: GtpProgrammeTabId =
    tabParam && tabIds.has(tabParam as GtpProgrammeTabId)
      ? (tabParam as GtpProgrammeTabId)
      : tabIds.has("day1")
        ? "day1"
        : tabIds.has("pre")
          ? "pre"
          : (tabs[0]?.id ?? "day1");
  const initialSession = searchParams.get("session");

  const [activeTab, setActiveTab] = React.useState<GtpProgrammeTabId>(initialTab);
  const [selectedType, setSelectedType] = React.useState<ProgrammeTypeFilter>("all");
  const [closedOnly, setClosedOnly] = React.useState(false);
  const [selectedTheme, setSelectedTheme] = React.useState<ThemeId>("all");
  const [selectedSpeaker, setSelectedSpeaker] = React.useState<string | null>(null);
  const [filtersOpen, setFiltersOpen] = React.useState(false);
  const [highlightSession, setHighlightSession] = React.useState<string | null>(initialSession);

  const tabStripRef = React.useRef<HTMLDivElement>(null);
  const anchorRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (isValidTabParam && tabParam) {
      setActiveTab(tabParam as GtpProgrammeTabId);
    }
    setHighlightSession(initialSession);
  }, [initialSession, isValidTabParam, tabParam]);

  // Auto-clear session highlight after 4 seconds
  React.useEffect(() => {
    if (!highlightSession) return;
    const id = setTimeout(() => setHighlightSession(null), 4000);
    return () => clearTimeout(id);
  }, [highlightSession]);

  const dayMap: Record<GtpProgrammeCalendarDayTab, Session[]> = React.useMemo(
    () => ({ day1, day2, day3, day4 }),
    [day1, day2, day3, day4],
  );

  const speakerOptions = React.useMemo(
    () => collectSpeakers([...day1, ...day2, ...day3, ...day4]),
    [day1, day2, day3, day4],
  );

  const dayBuckets = React.useMemo(() => {
    const ids: GtpProgrammeCalendarDayTab[] = ["day1", "day2", "day3", "day4"];
    return ids.map((tabId) => ({
      tabId,
      dayLabel: tabs.find((t) => t.id === tabId)?.label ?? tabId,
      sessions: dayMap[tabId],
    }));
  }, [dayMap, tabs]);

  const hasActiveFilter =
    selectedType !== "all" ||
    closedOnly ||
    selectedTheme !== "all" ||
    selectedSpeaker !== null;

  function scrollToAnchor() {
    if (anchorRef.current) {
      const navbarHeight = 72;
      const top =
        anchorRef.current.getBoundingClientRect().top +
        window.scrollY -
        navbarHeight;
      window.scrollTo({ top, behavior: "smooth" });
    }
  }

  function handleTabClick(id: GtpProgrammeTabId) {
    setActiveTab(id);
    if (id === "pre") setFiltersOpen(false);
    scrollToAnchor();
  }

  function handleTypeChange(type: ProgrammeTypeFilter) {
    setSelectedType(type);
    scrollToAnchor();
  }

  function handleClosedOnlyChange(value: boolean) {
    setClosedOnly(value);
    scrollToAnchor();
  }

  const closedOnlyReady = React.useRef(false);
  React.useLayoutEffect(() => {
    if (!closedOnlyReady.current) {
      closedOnlyReady.current = true;
      return;
    }
    if (!anchorRef.current) return;
    const navbarHeight = 72;
    const top =
      anchorRef.current.getBoundingClientRect().top + window.scrollY - navbarHeight;
    window.scrollTo({ top, behavior: "auto" });
  }, [closedOnly]);

  function handleThemeChange(theme: ThemeId) {
    setSelectedTheme(theme);
    scrollToAnchor();
  }

  function handleSpeakerChange(name: string | null) {
    setSelectedSpeaker(name);
    scrollToAnchor();
  }

  function clearAllFilters() {
    setSelectedType("all");
    setClosedOnly(false);
    setSelectedTheme("all");
    setSelectedSpeaker(null);
    scrollToAnchor();
  }

  const themeFilter = selectedTheme as ThemeFilterId;

  const currentSessions =
    activeTab !== "pre"
      ? filterSessionsWithSpeaker(
          dayMap[activeTab],
          selectedType,
          themeFilter,
          selectedSpeaker,
          closedOnly,
        )
      : [];

  const otherAppearances =
    selectedSpeaker && activeTab !== "pre"
      ? findSpeakerAppearances(
          dayBuckets.filter((d) => d.tabId !== activeTab),
          selectedSpeaker,
          selectedType,
          themeFilter,
          closedOnly,
        )
      : [];

  const speakerInProgramme = selectedSpeaker
    ? speakerExistsInProgramme(speakerOptions, selectedSpeaker)
    : true;

  const currentDayLabel = tabs.find((t) => t.id === activeTab)?.label;

  return (
    <>
      {/* Scroll anchor */}
      <div ref={anchorRef} />

      {/* Sticky tab strip + filter bar */}
      <div ref={tabStripRef} className="sticky top-18 z-40">
        {/* Day tabs row + filter toggle button */}
        <div className="flex items-center justify-center gap-3 px-4 py-3">
          {/* Day tabs pill */}
          <div className="flex overflow-x-auto gap-1 rounded-full border border-white/10 bg-gtp-dark-teal/50 p-1.5 shadow-lg backdrop-blur-xl [&::-webkit-scrollbar]:hidden">
            {tabs.map((tab) => (
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

          {/* Filter toggle button — mobile only, only shown for day tabs */}
          {activeTab !== "pre" && (
            <button
              onClick={() => setFiltersOpen((v) => !v)}
              aria-label="Toggle filters"
              className={cn(
                "relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 shadow-lg backdrop-blur-xl transition-all duration-200 lg:hidden",
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

        {/* Animated filter panel — mobile only */}
        <AnimatePresence>
          {filtersOpen && activeTab !== "pre" && (
            <motion.div
              key="filter-panel"
              initial={{ opacity: 0, y: -10, scaleY: 0.95 }}
              animate={{ opacity: 1, y: 0, scaleY: 1 }}
              exit={{ opacity: 0, y: -10, scaleY: 0.95 }}
              transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
              style={{ transformOrigin: "top" }}
              className="lg:hidden"
            >
              <FilterBar
                selectedType={selectedType}
                onTypeChange={handleTypeChange}
                closedOnly={closedOnly}
                onClosedOnlyChange={handleClosedOnlyChange}
                selectedTheme={selectedTheme}
                onThemeChange={handleThemeChange}
                speakerOptions={speakerOptions}
                selectedSpeaker={selectedSpeaker}
                onSpeakerChange={handleSpeakerChange}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Tab content */}
      <div className="min-h-screen bg-slate-100">
        <div className="mx-auto max-w-7xl px-4 pb-10 pt-0 md:px-6 lg:px-8">
          <div className="flex gap-8">
            {/* Desktop filters stay pinned under the nav, in line with the day tabs. */}
            {activeTab !== "pre" && (
              <DesktopFilterSidebar
                selectedType={selectedType}
                onTypeChange={handleTypeChange}
                closedOnly={closedOnly}
                onClosedOnlyChange={handleClosedOnlyChange}
                selectedTheme={selectedTheme}
                onThemeChange={handleThemeChange}
                speakerOptions={speakerOptions}
                selectedSpeaker={selectedSpeaker}
                onSpeakerChange={handleSpeakerChange}
              />
            )}

            {/* ── Main content ── */}
            <div className="min-h-[calc(100dvh-4.5rem)] min-w-0 flex-1 pt-6 [overflow-anchor:none] lg:pt-8">
              {activeTab === "pre" && <PreConferencePlaceholder />}

              {activeTab !== "pre" && currentSessions.length > 0 && (
                <>
                  <DayAgenda
                    sessions={currentSessions}
                    highlightSession={highlightSession ?? undefined}
                    highlightSpeaker={selectedSpeaker ?? undefined}
                    dayLabel={currentDayLabel}
                    calendarTabId={activeTab as GtpProgrammeCalendarDayTab}
                    sessionModalHostedBy={sessionModalHostedBy}
                    speakerProfiles={speakerProfiles}
                  />
                  {selectedSpeaker ? (
                    <SpeakerAlsoOnOtherDays
                      speakerName={selectedSpeaker}
                      appearances={otherAppearances}
                      onJumpToDay={(tabId) => handleTabClick(tabId)}
                    />
                  ) : null}
                </>
              )}

              {activeTab !== "pre" && currentSessions.length === 0 && selectedSpeaker && (
                <SpeakerFilterEmpty
                  speakerName={selectedSpeaker}
                  otherAppearances={otherAppearances}
                  inProgramme={speakerInProgramme}
                  hasTypeOrThemeFilter={
                    selectedType !== "all" || closedOnly || selectedTheme !== "all"
                  }
                  onClear={clearAllFilters}
                  onJumpToDay={(tabId) => handleTabClick(tabId)}
                />
              )}

              {activeTab !== "pre" &&
                currentSessions.length === 0 &&
                !selectedSpeaker && (
                  <div className="flex flex-col items-center justify-center py-24 text-center">
                    <p className="font-heading text-lg font-semibold text-gtp-dark-teal/50">
                      No sessions match this filter
                    </p>
                    <p className="mt-2 text-sm text-gray-400">
                      Try a different session type, theme, or day.
                    </p>
                    <button
                      onClick={clearAllFilters}
                      className="mt-5 rounded-full bg-gtp-teal/10 px-5 py-2 text-sm font-semibold text-gtp-teal transition-colors hover:bg-gtp-teal/20"
                    >
                      Clear filters
                    </button>
                  </div>
                )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
