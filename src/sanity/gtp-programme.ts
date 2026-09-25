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
  ProgrammeHostedByOverride,
  ProgrammeVenueType,
  Session,
  SessionType,
  Speaker,
  Workshop,
} from "@/components/gtp/programmes/types";
import { client } from "./client";

/** CMS may still define an optional pre-conference day; it is omitted from static fallbacks. */
export type GtpProgrammeTabId = TabId | "pre";

const TAB_ORDER = [
  "pre",
  "day1",
  "day2",
  "day3",
  "day4",
] as const satisfies readonly GtpProgrammeTabId[];

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

const VENUE_TYPES = new Set<ProgrammeVenueType>([
  "main",
  "evening_offsite",
  "online",
  "breakout",
  "multiple",
  "tbc",
  "other",
]);

export type GtpProgrammeTab = { id: GtpProgrammeTabId; label: string };

/** Conference days shown in the events preview carousel (not pre-conference). */
export type GtpCarouselDayTab = "day1" | "day2" | "day3" | "day4";

export type GtpCarouselMeta = Record<
  GtpCarouselDayTab,
  { dateLabel: string; dayNumber: string }
>;

/** “Hosted by” block in the programme session detail modal (from `gtp2026Programme`). */
export type GtpSessionModalHostedBy = {
  sectionTitle: string;
  logoUrl: string | null;
  logoAlt: string;
  logoWidth?: number;
  logoHeight?: number;
  name: string;
  subtitle: string;
  /** When false, the location line is omitted in session and workshop popups. */
  showSubtitle: boolean;
};

export const DEFAULT_SESSION_MODAL_HOSTED_BY: GtpSessionModalHostedBy = {
  sectionTitle: "Hosted By",
  logoUrl: null,
  logoAlt: "",
  name: "Sunway Centre for Planetary Health",
  subtitle: "Sunway University, Kuala Lumpur",
  showSubtitle: true,
};

export type GtpProgrammePageData = {
  tabs: GtpProgrammeTab[];
  carouselMeta: GtpCarouselMeta;
  sessionModalHostedBy: GtpSessionModalHostedBy;
  day1: Session[];
  day2: Session[];
  day3: Session[];
  day4: Session[];
};

/** Session row for `GtpEventsPreviewCarousel` (from CMS + carousel chip labels). */
export type GtpFeaturedCarouselSession = Session & {
  tabId: GtpCarouselDayTab;
  dateLabel: string;
  dayNumber: string;
};

const CAROUSEL_FALLBACK: GtpCarouselMeta = {
  day1: { dateLabel: "12 Oct", dayNumber: "Day 1" },
  day2: { dateLabel: "13 Oct", dayNumber: "Day 2" },
  day3: { dateLabel: "14 Oct", dayNumber: "Day 3" },
  day4: { dateLabel: "15 Oct", dayNumber: "Day 4" },
};

const CAROUSEL_TABS: GtpCarouselDayTab[] = ["day1", "day2", "day3", "day4"];

const CAROUSEL_EXCLUDED_TYPES = new Set<SessionType>(["break", "reconvening"]);

interface SanityHostedByFields {
  hostedByName?: string | null;
  hostedByLocation?: string | null;
  hostedByShowLocation?: boolean | null;
  hostedByLogo?: SanitySessionModalHostedLogo | null;
}

interface SanityWorkshopRow extends SanityHostedByFields {
  number?: string;
  title?: string;
  objective?: string;
  speakers?: SanitySpeakerRow[];
  facilitators?: SanitySpeakerRow[];
  speakerCount?: number;
}

interface SanitySpeakerRow {
  name?: string;
  designation?: string;
  sessionRole?: string;
  imageUrl?: string | null;
}

interface SanitySessionRow extends SanityHostedByFields {
  time?: string;
  durationMins?: number;
  type?: string;
  closedEvent?: boolean | null;
  title?: string;
  objective?: string;
  theme?: string;
  speakerCount?: number;
  speakers?: SanitySpeakerRow[];
  facilitators?: SanitySpeakerRow[];
  workshops?: SanityWorkshopRow[];
  breakLabel?: string;
  breakIcon?: string;
  workshopNote?: string;
  isEvening?: boolean;
  venueType?: string;
  venueLine?: string;
  formatLabel?: string;
  carouselBackgroundImage?: {
    alt?: string | null;
    asset?: { url?: string | null } | null;
  } | null;
}

interface SanityProgrammeDayRow {
  tabId?: string;
  label?: string;
  carouselDateLabel?: string;
  carouselDayLabel?: string;
  sessions?: SanitySessionRow[];
}

