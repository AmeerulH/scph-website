"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

import { TabId, TYPE_META } from "@/components/gtp/programmes/data";
import type { GtpProgrammeTab } from "@/sanity/queries";
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
  selectedTheme,
  onThemeChange,
}: {
  selectedType: SessionType | "all";
  onTypeChange: (t: SessionType | "all") => void;
  selectedTheme: ThemeId;
  onThemeChange: (t: ThemeId) => void;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-gtp-dark-teal/40 p-4 shadow-lg backdrop-blur-sm">
      <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-white/70">
        Filters
      </p>

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
          >
            {label}
          </SidebarFilterRow>
        ))}
      </div>
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function sessionMatchesTheme(session: Session, theme: ThemeId): boolean {
  if (theme === "all") return true;
  return session.theme === theme;
}

function filterSessions(
  sessions: Session[],
  type: SessionType | "all",
  theme: ThemeId,
): Session[] {
  let filtered = sessions;

  if (type !== "all") {
    const hasMatch = filtered.some(
      (s) => s.type !== "break" && s.type !== "reconvening" && s.type === type,
    );
    if (!hasMatch) return [];
    filtered = filtered.filter(
      (s) => s.type === type || s.type === "break" || s.type === "reconvening",
    );
  }

  if (theme !== "all") {
    const hasMatch = filtered.some(
      (s) =>
        s.type !== "break" &&
        s.type !== "reconvening" &&
        sessionMatchesTheme(s, theme),
    );
    if (!hasMatch) return [];
    filtered = filtered.filter(
      (s) =>
        s.type === "break" ||
        s.type === "reconvening" ||
        sessionMatchesTheme(s, theme),
    );
  }

  return filtered;
}

// ─── Client body (useSearchParams — must be inside Suspense in parent) ───────

export function ProgrammesPageClient({
  tabs,
  day1,
  day2,
  day3,
  day4,
}: {
  tabs: GtpProgrammeTab[];
  day1: Session[];
  day2: Session[];
  day3: Session[];
  day4: Session[];
}) {
  const searchParams = useSearchParams();

  const tabIds = new Set(tabs.map((t) => t.id));
  const tabParam = searchParams.get("tab");
  const initialTab: TabId =
    tabParam && tabIds.has(tabParam as TabId) ? (tabParam as TabId) : "pre";
  const initialSession = searchParams.get("session");

  const [activeTab, setActiveTab] = React.useState<TabId>(initialTab);
  const [selectedType, setSelectedType] = React.useState<SessionType | "all">("all");
  const [selectedTheme, setSelectedTheme] = React.useState<ThemeId>("all");
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

  const hasActiveFilter = selectedType !== "all" || selectedTheme !== "all";

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

  const dayMap: Record<Exclude<TabId, "pre">, Session[]> = {
    day1,
    day2,
    day3,
    day4,
  };

  const currentSessions =
    activeTab !== "pre"
      ? filterSessions(dayMap[activeTab], selectedType, selectedTheme)
      : [];

  const currentDayLabel = tabs.find((t) => t.id === activeTab)?.label;

  return (
    <>
      {/* Scroll anchor */}
      <div ref={anchorRef} />

      {/* Sticky tab strip + filter bar */}
      <div ref={tabStripRef} className="sticky top-[72px] z-40">
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
                selectedTheme={selectedTheme}
                onThemeChange={handleThemeChange}
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
                    Try a different session type, theme, or day.
                  </p>
                  <button
                    onClick={() => {
                      handleTypeChange("all");
                      handleThemeChange("all");
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
