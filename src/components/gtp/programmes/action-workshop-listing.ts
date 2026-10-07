import type { GtpProgrammeCalendarDayTab } from "@/lib/gtp-programme-google-calendar";
import type { Session, Workshop } from "./types";

export type ActionWorkshopDayId = Extract<GtpProgrammeCalendarDayTab, "day2" | "day3">;

export type ActionWorkshopListingItem = {
  id: string;
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

/** Preserve existing title-based deep links despite punctuation and simple plurals. */
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

/** Programme slots own the complete workshop record, including artwork. */
export function buildActionWorkshopListing(input: {
  day2: Session[];
  day3: Session[];
}): ActionWorkshopListingItem[] {
  const items: ActionWorkshopListingItem[] = [];
  const days: {id: ActionWorkshopDayId; sessions: Session[]}[] = [
    {id: "day2", sessions: input.day2},
    {id: "day3", sessions: input.day3},
  ];
  for (const day of days) {
    day.sessions.forEach((session, sessionIndex) => {
      if (session.type !== "concurrent") return;
      (session.workshops ?? []).forEach((workshop, workshopIndex) => {
        const dateLabel = DATE_LABEL[day.id];
        items.push({
          id: `${day.id}-${session.id || sessionIndex}-${workshop.id || workshopIndex}`,
          title: workshop.title.trim(),
          dateLabel,
          posterUrl: workshop.posterUrl,
          posterAlt: workshop.posterAlt,
          workshop,
          parent: session,
          dayLabel: dateLabel,
          calendarTabId: day.id,
        });
      });
    });
  }
  return items;
}
