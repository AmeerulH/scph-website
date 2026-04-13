import type { TabId } from "@/components/gtp/programmes/data";
import type { Session } from "@/components/gtp/programmes/types";
import { getSessionVenueLine } from "@/components/gtp/programmes/session-display-helpers";

/** Programme day tabs that map to a concrete conference date (Kuala Lumpur). */
export type GtpProgrammeCalendarDayTab = Exclude<TabId, "pre">;

/** Wall-calendar dates for GTP 2026 main programme (must stay aligned with tab order). */
const DAY_START: Record<
  GtpProgrammeCalendarDayTab,
  { y: number; mo: number; d: number }
> = {
  day1: { y: 2026, mo: 10, d: 12 },
  day2: { y: 2026, mo: 10, d: 13 },
  day3: { y: 2026, mo: 10, d: 14 },
  day4: { y: 2026, mo: 10, d: 15 },
};

/** Interpret session times as Asia/Kuala_Lumpur (UTC+8, no DST) and convert to UTC `Date`. */
function klWallTimeToUtcDate(
  y: number,
  mo: number,
  d: number,
  h: number,
  mi: number,
): Date {
  return new Date(Date.UTC(y, mo - 1, d, h - 8, mi, 0));
}

function formatGoogleCalendarUtc(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    d.getUTCFullYear() +
    pad(d.getUTCMonth() + 1) +
    pad(d.getUTCDate()) +
    "T" +
    pad(d.getUTCHours()) +
    pad(d.getUTCMinutes()) +
    pad(d.getUTCSeconds()) +
    "Z"
  );
}

function parseHHMM(s: string): { h: number; m: number } | null {
  const m = s.trim().match(/^(\d{1,2}):(\d{2})$/);
  if (!m) return null;
  const h = Number(m[1]);
  const mi = Number(m[2]);
  if (
    !Number.isFinite(h) ||
    !Number.isFinite(mi) ||
    h < 0 ||
    h > 23 ||
    mi < 0 ||
    mi > 59
  ) {
    return null;
  }
  return { h, m: mi };
}

/** Parse `time` like `09:00 – 11:00` or `09:00 - 11:00`; fall back to `durationMins` for end. */
export function parseProgrammeSessionTimeRange(
  time: string,
  durationMins?: number,
): { start: { h: number; m: number }; end: { h: number; m: number } } | null {
  const parts = time.trim().split(/\s*[–—-]\s+/);
  const startS = parts[0]?.trim() ?? "";
  const endS = parts[1]?.trim();
  const start = parseHHMM(startS);
  if (!start) return null;
  if (endS) {
    const end = parseHHMM(endS);
    if (end) return { start, end };
  }
  if (typeof durationMins === "number" && durationMins > 0) {
    const startM = start.h * 60 + start.m;
    const endM = startM + durationMins;
    return {
      start,
      end: { h: Math.floor(endM / 60) % 24, m: endM % 60 },
    };
  }
  return null;
}

const GCAL_DETAILS_MAX = 1800;

function buildDetails(
  session: Session,
  extraLines: string[],
  includeSessionObjective: boolean,
): string {
  const lines = [
    "Global Tipping Points Conference 2026",
    "Sunway Centre for Planetary Health, Kuala Lumpur, Malaysia.",
    ...extraLines.filter((l) => l.trim().length > 0),
  ];
  if (includeSessionObjective) {
    const obj =
      typeof session.objective === "string" ? session.objective.trim() : "";
    if (obj) lines.push(obj);
  }
  return lines.join("\n\n").slice(0, GCAL_DETAILS_MAX);
}

/**
 * Google Calendar “create event” URL for a programme row (session times = Asia/Kuala_Lumpur).
 * Returns `null` if the time string cannot be parsed.
 */
export function buildProgrammeGoogleCalendarUrl(params: {
  tabId: GtpProgrammeCalendarDayTab;
  session: Session;
  /** Calendar title; defaults to `session.title`. */
  title?: string;
  /** Inserted after the standard conference blurb (e.g. “Part of: …”, workshop objective). */
  detailsPrefixLines?: string[];
  /** Set false for parallel-slot rows where `session` is the parent block. */
  includeSessionObjective?: boolean;
}): string | null {
  const {
    tabId,
    session,
    title = session.title,
    detailsPrefixLines = [],
    includeSessionObjective = true,
  } = params;
  const range = parseProgrammeSessionTimeRange(session.time, session.durationMins);
  if (!range) return null;

  const { y, mo, d } = DAY_START[tabId];
  const startUtc = klWallTimeToUtcDate(y, mo, d, range.start.h, range.start.m);
  let endUtc = klWallTimeToUtcDate(y, mo, d, range.end.h, range.end.m);
  if (endUtc.getTime() <= startUtc.getTime()) {
    endUtc = new Date(endUtc.getTime() + 24 * 60 * 60 * 1000);
  }

  const details = buildDetails(
    session,
    detailsPrefixLines,
    includeSessionObjective,
  );
  const location = getSessionVenueLine(session);

  const url = new URL("https://www.google.com/calendar/render");
  url.searchParams.set("action", "TEMPLATE");
  url.searchParams.set("text", title);
  url.searchParams.set(
    "dates",
    `${formatGoogleCalendarUtc(startUtc)}/${formatGoogleCalendarUtc(endUtc)}`,
  );
  url.searchParams.set("details", details);
  url.searchParams.set("location", location);
  return url.toString();
}
