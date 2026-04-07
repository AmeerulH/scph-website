import type { Session, SessionType } from "./types";

/** Default map-pin line when CMS `venueLine` is empty. */
export function getSessionVenueLine(session: Session): string {
  const custom = typeof session.venueLine === "string" ? session.venueLine.trim() : "";
  if (custom) return custom;
  if (session.venueType === "online") return "Online — details TBC";
  if (session.venueType === "evening_offsite" || session.isEvening) {
    return "Evening venue TBC";
  }
  return "Venue TBC — Sunway, Malaysia";
}

/** Default “Format: …” copy in the session modal when CMS `formatLabel` is empty. */
export function getSessionFormatLabel(session: Session): string {
  const custom = typeof session.formatLabel === "string" ? session.formatLabel.trim() : "";
  if (custom) return custom;
  return defaultFormatLabelForType(session.type);
}

function defaultFormatLabelForType(type: SessionType): string {
  if (type === "plenary" || type === "opening" || type === "closing") return "Public Session";
  if (type === "concurrent") return "Action workshop";
  if (type === "research") return "Research session";
  if (type === "fireside") return "Fireside Chat";
  if (type === "lightning") return "Lightning Talk";
  if (type === "special") return "Special Event";
  if (type === "break") return "Break";
  if (type === "reconvening") return "Reconvening";
  return "Conference Session";
}
