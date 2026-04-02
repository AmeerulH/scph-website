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

export interface Speaker {
  name: string;
  designation?: string;
}

export interface Workshop {
  number: string;
  title: string;
}

export interface Session {
  time: string;
  durationMins?: number;
  type: SessionType;
  title: string;
  /** Named speakers — when present, rendered instead of generic placeholders */
  speakers?: Speaker[];
  /** Fallback when speaker names aren't confirmed yet */
  speakerCount?: number;
  workshops?: Workshop[];
  breakLabel?: string;
  breakIcon?: "coffee" | "lunch";
  isEvening?: boolean;
}
