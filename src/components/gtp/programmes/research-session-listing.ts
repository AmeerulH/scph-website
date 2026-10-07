import type { ActionWorkshopDayId } from "./action-workshop-listing";
import type { ResearchPresentation, Session, Workshop } from "./types";

export type ResearchSessionBlock = {
  id: string;
  dayId: ActionWorkshopDayId;
  time: string;
  halls: {id: string; title: string; venue: string; presentations: ResearchPresentation[]}[];
};

function researchPresentations(slot: Workshop): ResearchPresentation[] {
  if (slot.presentations?.length) return slot.presentations;
  // Existing Programme entries store the paper title on the slot and presenters in Speakers.
  const presenters = new Map<string, {name: string; imageUrl?: string}>();
  for (const person of slot.speakers ?? []) {
    const name = person.name.trim();
    if (!name) continue;
    const key = name.toLowerCase();
    const existing = presenters.get(key);
    presenters.set(key, {
      name: existing?.name || name,
      ...(existing?.imageUrl || person.imageUrl ? {imageUrl: existing?.imageUrl || person.imageUrl} : {}),
    });
  }
  const presentationTitle = slot.title.trim();
  if (!presenters.size || !presentationTitle) return [];
  return [{
    id: `${slot.id || "legacy"}-presentation`,
    presenterName: [...presenters.values()].map(person => person.name).join(", "),
    presentationTitle,
    presenters: [...presenters.values()],
  }];
}

function researchSessionGroups(session: Session, id: string): ResearchSessionBlock["halls"] {
  const halls: ResearchSessionBlock["halls"] = [];
  const legacyGroups = new Map<string, ResearchSessionBlock["halls"][number]>();
  for (const [slotIndex, slot] of (session.workshops ?? []).entries()) {
    const venue = slot.venueLine?.trim() || session.venueLine?.trim() || "Venue to be confirmed";
    const presentations = researchPresentations(slot);
    const isLegacyPaper = !slot.presentations?.length && presentations.length > 0;
    const venueKey = venue.replace(/\s+/g, " ").toLowerCase();
    const existing = isLegacyPaper ? legacyGroups.get(venueKey) : undefined;
    if (existing) {
      existing.presentations.push(...presentations);
      continue;
    }
    const numberedTitle = (isLegacyPaper ? venue : slot.title).trim().match(/^(?:hall|session)\s+(\d+)$/i);
    const isUnassigned = isLegacyPaper && /^(?:venue to be confirmed|to be confirmed|tbc)$/i.test(venue);
    const group = {
      id: `${id}-${slot.id || `hall-${slotIndex}`}`,
      title: isUnassigned ? "Session to be confirmed" : `Session ${numberedTitle?.[1] || halls.filter((hall) => hall.title !== "Session to be confirmed").length + 1}`,
      venue,
      presentations: [...presentations],
    };
    halls.push(group);
    // Legacy slots are individual papers; their published venue defines the shared session table.
    if (isLegacyPaper) legacyGroups.set(venueKey, group);
  }
  return halls;
}

export function buildResearchSessionListing(input: {day2: Session[]; day3: Session[]}): ResearchSessionBlock[] {
  return (["day2", "day3"] as const).flatMap((dayId) => input[dayId].flatMap((session, sessionIndex) => {
    if (session.type !== "research") return [];
    const id = `${dayId}-${session.id || `research-${sessionIndex}`}`;
    return [{
      id, dayId, time: session.time,
      halls: researchSessionGroups(session, id),
    }];
  }));
}
