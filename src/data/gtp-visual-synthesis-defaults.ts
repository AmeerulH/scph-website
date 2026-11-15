/**
 * Code defaults for /events/gtp-2026/media/visual-synthesis. Studio fields win per field when
 * populated; these only fill gaps. Copy comes from the contributor's email (credit line, role, bio)
 * with the team's agreed edits. No artwork is bundled: maps only appear once the team uploads them.
 */

export type GtpSynthesisDayId = "1" | "2" | "3" | "4" | "final";

export type GtpSynthesisDay = {
  id: GtpSynthesisDayId;
  label: string;
  dateLabel: string;
};

export type GtpSynthesisImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

export type GtpSynthesisMap = {
  id: string;
  day: GtpSynthesisDayId;
  title: string;
  timeLabel?: string;
  summary?: string;
  image: GtpSynthesisImage;
};

export type GtpSynthesisLink = { label: string; url: string };

export type GtpSynthesisContributor = {
  name: string;
  role: string;
  bio: string[];
  headshot?: GtpSynthesisImage;
  links: GtpSynthesisLink[];
};

export type GtpVisualSynthesisResolved = {
  title: string;
  intro: string[];
  liveNote?: string;
  credit: { text: string; bigPictureUrl?: string };
  contributor: GtpSynthesisContributor;
  maps: GtpSynthesisMap[];
  afterConference: boolean;
};

export const GTP_SYNTHESIS_DAYS: readonly GtpSynthesisDay[] = [
  { id: "1", label: "Day 1", dateLabel: "12 October 2026" },
  { id: "2", label: "Day 2", dateLabel: "13 October 2026" },
  { id: "3", label: "Day 3", dateLabel: "14 October 2026" },
  { id: "4", label: "Day 4", dateLabel: "15 October 2026" },
  { id: "final", label: "Final synthesis", dateLabel: "All four days" },
];

/** Conference ends 15 October 2026 (Kuala Lumpur). Wording switches to past tense from the next day. */
export const GTP_CONFERENCE_ENDS_AT = Date.parse("2026-10-16T00:00:00+08:00");

/** Emergency path: if Studio is unavailable on the night, add maps here and deploy. Studio wins when populated. */
export const GTP_SYNTHESIS_FALLBACK_MAPS: GtpSynthesisMap[] = [];

export const GTP_VISUAL_SYNTHESIS_PATH = "/events/gtp-2026/media/visual-synthesis";

const INTRO_DURING =
  "Visual Synthesis is a visual mapping of the plenaries at the Global Tipping Points Conference 2026. Across the four days, the core content of the plenaries is synthesised into visual maps that help the conference participant gain clarity on the larger context emerging.";

const INTRO_AFTER =
  "Visual Synthesis is a visual mapping of the plenaries at the Global Tipping Points Conference 2026. Across the four days, the core content of the plenaries was synthesised into visual maps that helped the conference participant gain clarity on the larger context emerging.";

export const GTP_VISUAL_SYNTHESIS_DEFAULTS = {
  title: "Visual Synthesis",
  introDuring: [INTRO_DURING],
  introAfter: [INTRO_AFTER],
  liveNote:
    "New syntheses are posted here and updated through the days, so you can follow the conversation as it takes shape.",
  creditLine:
    "Created by Ole Qvist-Sørensen, co-founder of Bigger Picture and co-author of Visual Collaboration (Wiley, 2019), serving as co-facilitator and visual sense-maker at GTP 2026.",
  contributor: {
    name: "Ole Qvist-Sørensen",
    role: "Co-facilitator and Visual Sense-Maker, Bigger Picture",
    bio: [
      "Ole Qvist-Sørensen is co-founder of Bigger Picture, a Copenhagen-based strategy and design practice, and co-author of Visual Collaboration (Wiley, 2019). Over more than thirty years he has helped organisations across climate, nature and social change make sense of complexity through visual facilitation and systems mapping. For organisations such as UN, Gates Foundation, and WWF.",
      "At GTP 2026 he works as co-facilitator and visual sense-maker. His role is to listen across the plenaries and help the system see itself: catching the core messages, metaphors and stories as they emerge, and by engaging the participants creating a shared visual language and a set of visual maps that help participants hold the whole conference conversation. A room understands more when it can see what it is thinking together.",
    ],
    links: [
      { label: "Bigger Picture", url: "https://biggerpicture.dk" },
      {
        label: "LinkedIn",
        url: "https://www.linkedin.com/in/ole-qvist-s%C3%B8rensen-18b39/",
      },
    ] as GtpSynthesisLink[],
  },
} as const;
