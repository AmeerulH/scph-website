/** One-time, keyed migration. Never matches live workshops by title. */
import {isDeepStrictEqual} from "node:util";
type Document = Record<string, unknown>;
type Mapping = {
  _key: string; artworkTitle: string; assetRef: string;
  dayKey?: string; sessionKey?: string; workshopKey?: string; workshopTitle?: string;
  transferPoster?: boolean; archived?: boolean; reason?: string;
};
export type WorkshopMigrationPatch = {
  id: string; revision: string; set: Record<string, unknown>; unset: string[];
};

/** Editor changes outside the reviewed paths are preserved by the fresh read/revision guard. */
export function sameWorkshopMigrationChanges(approved: WorkshopMigrationPatch[], current: WorkshopMigrationPatch[]): boolean {
  if (new Set(approved.map(patch => patch.id)).size !== approved.length || new Set(current.map(patch => patch.id)).size !== current.length) return false;
  // Publishing removes a draft. Its absent variant needs no patch; published targets remain required.
  if (approved.some(patch => !patch.id.startsWith("drafts.") && !current.some(next => next.id === patch.id))) return false;
  return current.every(patch => {
    const reviewed = approved.find(candidate => candidate.id === patch.id);
    return reviewed !== undefined && isDeepStrictEqual(patch.set, reviewed.set) && isDeepStrictEqual(patch.unset, reviewed.unset);
  });
}

function object(value: unknown): Document {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("Expected an object in the CMS snapshot");
  return value as Document;
}
function rows(value: unknown): Document[] {
  if (!Array.isArray(value)) throw new Error("Expected an array in the CMS snapshot");
  return value.map(object);
}
function keyed(value: unknown, key: string): Document {
  const matches = rows(value).filter((row) => row._key === key);
  if (matches.length !== 1) throw new Error(`Missing or duplicate key: ${key}`);
  return matches[0];
}
function selector(key: string): string {
  if (!/^[a-zA-Z0-9_-]+$/.test(key)) throw new Error("Invalid migration key");
  return `[_key==${JSON.stringify(key)}]`;
}
function expectTitle(row: Document, expected: string | undefined, key: string) {
  if (typeof row.title !== "string" || row.title.trim() !== expected) throw new Error(`Title changed; review mapping for ${key}`);
}