interface SanitySessionModalHostedLogo {
  alt?: string | null;
  asset?: {
    url?: string | null;
    metadata?: {
      dimensions?: { width?: number | null; height?: number | null } | null;
    } | null;
  } | null;
}

interface SanityGtpProgrammeDoc {
  _id?: string;
  sessionModalHostedSectionTitle?: string | null;
  sessionModalHostedName?: string | null;
  sessionModalHostedSubtitle?: string | null;
  sessionModalHostedShowSubtitle?: boolean | null;
  sessionModalHostedLogo?: SanitySessionModalHostedLogo | null;
  days?: SanityProgrammeDayRow[];
}

const hostedByProjection = `
  hostedByName,
  hostedByLocation,
  hostedByShowLocation,
  hostedByLogo {
    alt,
    asset->{
      url,
      metadata { dimensions { width, height } }
    }
  }`;

const gtpProgrammeQuery = `*[_type == "gtp2026Programme" && _id == "gtp2026Programme"][0]{
  _id,
  sessionModalHostedSectionTitle,
  sessionModalHostedName,
  sessionModalHostedSubtitle,
  sessionModalHostedShowSubtitle,
  sessionModalHostedLogo {
    alt,
    asset->{
      url,
      metadata { dimensions { width, height } }
    }
  },
  days[]{
    tabId,
    label,
    carouselDateLabel,
    carouselDayLabel,
    sessions[]{
      time,
      durationMins,
      type,
      closedEvent,
      title,
      objective,
      theme,
      speakerCount,
      speakers[]{
        name,
        designation,
        sessionRole,
        "imageUrl": image.asset->url
      },
      facilitators[]{
        name,
        designation,
        sessionRole,
        "imageUrl": image.asset->url
      },
      ${hostedByProjection},
      workshops[]{
        number,
        title,
        objective,
        speakerCount,
        speakers[]{
          name,
          designation,
          sessionRole,
          "imageUrl": image.asset->url
        },
        facilitators[]{
          name,
          designation,
          sessionRole,
          "imageUrl": image.asset->url
        },
        ${hostedByProjection}
      },
      breakLabel,
      breakIcon,
      workshopNote,
      isEvening,
      venueType,
      venueLine,
      formatLabel,
      carouselBackgroundImage {
        alt,
        asset->{ url }
      }
    }
  }
}`;

function getStaticGtpProgramme(): GtpProgrammePageData {
  return {
    tabs: staticTabs.map((t) => ({ id: t.id, label: t.label })),
    carouselMeta: {...CAROUSEL_FALLBACK},
    sessionModalHostedBy: { ...DEFAULT_SESSION_MODAL_HOSTED_BY },
    day1: staticDay1,
    day2: staticDay2,
    day3: staticDay3,
    day4: staticDay4,
  };
}

function mapSessionModalHostedBy(
  doc: SanityGtpProgrammeDoc | null,
): GtpSessionModalHostedBy {
  const d = DEFAULT_SESSION_MODAL_HOSTED_BY;
  if (!doc) return d;

  const sectionTitle =
    typeof doc.sessionModalHostedSectionTitle === "string" &&
    doc.sessionModalHostedSectionTitle.trim()
      ? doc.sessionModalHostedSectionTitle.trim()
      : d.sectionTitle;

  const name =
    typeof doc.sessionModalHostedName === "string" &&
    doc.sessionModalHostedName.trim()
      ? doc.sessionModalHostedName.trim()
      : d.name;

  const subtitle =
    typeof doc.sessionModalHostedSubtitle === "string" &&
    doc.sessionModalHostedSubtitle.trim()
      ? doc.sessionModalHostedSubtitle.trim()
      : d.subtitle;

  const logo = doc.sessionModalHostedLogo;
  const url =
    typeof logo?.asset?.url === "string" && logo.asset.url.trim()
      ? logo.asset.url.trim()
      : null;
  const altRaw =
    typeof logo?.alt === "string" && logo.alt.trim() ? logo.alt.trim() : "";
  const w = logo?.asset?.metadata?.dimensions?.width;
  const h = logo?.asset?.metadata?.dimensions?.height;

  return {
    sectionTitle,
    name,
    subtitle,
    logoUrl: url,
    logoAlt: altRaw || (name ? `${name} logo` : "Host organisation logo"),
    logoWidth: typeof w === "number" && w > 0 ? w : undefined,
    logoHeight: typeof h === "number" && h > 0 ? h : undefined,
    showSubtitle: doc.sessionModalHostedShowSubtitle !== false,
  };
}

