export type SessionType =
  | "opening"
  | "plenary"
  | "lightning"
  | "fireside"
  | "reconvening"
  | "concurrent"
  | "special"
  | "closing"
  | "break";

export interface Workshop {
  number: string;
  title: string;
}

export interface Session {
  time: string;
  durationMins?: number;
  type: SessionType;
  title: string;
  speakerCount?: number;
  workshops?: Workshop[];
  breakLabel?: string;
  breakIcon?: "coffee" | "lunch";
  isEvening?: boolean;
}
