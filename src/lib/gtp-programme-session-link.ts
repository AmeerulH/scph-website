/** Programme day tabs that deep-link via `?tab=` on /events/gtp-2026/programmes. */
export type ProgrammeDayTab = "day1" | "day2" | "day3" | "day4";

const DAY_TAB_RE = /Day\s*([1-4])/i;

const PLACEHOLDER_TITLES = new Set([
  "session to be announced",
  "sessions to be announced",
]);

/**
 * Parse `Day N` from CMS speaker date lines (e.g. `Day 1 | 1145 - 1300`).
 */
export function parseProgrammeDayTab(date: string): ProgrammeDayTab | null {
  const match = DAY_TAB_RE.exec(date);
  if (!match) return null;
  return `day${match[1]}` as ProgrammeDayTab;
}

/**
 * Normalize session titles for compare and query values (trim, NBSP, collapse space).
 */
export function normalizeProgrammeSessionTitle(title: string): string {
  return title
    .replace(/\u00a0/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function isPlaceholderSessionTitle(title: string): boolean {
  return PLACEHOLDER_TITLES.has(normalizeProgrammeSessionTitle(title).toLowerCase());
}

/**
 * Build a programmes deep-link when day + a real session title are available.
 * Shape matches the What’s On carousel: `?tab=dayN&session=<title>`.
 */
export function buildProgrammeSessionHref({
  title,
  date,
}: {
  title: string;
  date: string;
}): string | null {
  const tab = parseProgrammeDayTab(date);
  const normalized = normalizeProgrammeSessionTitle(title);
  if (!tab || !normalized || isPlaceholderSessionTitle(normalized)) {
    return null;
  }
  return `/events/gtp-2026/programmes?tab=${tab}&session=${encodeURIComponent(normalized)}`;
}
