export type GtpHighlightSpeaker = {
  name: string;
  role: string;
  organisation: string;
  bio: string;
  session: string;
  sessionDate: string;
  photoSrc?: string;
  /** Tailwind classes for Image fill `className` (e.g. landscape headshots). */
  photoClassName?: string;
  /**
   * Serve the file as-is (no Next resize/WebP). Use when the source is already
   * small or to avoid optimizer upscaling — prefer a **high-res** PNG/JPEG (e.g.
   * ≥900px wide) for sharp cards on retina.
   */
  photoUnoptimized?: boolean;
  /** Optional extra programme slots (rendered in the modal when present). */
  sessions?: { title: string; date: string }[];
};

/**
 * Order and naming per client feedback (April 2026). Titles/roles hidden in UI when
 * `role` and `organisation` are empty. Photos only where assets exist (Tim, Johan,
 * Jemilah, Cornelia); others use initials until headshots are supplied.
 */
export const gtpHighlightSpeakers: GtpHighlightSpeaker[] = [
  {
    name: "Tim Lenton",
    role: "",
    organisation: "",
    bio: "Bio to be provided.",
    session: "Session to be announced",
    sessionDate: "Date & time to be announced",
    photoSrc: "/images/gtp/co-chairs/tim-lenton.jpg",
    photoClassName: "object-cover object-[50%_38%]",
  },
  {
    name: "Johan Rockström",
    role: "",
    organisation: "",
    bio: "Bio to be provided.",
    session: "Session to be announced",
    sessionDate: "Date & time to be announced",
    photoSrc: "/images/gtp/co-chairs/johan-rockstrom.jpg",
    photoClassName: "object-cover object-[50%_22%] scale-[1.15] origin-[50%_28%]",
  },
  {
    name: "Jemilah Mahmood",
    role: "",
    organisation: "",
    bio: "Bio to be provided.",
    session: "Session to be announced",
    sessionDate: "Date & time to be announced",
    photoSrc: "/images/scph/team/professor-tan-sri-dr-jemilah-mahmood.png",
    photoClassName:
      "object-cover object-[50%_22%] scale-[1.48] origin-[50%_6%]",
  },
  {
    name: "Jeffrey Sachs",
    role: "",
    organisation: "",
    bio: "Bio to be provided.",
    session: "Session to be announced",
    sessionDate: "Date & time to be announced",
  },
  {
    name: "Astanah Abdul Aziz",
    role: "",
    organisation: "",
    bio: "Bio to be provided.",
    session: "Session to be announced",
    sessionDate: "Date & time to be announced",
  },
  {
    name: "Kirsten Dunlop",
    role: "",
    organisation: "",
    bio: "Bio to be provided.",
    session: "Session to be announced",
    sessionDate: "Date & time to be announced",
  },
  {
    name: "Cornelia Walther",
    role: "",
    organisation: "",
    bio: "Bio to be provided.",
    session: "Session to be announced",
    sessionDate: "Date & time to be announced",
    /** Current asset is 320×213 — replace with a larger export when available. */
    photoSrc: "/images/gtp/speakers/cornelia-walther.png",
    photoClassName:
      "object-cover object-[50%_35%] [image-rendering:high-quality]",
    photoUnoptimized: true,
  },
  {
    name: "Shweta Narayan",
    role: "",
    organisation: "",
    bio: "Bio to be provided.",
    session: "Session to be announced",
    sessionDate: "Date & time to be announced",
  },
];
