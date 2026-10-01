import type { GtpProgrammeActivityEntry } from "@/data/gtp-programme-activity-defaults";
import type { GtpProgrammeCalendarDayTab } from "@/lib/gtp-programme-google-calendar";
import type { Session, Workshop } from "./types";

export type ActionWorkshopDayId = Extract<GtpProgrammeCalendarDayTab, "day2" | "day3">;

export type ActionWorkshopListingItem = {
  title: string;
  dateLabel: string;
  posterUrl?: string;
  posterAlt?: string;
  workshop: Workshop;
  parent: Session;
  dayLabel: string;
  calendarTabId: ActionWorkshopDayId;
};

const DATE_LABEL: Record<ActionWorkshopDayId, string> = {
  day2: "13 October 2026",
  day3: "14 October 2026",
};

/** Match programme titles to Action Workshop page rows despite punctuation and simple plurals. */
export function normalizeActionWorkshopTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/workshop session:\s*/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ")
    .split(" ")
    .map((word) => (word.length > 4 && word.endsWith("s") ? word.slice(0, -1) : word))
    .join(" ");
}

function dayForEntry(dateLabel: string | undefined): ActionWorkshopDayId {
  return dateLabel?.includes("14") ? "day3" : "day2";
}

function withObjective(workshop: Workshop, description: string | undefined): Workshop {
  if (workshop.objective?.trim() || !description?.trim()) return workshop;
  return { ...workshop, objective: description.trim() };
}

/**
 * Programme concurrent sessions are the source of truth for titles, times, and people.
 * The activity page contributes posters and a description when the programme objective is empty.
 * Activity rows with no programme match stay on the page so published posters are not dropped.
 */
export function buildActionWorkshopListing(input: {
  entries: GtpProgrammeActivityEntry[];
  day2: Session[];
  day3: Session[];
}): ActionWorkshopListingItem[] {
  const used = new Set<GtpProgrammeActivityEntry>();
  const grouped: Record<ActionWorkshopDayId, ActionWorkshopListingItem[]> = {
    day2: [],
    day3: [],
  };

  const days: { id: ActionWorkshopDayId; sessions: Session[] }[] = [
    { id: "day2", sessions: input.day2 },
    { id: "day3", sessions: input.day3 },
  ];

  for (const day of days) {
    for (const session of day.sessions) {
      if (session.type !== "concurrent") continue;
      for (const workshop of session.workshops ?? []) {
        const key = normalizeActionWorkshopTitle(workshop.title);
        const entry = input.entries.find(
          (candidate) =>
            !used.has(candidate) &&
            normalizeActionWorkshopTitle(candidate.title) === key,
        );
        if (entry) used.add(entry);
        const dateLabel = DATE_LABEL[day.id];
        grouped[day.id].push({
          title: workshop.title.trim(),
          dateLabel,
          posterUrl: entry?.posterUrl,
          posterAlt: entry?.posterAlt,
          workshop: withObjective(workshop, entry?.description),
          parent: session,
          dayLabel: dateLabel,
          calendarTabId: day.id,
        });
      }
    }
  }

  for (const entry of input.entries) {
    if (used.has(entry) || !entry.title.trim()) continue;
    const dayId = dayForEntry(entry.dateLabel);
    const dateLabel = entry.dateLabel?.trim() || DATE_LABEL[dayId];
    grouped[dayId].push({
      title: entry.title.trim(),
      dateLabel,
      posterUrl: entry.posterUrl,
      posterAlt: entry.posterAlt,
      workshop: {
        number: "",
        title: entry.title.trim(),
        objective: entry.description?.trim() || undefined,
      },
      parent: {
        time: "Time to be confirmed",
        type: "concurrent",
        title: "Action Workshops",
        venueLine: "Sunway University",
      },
      dayLabel: dateLabel,
      calendarTabId: dayId,
    });
  }

  return [...grouped.day2, ...grouped.day3];
}