function buildCarouselMetaFromSanityDays(byTab: Map<string, SanityProgrammeDayRow>): GtpCarouselMeta {
  const meta = {} as GtpCarouselMeta;
  for (const tab of CAROUSEL_TABS) {
    const row = byTab.get(tab);
    const fb = CAROUSEL_FALLBACK[tab];
    const dateLabel =
      typeof row?.carouselDateLabel === "string" && row.carouselDateLabel.trim()
        ? row.carouselDateLabel.trim()
        : fb.dateLabel;
    const dayNumber =
      typeof row?.carouselDayLabel === "string" && row.carouselDayLabel.trim()
        ? row.carouselDayLabel.trim()
        : fb.dayNumber;
    meta[tab] = { dateLabel, dayNumber };
  }
  return meta;
}

/**
 * Flattens programme days into carousel cards (matches prior static filter: no break/reconvening).
 */
export function buildGtpCarouselSessions(data: GtpProgrammePageData): GtpFeaturedCarouselSession[] {
  const out: GtpFeaturedCarouselSession[] = [];
  for (const tab of CAROUSEL_TABS) {
    const { dateLabel, dayNumber } = data.carouselMeta[tab];
    for (const s of data[tab]) {
      if (CAROUSEL_EXCLUDED_TYPES.has(s.type)) continue;
      out.push({ ...s, tabId: tab, dateLabel, dayNumber });
    }
  }
  return out;
}

function mapSpeaker(row: SanitySpeakerRow): Speaker | null {
  const name = typeof row.name === "string" ? row.name.trim() : "";
  if (!name) return null;
  const designation =
    typeof row.designation === "string" && row.designation.trim()
      ? row.designation.trim()
      : undefined;
  const sessionRole =
    typeof row.sessionRole === "string" && row.sessionRole.trim()
      ? row.sessionRole.trim()
      : undefined;
  const imageUrl =
    typeof row.imageUrl === "string" && row.imageUrl.trim() ? row.imageUrl.trim() : undefined;

  const speaker: Speaker = { name };
  if (designation) speaker.designation = designation;
  if (sessionRole) speaker.sessionRole = sessionRole;
  if (imageUrl) speaker.imageUrl = imageUrl;
  return speaker;
}

function isFacilitatorSessionRole(role: string | undefined): boolean {
  const value = role?.trim().toLowerCase() ?? "";
  return value === "facilitator" || value === "facilitators";
}

function mapNamedPeople(rows: SanitySpeakerRow[] | undefined): Speaker[] {
  if (!Array.isArray(rows) || rows.length === 0) return [];
  return rows.map(mapSpeaker).filter((s): s is Speaker => s !== null);
}

function splitSpeakersAndFacilitators(
  speakerRows: SanitySpeakerRow[] | undefined,
  facilitatorRows: SanitySpeakerRow[] | undefined,
): { speakers: Speaker[]; facilitators: Speaker[] } {
  const facilitators = mapNamedPeople(facilitatorRows);
  const facilitatorKeys = new Set(
    facilitators.map((person) => person.name.trim().toLowerCase()),
  );
  const speakers: Speaker[] = [];
  for (const person of mapNamedPeople(speakerRows)) {
    const key = person.name.trim().toLowerCase();
    if (facilitatorKeys.has(key) || isFacilitatorSessionRole(person.sessionRole)) {
      if (!facilitatorKeys.has(key)) {
        facilitators.push(person);
        facilitatorKeys.add(key);
      }
      continue;
    }
    speakers.push(person);
  }
  return { speakers, facilitators };
}

function mapHostedByOverride(row: SanityHostedByFields): ProgrammeHostedByOverride | undefined {
  const name = typeof row.hostedByName === "string" ? row.hostedByName.trim() : "";
  const location =
    typeof row.hostedByLocation === "string" ? row.hostedByLocation.trim() : "";
  const logo = row.hostedByLogo;
  const logoUrl =
    typeof logo?.asset?.url === "string" && logo.asset.url.trim() ? logo.asset.url.trim() : "";
  if (!name && !logoUrl) return undefined;

  const override: ProgrammeHostedByOverride = {};
  if (name) override.name = name;
  if (location) override.location = location;
  if (row.hostedByShowLocation === false) override.showLocation = false;
  if (row.hostedByShowLocation === true) override.showLocation = true;
  if (logoUrl) {
    override.logoUrl = logoUrl;
    const alt = typeof logo?.alt === "string" ? logo.alt.trim() : "";
    if (alt) override.logoAlt = alt;
    const width = logo?.asset?.metadata?.dimensions?.width;
    const height = logo?.asset?.metadata?.dimensions?.height;
    if (typeof width === "number" && width > 0) override.logoWidth = width;
    if (typeof height === "number" && height > 0) override.logoHeight = height;
  }
  return override;
}

