import type { ActionWorkshopDayId } from "./action-workshop-listing";
import type { ResearchPresentation, Session } from "./types";

export type ResearchSessionBlock = {
  id: string;
  dayId: ActionWorkshopDayId;
  time: string;
  halls: {id: string; title: string; venue: string; presentations: ResearchPresentation[]}[];
};

export function buildResearchSessionListing(input: {day2: Session[]; day3: Session[]}): ResearchSessionBlock[] {
  return (["day2", "day3"] as const).flatMap((dayId) => input[dayId].flatMap((session, sessionIndex) => {
    if (session.type !== "research") return [];
    const id = `${dayId}-${session.id || `research-${sessionIndex}`}`;
    return [{
      id, dayId, time: session.time,
      halls: (session.workshops ?? []).map((slot, slotIndex) => ({
        id: `${id}-${slot.id || `hall-${slotIndex}`}`,
        title: slot.title,
        venue: slot.venueLine?.trim() || session.venueLine?.trim() || "Venue to be confirmed",
        presentations: slot.presentations ?? [],
      })),
    }];
  }));
}
