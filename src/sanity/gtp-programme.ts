import {
  day1 as staticDay1,
  day2 as staticDay2,
  day3 as staticDay3,
  day4 as staticDay4,
  TABS as staticTabs,
  type TabId,
} from "@/components/gtp/programmes/data";
import type {
  ConferenceThemeId,
  Session,
  SessionType,
  Speaker,
  Workshop,
} from "@/components/gtp/programmes/types";
import { client } from "./client";

const TAB_ORDER = ["pre", "day1", "day2", "day3", "day4"] as const satisfies readonly TabId[];

const SESSION_TYPES = new Set<SessionType>([
  "opening",
  "plenary",
  "lightning",
  "fireside",
  "reconvening",
  "concurrent",
  "research",
  "special",
  "closing",
  "break",
]);

const THEME_IDS = new Set<ConferenceThemeId>(["shift", "imagination", "action"]);

export type GtpProgrammeTab = { id: TabId; label: string };

export type GtpProgrammePageData = {
  tabs: GtpProgrammeTab[];
  day1: Session[];
  day2: Session[];
  day3: Session[];
  day4: Session[];
};

interface SanityWorkshopRow {
  number?: string;
  title?: string;
}

interface SanitySpeakerRow {
  name?: string;
  designation?: string;
}

interface SanitySessionRow {
  time?: string;
  durationMins?: number;
  type?: string;
  title?: string;
  theme?: string;
  speakerCount?: number;
  speakers?: SanitySpeakerRow[];
  workshops?: SanityWorkshopRow[];
  breakLabel?: string;
  breakIcon?: string;
  isEvening?: boolean;
}

interface SanityProgrammeDayRow {
  tabId?: string;
  label?: string;
  carouselDateLabel?: string;
  carouselDayLabel?: string;
  sessions?: SanitySessionRow[];
}

interface SanityGtpProgrammeDoc {
  _id?: string;
  days?: SanityProgrammeDayRow[];
}

const gtpProgrammeQuery = `*[_type == "gtp2026Programme" && _id == "gtp2026Programme"][0]{
  _id,
  days[]{
    tabId,
    label,
    carouselDateLabel,
    carouselDayLabel,
    sessions[]{
      time,
      durationMins,
      type,
      title,
      theme,
      speakerCount,
      speakers[]{ name, designation },
      workshops[]{ number, title },
      breakLabel,
      breakIcon,
      isEvening
    }
  }
}`;

function getStaticGtpProgramme(): GtpProgrammePageData {
  return {
    tabs: staticTabs.map((t) => ({ id: t.id, label: t.label })),
    day1: staticDay1,
    day2: staticDay2,
    day3: staticDay3,
    day4: staticDay4,
  };
}

function mapSpeaker(row: SanitySpeakerRow): Speaker | null {
  const name = typeof row.name === "string" ? row.name.trim() : "";
  if (!name) return null;
  const designation =
    typeof row.designation === "string" && row.designation.trim()
      ? row.designation.trim()
      : undefined;
  return designation ? { name, designation } : { name };
}

function mapWorkshop(row: SanityWorkshopRow): Workshop | null {
  const number = typeof row.number === "string" ? row.number.trim() : "";
  const title = typeof row.title === "string" ? row.title.trim() : "";
  if (!number || !title) return null;
  return { number, title };
}