function mapWorkshop(row: SanityWorkshopRow): Workshop | null {
  const number = typeof row.number === "string" ? row.number.trim() : "";
  const title = typeof row.title === "string" ? row.title.trim() : "";
  if (!number || !title) return null;

  const workshop: Workshop = { number, title };

  if (typeof row.objective === "string" && row.objective.trim()) {
    workshop.objective = row.objective.trim();
  }

  const { speakers, facilitators } = splitSpeakersAndFacilitators(
    row.speakers,
    row.facilitators,
  );

  if (speakers.length > 0) workshop.speakers = speakers;
  if (facilitators.length > 0) workshop.facilitators = facilitators;

  const hostedBy = mapHostedByOverride(row);
  if (hostedBy) workshop.hostedBy = hostedBy;

  if (typeof row.speakerCount === "number" && Number.isFinite(row.speakerCount)) {
    workshop.speakerCount = row.speakerCount;
  }

  return workshop;
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

  if (row.closedEvent === true) session.closedEvent = true;

  if (typeof row.objective === "string" && row.objective.trim()) {
    session.objective = row.objective.trim();
  }

  if (typeof row.durationMins === "number" && Number.isFinite(row.durationMins)) {
    session.durationMins = row.durationMins;
  }

  if (typeof row.theme === "string" && THEME_IDS.has(row.theme as ConferenceThemeId)) {
    session.theme = row.theme as ConferenceThemeId;
  }

  if (typeof row.speakerCount === "number" && Number.isFinite(row.speakerCount)) {
    session.speakerCount = row.speakerCount;
  }

  const { speakers, facilitators } = splitSpeakersAndFacilitators(
    row.speakers,
    row.facilitators,
  );
  if (speakers.length > 0) session.speakers = speakers;
  if (facilitators.length > 0) session.facilitators = facilitators;

  const hostedBy = mapHostedByOverride(row);
  if (hostedBy) session.hostedBy = hostedBy;

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

  if (typeof row.workshopNote === "string" && row.workshopNote.trim()) {
    session.workshopNote = row.workshopNote.trim();
  }

  if (row.isEvening === true) session.isEvening = true;

  if (typeof row.venueType === "string" && VENUE_TYPES.has(row.venueType as ProgrammeVenueType)) {
    session.venueType = row.venueType as ProgrammeVenueType;
  }

  if (typeof row.venueLine === "string" && row.venueLine.trim()) {
    session.venueLine = row.venueLine.trim();
  }

  if (typeof row.formatLabel === "string" && row.formatLabel.trim()) {
    session.formatLabel = row.formatLabel.trim();
  }

  const carouselBg = row.carouselBackgroundImage;
  const carouselUrl =
    typeof carouselBg?.asset?.url === "string" && carouselBg.asset.url.trim()
      ? carouselBg.asset.url.trim()
      : undefined;
  if (carouselUrl) {
    session.carouselBackgroundImageUrl = carouselUrl;
    const altRaw =
      typeof carouselBg?.alt === "string" && carouselBg.alt.trim()
        ? carouselBg.alt.trim()
        : "";
    session.carouselBackgroundImageAlt = altRaw || title;
  }

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

  return TAB_ORDER.filter((id) => byTab.has(id)).map((id) => {
    const fromSanity = byTab.get(id)!;
    const fallback = staticTabs.find((t) => t.id === id);
    const label =
      typeof fromSanity.label === "string" && fromSanity.label.trim()
        ? fromSanity.label.trim()
        : (fallback?.label ?? id);
    return { id, label };
  });
}

/** CMS value wins; static data.tsx value is the code-level default. */
function applyStaticWorkshopNotes(sessions: Session[], staticSessions: Session[]): Session[] {
  const notes = new Map(
    staticSessions.filter((s) => s.workshopNote).map((s) => [s.time, s.workshopNote!]),
  );
  if (notes.size === 0) return sessions;
  return sessions.map((s) => {
    if (s.workshopNote) return s;
    const note = notes.get(s.time);
    return note ? { ...s, workshopNote: note } : s;
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
  const day2 = applyStaticWorkshopNotes(mapDaySessions(byTab.get("day2")?.sessions, devLog), staticDay2);
  const day3 = applyStaticWorkshopNotes(mapDaySessions(byTab.get("day3")?.sessions, devLog), staticDay3);
  const day4 = mapDaySessions(byTab.get("day4")?.sessions, devLog);

  const data: GtpProgrammePageData = {
    tabs: buildTabsFromSanityDays(doc.days),
    carouselMeta: buildCarouselMetaFromSanityDays(byTab),
    sessionModalHostedBy: mapSessionModalHostedBy(doc),
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
