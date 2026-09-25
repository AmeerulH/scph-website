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

/** Set on a session or workshop when that popup is not hosted by the programme default. */
export interface ProgrammeHostedByOverride {
  name?: string;
  location?: string;
  showLocation?: boolean;
  logoUrl?: string;
  logoAlt?: string;
  logoWidth?: number;
  logoHeight?: number;
}

export interface Workshop {
  number: string;
  title: string;
  objective?: string;
  speakers?: Speaker[];
  /** Separate popup list. Also filled from speaker rows whose role is Facilitator. */
  facilitators?: Speaker[];
  /** When set, replaces the programme-level Hosted by block in this popup. */
  hostedBy?: ProgrammeHostedByOverride;
  speakerCount?: number;
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
  /** Popup list. Empty lists render a “To be confirmed” card. */
  facilitators?: Speaker[];
  /** When set, replaces the programme-level Hosted by block in this popup. */
  hostedBy?: ProgrammeHostedByOverride;
  /** Fallback when speaker names aren't confirmed yet */
  speakerCount?: number;
  /** Conference pathway — theme filter on the programme page */
  theme?: ConferenceThemeId;
  workshops?: Workshop[];
  breakLabel?: string;
  breakIcon?: "coffee" | "lunch";
  /** Temp: concurrent workshop notice for team review (Day 2 & 3 coffee breaks) */
  workshopNote?: string;
  isEvening?: boolean;
  /** CMS: categorisation for venue (optional). */
  venueType?: ProgrammeVenueType;
  /** CMS: exact map-pin / modal venue text; when empty, site uses defaults. */
  venueLine?: string;
  /** CMS: modal “Format:” text; when empty, site derives from session type. */
  formatLabel?: string;
  /** What's On carousel: resolved image URL (Sanity CDN or local `/public` path). */
  carouselBackgroundImageUrl?: string;
  /** What's On carousel: alt when a background image is shown. */
  carouselBackgroundImageAlt?: string;
}
