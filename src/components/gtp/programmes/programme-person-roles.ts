import type { ProgrammePersonRole, Speaker } from "./types";
import { sortSpeakersModeratorFirst } from "./programme-speaker-filter";

function uniqueRoles(roles: ProgrammePersonRole[]): ProgrammePersonRole[] {
  const unique: ProgrammePersonRole[] = [];
  for (const role of roles) {
    if (!unique.includes(role)) unique.push(role);
  }
  return unique;
}

/** One row per person. Roles already set on CMS data are kept. */
export function actionWorkshopPeople(source: {
  speakers?: Speaker[];
  facilitators?: Speaker[];
}): Speaker[] {
  const byKey = new Map<string, Speaker>();

  const add = (person: Speaker, fromList: ProgrammePersonRole) => {
    const key = person.name.trim().toLowerCase();
    const incoming = person.roles?.length ? person.roles : [fromList];
    const existing = byKey.get(key);
    if (!existing) {
      byKey.set(key, { ...person, roles: uniqueRoles(incoming) });
      return;
    }
    byKey.set(key, {
      ...existing,
      designation: existing.designation || person.designation,
      imageUrl: existing.imageUrl || person.imageUrl,
      sessionRole: existing.sessionRole || person.sessionRole,
      roles: uniqueRoles([...(existing.roles ?? []), ...incoming]),
    });
  };

  for (const person of source.facilitators ?? []) add(person, "facilitator");
  for (const person of source.speakers ?? []) add(person, "speaker");
  return sortSpeakersModeratorFirst([...byKey.values()]);
}

const GENERIC_ROLE = new Set(["speaker", "speakers", "facilitator", "facilitators"]);

/** "Speaker", "Facilitator", or "Speaker & Facilitator". A written role such as Moderator or "Speaker (Virtual)" is kept as written. */
export function programmePersonRoleLabel(person: Speaker): string {
  const roles = new Set(person.roles ?? []);
  const free = person.sessionRole?.trim() ?? "";
  const freeNorm = free.toLowerCase();
  const writtenSpeaker = freeNorm.startsWith("speaker");
  const writtenFacilitator = freeNorm.startsWith("facilitator");

  if (roles.size === 0) {
    if (writtenFacilitator) roles.add("facilitator");
    else roles.add("speaker");
  }

  const isSpeaker = roles.has("speaker") || writtenSpeaker;
  const isFacilitator = roles.has("facilitator") || writtenFacilitator;

  if (isSpeaker && isFacilitator) {
    if (free && !writtenSpeaker && !writtenFacilitator) return `Speaker & Facilitator · ${free}`;
    return "Speaker & Facilitator";
  }

  if (free && !GENERIC_ROLE.has(freeNorm)) return free;
  if (isFacilitator) return "Facilitator";
  return "Speaker";
}
