"use client";

import * as React from "react";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { SlidersHorizontal, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

import { TABS, TabId, TYPE_META, day1, day2, day3, day4 } from "@/components/gtp/programmes/data";
import { ProgrammesHero } from "@/components/gtp/programmes/programmes-hero";
import { PreConferencePlaceholder } from "@/components/gtp/programmes/pre-conference-placeholder";
import { DayAgenda } from "@/components/gtp/programmes/day-agenda";
import type { Session, SessionType } from "@/components/gtp/programmes/types";

// ─── Speaker list derived from all days ───────────────────────────────────────

const ALL_SESSIONS = [...day1, ...day2, ...day3, ...day4];

const ALL_SPEAKERS: string[] = Array.from(
  new Set(
    ALL_SESSIONS.flatMap((s) => (s.speakers ?? []).map((sp) => sp.name)),
  ),
).sort();

// ─── Filter config ─────────────────────────────────────────────────────────────

// Session types that make sense as user-facing filters (exclude housekeeping types)
const FILTERABLE_TYPES: (SessionType | "all")[] = [
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
  { id: "all",         label: "All Themes" },
  { id: "shift",      label: "Understanding the Shift" },
  { id: "imagination",label: "Igniting Imagination" },
  { id: "action",     label: "Accelerating Action" },
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

function FilterBar({
  selectedType,
  onTypeChange,
  selectedTheme,
  onThemeChange,
  selectedSpeaker,
  onSpeakerChange,
}: {
  selectedType: SessionType | "all";
  onTypeChange: (t: SessionType | "all") => void;
  selectedTheme: ThemeId;
  onThemeChange: (t: ThemeId) => void;
  selectedSpeaker: string | null;
  onSpeakerChange: (s: string | null) => void;
}) {
  return (
    <div className="flex justify-center px-4 pb-3">
      <div className="w-full max-w-4xl space-y-2 rounded-2xl border border-white/10 bg-gtp-dark-teal/50 px-4 py-3 shadow-lg backdrop-blur-xl">
        {/* Speaker search — first (feedback Phase 5) */}
        <div className="flex items-center gap-3">
          <span className="shrink-0 text-xs font-semibold uppercase tracking-widest text-white/50">
            Speaker
          </span>
          <SpeakerSearch value={selectedSpeaker} onChange={onSpeakerChange} variant="mobile" />
        </div>

        <div className="h-px bg-white/10" />

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
        </div>
      </div>
    </div>
  );
}

// ─── Speaker search dropdown ───────────────────────────────────────────────────

function SpeakerSearch({
  value,
  onChange,
  variant = "sidebar",
}: {
  value: string | null;
  onChange: (v: string | null) => void;
  variant?: "sidebar" | "mobile";
}) {
  const [query, setQuery] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const filtered = query.trim()
    ? ALL_SPEAKERS.filter((n) =>
        n.toLowerCase().includes(query.toLowerCase()),
      )
    : ALL_SPEAKERS;

  // Close on outside click
  React.useEffect(() => {
    function handle(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  function select(name: string) {
    onChange(name);
    setQuery("");
    setOpen(false);
  }

  function clear() {
    onChange(null);
    setQuery("");
  }

  if (variant === "mobile") {
    return (
      <div ref={containerRef} className="relative">
        {/* Selected chip */}
        {value ? (
          <div className="flex items-center gap-2 rounded-full border border-gtp-teal/40 bg-gtp-teal/10 px-3 py-1.5">
            <span className="max-w-[160px] truncate text-xs font-medium text-white">
              {value}
            </span>
            <button onClick={clear} className="shrink-0 text-white/60 hover:text-white">
              <X className="h-3 w-3" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setOpen((v) => !v)}
            className="flex items-center gap-2 rounded-full border border-white/10 bg-gtp-dark-teal/50 px-3 py-1.5 text-xs font-medium text-white/80 transition-colors hover:bg-white/10 hover:text-white"
          >
            <Search className="h-3 w-3" />
            Speaker
          </button>
        )}

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.15 }}
              className="absolute left-0 top-full z-50 mt-2 w-64 overflow-hidden rounded-xl border border-white/10 bg-gtp-dark-teal/95 shadow-xl backdrop-blur-xl"
            >
              <div className="p-2">
                <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2">
                  <Search className="h-3.5 w-3.5 shrink-0 text-white/40" />
                  <input
                    autoFocus
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search speakers…"
                    className="w-full bg-transparent text-xs text-white placeholder-white/30 outline-none"
                  />
                </div>
              </div>
              <div className="max-h-52 overflow-y-auto pb-2 [&::-webkit-scrollbar]:hidden">
                {filtered.length === 0 ? (
                  <p className="px-4 py-3 text-xs text-white/40">No speakers found</p>
                ) : (
                  filtered.map((name) => (
                    <button
                      key={name}
                      onClick={() => select(name)}
                      className="w-full px-4 py-2.5 text-left text-xs font-medium text-white/80 transition-colors hover:bg-white/10 hover:text-white"
                    >
                      {name}
                    </button>
                  ))
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Sidebar variant
  return (
    <div ref={containerRef} className="relative">
      {/* Selected speaker chip */}
      {value && (
        <div className="mb-2 flex items-center gap-2 rounded-lg border border-gtp-teal/30 bg-gtp-teal/10 px-3 py-2">
          <span className="flex-1 truncate text-xs font-medium text-white">{value}</span>
          <button onClick={clear} className="shrink-0 text-white/50 hover:text-white">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Input */}
      <div
        className={cn(
          "flex items-center gap-2 rounded-lg border px-3 py-2 transition-colors",
          open
            ? "border-gtp-teal/40 bg-white/10"
            : "border-white/10 bg-white/5 hover:border-white/20",
        )}
      >
        <Search className="h-3.5 w-3.5 shrink-0 text-white/60" />
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder="Search speakers…"
          className="w-full bg-transparent text-xs text-white placeholder-white/60 outline-none"
        />
        {query && (
          <button
            onClick={() => { setQuery(""); setOpen(true); }}
            className="shrink-0 text-white/50 hover:text-white"
          >
            <X className="h-3 w-3" />
          </button>
        )}
      </div>

      {/* Dropdown opens below the field (matches mobile filter bar) */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.12 }}
            className="absolute left-0 right-0 top-full z-50 mt-1.5 overflow-hidden rounded-xl border border-white/10 bg-gtp-dark-teal/95 shadow-2xl backdrop-blur-xl"
          >
            <div className="max-h-52 overflow-y-auto py-1 [&::-webkit-scrollbar]:hidden">
              {filtered.length === 0 ? (
                <p className="px-4 py-3 text-xs text-white/40">No speakers found</p>
              ) : (
                filtered.map((name) => (
                  <button
                    key={name}
                    onClick={() => select(name)}
                    className={cn(
                      "w-full px-4 py-2.5 text-left text-xs font-medium transition-colors",
                      value === name
                        ? "bg-gtp-teal/20 text-white"
                        : "text-white/70 hover:bg-white/10 hover:text-white",
                    )}
                  >
                    {name}
                  </button>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
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
  selectedTheme,
  onThemeChange,
  selectedSpeaker,
  onSpeakerChange,
}: {
  selectedType: SessionType | "all";
  onTypeChange: (t: SessionType | "all") => void;
  selectedTheme: ThemeId;
  onThemeChange: (t: ThemeId) => void;
  selectedSpeaker: string | null;
  onSpeakerChange: (s: string | null) => void;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-gtp-dark-teal/40 p-4 shadow-lg backdrop-blur-sm">
      <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-white/70">
        Filters
      </p>

      {/* Speaker — first (feedback Phase 5) */}
      <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-white/60">
        Speaker
      </p>
      <SpeakerSearch value={selectedSpeaker} onChange={onSpeakerChange} variant="sidebar" />

      <div className="my-4 h-px bg-white/10" />

      {/* Type section */}
      <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-white/60">
        Type
      </p>
      <div className="flex flex-col gap-0.5">
        {FILTERABLE_TYPES.map((type) => {
          const label =
            type === "all" ? "All Sessions" : TYPE_META[type as SessionType].label;
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
            disabled={id !== "all"}
          >
            {label}
          </SidebarFilterRow>
        ))}
      </div>
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function sessionMatchesSpeaker(session: Session, speaker: string): boolean {
  return (session.speakers ?? []).some((sp) =>
    sp.name.toLowerCase().includes(speaker.toLowerCase()),
  );
}

function filterSessions(
  sessions: Session[],
  type: SessionType | "all",
  speaker: string | null,
): Session[] {
  let filtered = sessions;

  // Type filter
  if (type !== "all") {
    const hasMatch = filtered.some(
      (s) => s.type !== "break" && s.type !== "reconvening" && s.type === type,
    );
    if (!hasMatch) return [];
    filtered = filtered.filter(
      (s) => s.type === type || s.type === "break" || s.type === "reconvening",
    );
  }

  // Speaker filter
  if (speaker) {
    const hasMatch = filtered.some(
      (s) => s.type !== "break" && s.type !== "reconvening" && sessionMatchesSpeaker(s, speaker),
    );
    if (!hasMatch) return [];
    filtered = filtered.filter(
      (s) =>
        s.type === "break" ||
        s.type === "reconvening" ||
        sessionMatchesSpeaker(s, speaker),
    );
  }

  return filtered;
}

// ─── Page inner (uses useSearchParams — must be inside Suspense) ──────────────

function ProgrammesPageInner() {
  const searchParams = useSearchParams();

  const initialTab = (searchParams.get("tab") as TabId) ?? "pre";
  const initialSession = searchParams.get("session");

  const [activeTab, setActiveTab] = React.useState<TabId>(initialTab);
  const [selectedType, setSelectedType] = React.useState<SessionType | "all">("all");
  const [selectedTheme, setSelectedTheme] = React.useState<ThemeId>("all");
  const [selectedSpeaker, setSelectedSpeaker] = React.useState<string | null>(null);
  const [filtersOpen, setFiltersOpen] = React.useState(false);
  const [highlightSession, setHighlightSession] = React.useState<string | null>(initialSession);

  const tabStripRef = React.useRef<HTMLDivElement>(null);
  const anchorRef = React.useRef<HTMLDivElement>(null);

  // Auto-clear session highlight after 4 seconds
  React.useEffect(() => {
    if (!highlightSession) return;
    const id = setTimeout(() => setHighlightSession(null), 4000);
    return () => clearTimeout(id);
  }, [highlightSession]);

  const hasActiveFilter = selectedType !== "all" || selectedTheme !== "all" || selectedSpeaker !== null;

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

  function handleTabClick(id: TabId) {
    setActiveTab(id);
    if (id === "pre") setFiltersOpen(false);
    scrollToAnchor();
  }

  function handleTypeChange(type: SessionType | "all") {
    setSelectedType(type);
    scrollToAnchor();
  }

  function handleThemeChange(theme: ThemeId) {
    setSelectedTheme(theme);
    scrollToAnchor();
  }

  function handleSpeakerChange(speaker: string | null) {
    setSelectedSpeaker(speaker);
    if (speaker !== null) scrollToAnchor();
  }

  const dayMap: Record<Exclude<TabId, "pre">, Session[]> = {
    day1,
    day2,
    day3,
    day4,
  };

  const currentSessions =
    activeTab !== "pre" ? filterSessions(dayMap[activeTab], selectedType, selectedSpeaker) : [];

  const currentDayLabel = TABS.find((t) => t.id === activeTab)?.label;

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
                selectedTheme={selectedTheme}
                onThemeChange={handleThemeChange}
                selectedSpeaker={selectedSpeaker}
                onSpeakerChange={handleSpeakerChange}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Tab content */}
      <div className="min-h-screen bg-slate-100">
        <div className="mx-auto max-w-7xl px-4 py-10 md:px-6 lg:px-8">
          <div className="flex gap-8">

            {/* ── Desktop sticky sidebar ── */}
            {activeTab !== "pre" && (
              <aside className="hidden lg:block w-52 shrink-0">
                <div className="sticky top-[140px] max-h-[calc(100vh-156px)] overflow-y-auto rounded-2xl [&::-webkit-scrollbar]:hidden">
                  <FilterSidebar
                    selectedType={selectedType}
                    onTypeChange={handleTypeChange}
                    selectedTheme={selectedTheme}
                    onThemeChange={handleThemeChange}
                    selectedSpeaker={selectedSpeaker}
                    onSpeakerChange={handleSpeakerChange}
                  />
                </div>
              </aside>
            )}

            {/* ── Main content ── */}
            <div className="min-w-0 flex-1">
              {activeTab === "pre" && <PreConferencePlaceholder />}

              {activeTab !== "pre" && currentSessions.length > 0 && (
                <DayAgenda
                  sessions={currentSessions}
                  highlightSpeaker={selectedSpeaker ?? undefined}
                  highlightSession={highlightSession ?? undefined}
                  dayLabel={currentDayLabel}
                />
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
                    onClick={() => {
                      handleTypeChange("all");
                      handleSpeakerChange(null);
                    }}
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

// ─── Page export — Suspense required for useSearchParams ─────────────────────

export default function ProgrammesPage() {
  return (
    <Suspense>
      <ProgrammesPageInner />
    </Suspense>
  );
}
