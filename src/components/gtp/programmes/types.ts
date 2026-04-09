/** Three conference pathways — used for programme theme filters */
export type ConferenceThemeId = "shift" | "imagination" | "action";

export type SessionType =
  | "opening"
  | "plenary"
  | "lightning"
  | "fireside"
  | "reconvening"
  | "concurrent"
  | "research"
  | "special"
  | "closing"
  | "break";

/** Mirrors Sanity `programmeSession.venueType` — optional metadata for editors; `venueLine` drives public copy. */
export type ProgrammeVenueType =
  | "main"
  | "evening_offsite"
  | "online"
  | "breakout"
  | "multiple"
  | "tbc"
  | "other";

export interface Speaker {
  name: string;
  designation?: string;
  /** Resolved Sanity asset URL when editors upload a photo */
  imageUrl?: string;
  /** Shown on cards/modal (e.g. Moderator, Panelist) */
  sessionRole?: string;
}

export interface Workshop {
  number: string;
  title: string;
  objective?: string;
}

export interface Session {
  time: string;
  durationMins?: number;
  type: SessionType;
  title: string;
  /** Session-level objective (CMS). Parallel slots may use `workshops[].objective` instead or as well. */
  objective?: string;
  /** Named speakers — when present, rendered instead of generic placeholders */
  speakers?: Speaker[];
  /** Fallback when speaker names aren't confirmed yet */
  speakerCount?: number;
  /** Conference pathway — theme filter on the programme page */
  theme?: ConferenceThemeId;
  workshops?: Workshop[];
  breakLabel?: string;
  breakIcon?: "coffee" | "lunch";
  isEvening?: boolean;
  /** CMS: categorisation for venue (optional). */
  venueType?: ProgrammeVenueType;
  /** CMS: exact map-pin / modal venue text; when empty, site uses defaults. */
  venueLine?: string;
  /** CMS: modal “Format:” text; when empty, site derives from session type. */
  formatLabel?: string;
}
