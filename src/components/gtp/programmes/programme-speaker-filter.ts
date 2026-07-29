import type { Session, SessionType } from "./types";

export type ThemeFilterId = "all" | "shift" | "imagination" | "action";

export type SpeakerOption = {
  name: string;
  designation?: string;
};

export type SpeakerAppearance = {
  tabId: "day1" | "day2" | "day3" | "day4";
  dayLabel: string;
  time: string;
  sessionTitle: string;
};

export function normalizeSpeakerName(name: string): string {
  return name.trim().toLowerCase();
}

function sessionMatchesTheme(session: Session, theme: ThemeFilterId): boolean {
  if (theme === "all") return true;
  return session.theme === theme;
}

function sessionMatchesType(session: Session, type: SessionType | "all"): boolean {
  if (type === "all") return true;
  return session.type === type;
}

/** True if the speaker appears on the session or any nested workshop. */
export function sessionIncludesSpeaker(session: Session, speakerName: string): boolean {
  const key = normalizeSpeakerName(speakerName);
  if (!key) return false;

  if (session.speakers?.some((s) => normalizeSpeakerName(s.name) === key)) {
    return true;
  }
  return (
    session.workshops?.some((w) =>
      w.speakers?.some((s) => normalizeSpeakerName(s.name) === key),
    ) ?? false
  );
}

function workshopIncludesSpeaker(
  speakers: { name: string }[] | undefined,
  speakerName: string,
): boolean {
  const key = normalizeSpeakerName(speakerName);
  if (!key) return false;
  return speakers?.some((s) => normalizeSpeakerName(s.name) === key) ?? false;
}

export function workshopHasSpeaker(
  workshop: { speakers?: { name: string }[] },
  speakerName: string,
): boolean {
  return workshopIncludesSpeaker(workshop.speakers, speakerName);
}

/** Deduped A–Z list of named speakers across all sessions (incl. workshops). */
export function collectSpeakers(sessions: Session[]): SpeakerOption[] {
  const byKey = new Map<string, SpeakerOption>();

  for (const session of sessions) {
    for (const sp of session.speakers ?? []) {
      const key = normalizeSpeakerName(sp.name);
      if (!key || byKey.has(key)) continue;
      const option: SpeakerOption = { name: sp.name.trim() };
      const designation = sp.designation?.trim();
      if (designation) option.designation = designation;
      byKey.set(key, option);
    }
    for (const workshop of session.workshops ?? []) {
      for (const sp of workshop.speakers ?? []) {
        const key = normalizeSpeakerName(sp.name);
        if (!key || byKey.has(key)) continue;
        const option: SpeakerOption = { name: sp.name.trim() };
        const designation = sp.designation?.trim();
        if (designation) option.designation = designation;
        byKey.set(key, option);
      }
    }
  }

  return Array.from(byKey.values()).sort((a, b) =>
    a.name.localeCompare(b.name, undefined, { sensitivity: "base" }),
  );
}

/**
 * Sessions on one day that match type + theme + optional speaker.
 * When a speaker is selected, breaks/reconvening are removed.
 */
export function filterSessionsWithSpeaker(
  sessions: Session[],
  type: SessionType | "all",
  theme: ThemeFilterId,
  speakerName: string | null,
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

  if (speakerName) {
    const hasMatch = filtered.some(
      (s) =>
        s.type !== "break" &&
        s.type !== "reconvening" &&
        sessionIncludesSpeaker(s, speakerName),
    );
    if (!hasMatch) return [];
    filtered = filtered.filter(
      (s) =>
        s.type !== "break" &&
        s.type !== "reconvening" &&
        sessionIncludesSpeaker(s, speakerName),
    );
  }

  return filtered;
}

type DayBucket = {
  tabId: SpeakerAppearance["tabId"];
  dayLabel: string;
  sessions: Session[];
};

/** Appearances of a speaker across days, still AND type + theme. */
export function findSpeakerAppearances(
  days: DayBucket[],
  speakerName: string,
  type: SessionType | "all",
  theme: ThemeFilterId,
): SpeakerAppearance[] {
  const appearances: SpeakerAppearance[] = [];

  for (const day of days) {
    for (const session of day.sessions) {
      if (session.type === "break" || session.type === "reconvening") continue;
      if (!sessionMatchesType(session, type)) continue;
      if (!sessionMatchesTheme(session, theme)) continue;
      if (!sessionIncludesSpeaker(session, speakerName)) continue;

      appearances.push({
        tabId: day.tabId,
        dayLabel: day.dayLabel,
        time: session.time,
        sessionTitle: session.title,
      });
    }
  }

  return appearances;
}

/** True if this display name exists in the collected speaker list. */
export function speakerExistsInProgramme(
  options: SpeakerOption[],
  speakerName: string,
): boolean {
  const key = normalizeSpeakerName(speakerName);
  return options.some((o) => normalizeSpeakerName(o.name) === key);
}