export function prepareWorkshopMigration(documents: Document[], mapping: Mapping[]) {
  const preview = structuredClone(documents);
  const patches: WorkshopMigrationPatch[] = [];
  const report: {id: string; transferred: number; pending: string[]; preservedExisting: string[]}[] = [];
  const programmeId = "gtp2026Programme";
  const artworkId = "gtp2026ProgrammeActivityPage-action-workshops";
  const published = preview.find((doc) => doc._id === programmeId);
  const artwork = preview.find((doc) => doc._id === artworkId);
  if (!published || !artwork) throw new Error("Published Programme and artwork documents are required");
  if (new Set(mapping.map((row) => row._key)).size !== mapping.length) throw new Error("Duplicate artwork mapping");
  const targets = mapping.filter((row) => !row.archived).map((row) => row.workshopKey);
  if (new Set(targets).size !== targets.length) throw new Error("Duplicate workshop mapping");

  for (const draft of [false, true]) {
    const prefix = draft ? "drafts." : "";
    const programme = preview.find((doc) => doc._id === prefix + programmeId);
    if (!programme) continue;
    if (programme.workshopArtworkMigrationVersion === 1) continue; // Later editor clears/changes win.
    if (programme.workshopArtworkMigrationVersion !== undefined) throw new Error("Unknown migration version");
    const source = preview.find((doc) => doc._id === prefix + artworkId) ?? artwork;
    const entries = rows(source.entries);
    if (entries.length !== mapping.length || entries.some((entry) => !mapping.some((row) => row._key === entry._key))) {
      throw new Error("Artwork rows changed; review the complete migration mapping");
    }
    const patch: WorkshopMigrationPatch = {id: String(programme._id), revision: String(programme._rev), set: {}, unset: []};
    if (typeof programme._rev !== "string") throw new Error("Programme revision missing");
    const summary = {id: patch.id, transferred: 0, pending: [] as string[], preservedExisting: [] as string[]};
    for (const row of mapping) {
      const entry = keyed(entries, row._key);
      expectTitle(entry, row.artworkTitle, row._key);
      const poster = object(entry.poster);
      if (object(poster.asset)._ref !== row.assetRef) throw new Error(`Artwork changed; review ${row._key}`);
      if (row.archived) continue;
      if (!row.dayKey || !row.sessionKey || !row.workshopKey) throw new Error("Incomplete workshop mapping");
      const day = keyed(programme.days, row.dayKey);
      const session = keyed(day.sessions, row.sessionKey);
      if (session.type !== "concurrent") throw new Error(`Workshop parent category changed: ${row.sessionKey}`);
      const workshop = keyed(session.workshops, row.workshopKey);
      expectTitle(workshop, row.workshopTitle, row.workshopKey);
      const path = `days${selector(row.dayKey)}.sessions${selector(row.sessionKey)}.workshops${selector(row.workshopKey)}`;
      if (workshop.poster !== undefined && workshop.poster !== null) {
        summary.preservedExisting.push(row.workshopKey);
      } else if (row.transferPoster) {
        const image = structuredClone(poster);
        if (typeof image.alt !== "string" || !image.alt.trim() || /^\d+$/.test(image.alt.trim()) || image.alt.trim() === row.artworkTitle) image.alt = `${row.workshopTitle} poster`;
        workshop.poster = image;
        patch.set[`${path}.poster`] = image;
        summary.transferred++;
      } else summary.pending.push(row.workshopTitle!);
      if (!(typeof workshop.objective === "string" && workshop.objective.trim()) && typeof entry.description === "string" && entry.description.trim()) {
        workshop.objective = entry.description.trim();
        patch.set[`${path}.objective`] = workshop.objective;
      }
    }
    const day3Key = "nnQWSTO81w83COfmAOS6GV";
    const day3 = keyed(programme.days, day3Key);
    const reach = keyed(day3.sessions, "696b4f0c831f");
    expectTitle(reach, "REACH - Advancing Research for Climate and Health in Asia", "696b4f0c831f");
    if (reach.type !== "research" && reach.type !== "special") throw new Error("REACH category changed; review before migrating");
    const reachPath = `days${selector(day3Key)}.sessions${selector("696b4f0c831f")}`;
    reach.type = "special";
    patch.set[`${reachPath}.type`] = "special";
    if (!(typeof reach.subpageButtonLabel === "string" && reach.subpageButtonLabel.trim())) {
      reach.subpageButtonLabel = "Register to Join this Session";
      patch.set[`${reachPath}.subpageButtonLabel`] = reach.subpageButtonLabel;
    }
    const workshops = keyed(day3.sessions, "nnQWSTO81w83COfmAOS6Mz");
    const duplicates = rows(workshops.workshops).filter((row) => row._key === "24519529148b");
    if (duplicates.length > 1) throw new Error("Duplicate REACH slot keys");
    if (duplicates.length) {
      expectTitle(duplicates[0], String(reach.title).trim(), "24519529148b");
      patch.unset.push(`days${selector(day3Key)}.sessions${selector("nnQWSTO81w83COfmAOS6Mz")}.workshops${selector("24519529148b")}`);
      workshops.workshops = rows(workshops.workshops).filter((row) => row._key !== "24519529148b");
    }
    programme.workshopArtworkMigrationVersion = 1;
    patch.set.workshopArtworkMigrationVersion = 1;
    patches.push(patch);
    report.push(summary);
  }
  // Guard both artwork revisions in the same transaction as their consumers.
  // Retain every legacy row and asset for recovery; only correct confirmed date metadata.
  if (patches.length) {
    for (const source of preview.filter((doc) => doc._id === artworkId || doc._id === `drafts.${artworkId}`)) {
      if (typeof source._rev !== "string") throw new Error("Artwork revision missing");
      const entry = keyed(source.entries, "action-workshops-10");
      if (entry.dateLabel !== "13 October 2026" && entry.dateLabel !== "14 October 2026") throw new Error("Rethinking artwork date changed; review before migrating");
      entry.dateLabel = "14 October 2026";
      patches.push({id: String(source._id), revision: source._rev, set: {[`entries${selector("action-workshops-10")}.dateLabel`]: entry.dateLabel}, unset: []});
    }
  }
  return {patches, preview, report};
}