function mapSession(row: SanitySessionRow, devLog: boolean): Session | null {
  const time = typeof row.time === "string" ? row.time.trim() : "";
  const title = typeof row.title === "string" ? row.title.trim() : "";
  const type = row.type;
  if (!time || !title || typeof type !== "string" || !SESSION_TYPES.has(type as SessionType)) {
    if (devLog) {
      console.warn("[getGtp2026Programme] skipped session (missing fields or invalid type)", row);
    }
    return null;
  }

  const session: Session = {
    time,
    title,
    type: type as SessionType,
  };

  if (typeof row.durationMins === "number" && Number.isFinite(row.durationMins)) {
    session.durationMins = row.durationMins;
  }

  if (typeof row.theme === "string" && THEME_IDS.has(row.theme as ConferenceThemeId)) {
    session.theme = row.theme as ConferenceThemeId;
  }

  if (typeof row.speakerCount === "number" && Number.isFinite(row.speakerCount)) {
    session.speakerCount = row.speakerCount;
  }

  if (Array.isArray(row.speakers) && row.speakers.length > 0) {
    const speakers = row.speakers.map(mapSpeaker).filter((s): s is Speaker => s !== null);
    if (speakers.length > 0) session.speakers = speakers;
  }

  if (Array.isArray(row.workshops) && row.workshops.length > 0) {
    const workshops = row.workshops.map(mapWorkshop).filter((w): w is Workshop => w !== null);
    if (workshops.length > 0) session.workshops = workshops;
  }

  if (typeof row.breakLabel === "string" && row.breakLabel.trim()) {
    session.breakLabel = row.breakLabel.trim();
  }

  if (row.breakIcon === "coffee" || row.breakIcon === "lunch") {
    session.breakIcon = row.breakIcon;
  }

  if (row.isEvening === true) session.isEvening = true;

  return session;
}

function mapDaySessions(rows: SanitySessionRow[] | undefined, devLog: boolean): Session[] {
  if (!Array.isArray(rows)) return [];
  return rows.map((r) => mapSession(r, devLog)).filter((s): s is Session => s !== null);
}

function isConferenceComplete(d: GtpProgrammePageData): boolean {
  return d.day1.length > 0 && d.day2.length > 0 && d.day3.length > 0 && d.day4.length > 0;
}

function buildTabsFromSanityDays(days: SanityProgrammeDayRow[]): GtpProgrammeTab[] {
  const byTab = new Map<string, SanityProgrammeDayRow>();
  for (const day of days) {
    const id = typeof day.tabId === "string" ? day.tabId : "";
    if (id && !byTab.has(id)) byTab.set(id, day);
  }

  return TAB_ORDER.map((id) => {
    const fromSanity = byTab.get(id);
    const fallback = staticTabs.find((t) => t.id === id)!;
    const label =
      typeof fromSanity?.label === "string" && fromSanity.label.trim()
        ? fromSanity.label.trim()
        : fallback.label;
    return { id, label };
  });
}

function mapSanityDocumentToProgramme(doc: SanityGtpProgrammeDoc | null): GtpProgrammePageData | null {
  if (!doc?.days?.length) return null;

  const byTab = new Map<string, SanityProgrammeDayRow>();
  for (const day of doc.days) {
    const id = typeof day.tabId === "string" ? day.tabId : "";
    if (id && !byTab.has(id)) byTab.set(id, day);
  }

  const devLog = process.env.NODE_ENV === "development";

  const day1 = mapDaySessions(byTab.get("day1")?.sessions, devLog);
  const day2 = mapDaySessions(byTab.get("day2")?.sessions, devLog);
  const day3 = mapDaySessions(byTab.get("day3")?.sessions, devLog);
  const day4 = mapDaySessions(byTab.get("day4")?.sessions, devLog);

  const data: GtpProgrammePageData = {
    tabs: buildTabsFromSanityDays(doc.days),
    day1,
    day2,
    day3,
    day4,
  };

  if (!isConferenceComplete(data)) return null;

  return data;
}

/**
 * Loads GTP 2026 programme from Sanity (`gtp2026Programme` id). Falls back to
 * `data.tsx` if the query fails or conference days are incomplete.
 */
export async function getGtp2026Programme(): Promise<GtpProgrammePageData> {
  const fallback = getStaticGtpProgramme();
  try {
    const doc = await client.fetch<SanityGtpProgrammeDoc | null>(gtpProgrammeQuery);
    const mapped = mapSanityDocumentToProgramme(doc);
    if (mapped) return mapped;
  } catch (err) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[getGtp2026Programme] fetch/map failed, using static fallback", err);
    }
  }
  return fallback;
}
