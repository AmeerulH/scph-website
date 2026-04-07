import {
  Coffee,
  Layers,
  Zap,
  MessageSquare,
  RefreshCw,
  Star,
  Film,
  Users,
  BookOpen,
} from "lucide-react";
import type { Session, SessionType } from "./types";
import {
  agendaObjectiveForSessionTitle,
  GTP_AGENDA_TITLE_OPENING_PLENARY_SCIENCE,
} from "@/data/gtp-2026-agenda-objectives";

// ─── Tab configuration ────────────────────────────────────────────────────────

export const TABS = [
  { id: "pre", label: "Pre-Conference" },
  { id: "day1", label: "Day 1 · 12 Oct" },
  { id: "day2", label: "Day 2 · 13 Oct" },
  { id: "day3", label: "Day 3 · 14 Oct" },
  { id: "day4", label: "Day 4 · 15 Oct" },
] as const;

export type TabId = (typeof TABS)[number]["id"];

// ─── Type badge config ────────────────────────────────────────────────────────

export const TYPE_META: Record<
  SessionType,
  { label: string; badgeClass: string; Icon: React.ElementType }
> = {
  opening: {
    label: "Opening",
    badgeClass: "bg-gtp-dark-teal/10 text-gtp-dark-teal",
    Icon: Star,
  },
  plenary: {
    label: "Plenary",
    badgeClass: "bg-gtp-teal/15 text-gtp-teal-dark",
    Icon: Layers,
  },
  lightning: {
    label: "Lightning Talk",
    badgeClass: "bg-gtp-orange/10 text-gtp-orange",
    Icon: Zap,
  },
  fireside: {
    label: "Fireside Chat",
    badgeClass: "bg-gtp-green/15 text-gtp-dark-green",
    Icon: MessageSquare,
  },
  reconvening: {
    label: "Reconvening",
    badgeClass: "bg-gray-100 text-gray-500",
    Icon: RefreshCw,
  },
  concurrent: {
    label: "Action Workshops",
    badgeClass: "bg-gtp-teal/10 text-gtp-dark-teal",
    Icon: Users,
  },
  research: {
    label: "Research Sessions",
    badgeClass: "bg-gtp-orange/10 text-gtp-orange",
    Icon: BookOpen,
  },
  special: {
    label: "Special Event",
    badgeClass: "bg-gtp-green/10 text-gtp-dark-green",
    Icon: Film,
  },
  closing: {
    label: "Closing",
    badgeClass: "bg-gtp-dark-teal/10 text-gtp-dark-teal",
    Icon: Star,
  },
  break: {
    label: "Break",
    badgeClass: "bg-gray-100 text-gray-400",
    Icon: Coffee,
  },
};

// ─── Type-specific gradient banners (shared with modal & carousel) ────────────

export const TYPE_GRADIENTS: Record<string, string> = {
  opening: "from-[#0D4D5E] via-[#009CB4] to-[#0D4D5E]",
  plenary: "from-[#009CB4] via-[#0D4D5E] to-[#007d90]",
  lightning: "from-[#DB5D00] via-[#0D4D5E] to-[#009CB4]",
  fireside: "from-[#5C8119] via-[#0D4D5E] to-[#009CB4]",
  concurrent: "from-[#009CB4] via-[#0D4D5E] to-[#5C8119]",
  research: "from-[#DB5D00] via-[#0D4D5E] to-[#009CB4]",
  special: "from-[#86BC25] via-[#0D4D5E] to-[#009CB4]",
  closing: "from-[#0D4D5E] via-[#007d90] to-[#009CB4]",
  reconvening: "from-[#4b6070] via-[#2d4450] to-[#0D4D5E]",
  break: "from-[#6b7280] via-[#4b5563] to-[#374151]",
};

// ─── Agenda Data ──────────────────────────────────────────────────────────────
// Speaker line-ups are tentative; names are not shown until confirmed (speakerCount + TBC UI).
// `objective` is shown on the programme page and is pushed to Sanity via `npm run import-gtp-programme`.

/** Open workshop slots — replace when proposals are selected. */
const OBJ_TBC_PROPOSAL =
  "TBC — session details to be confirmed from the open call for proposals.";
/** Open research slots — replace when abstracts are selected. */
const OBJ_TBC_ABSTRACT =
  "TBC — session details to be confirmed from the open abstract process.";

export const day1: Session[] = [
  {
    time: "09:00 – 09:30",
    durationMins: 30,
    type: "opening",
    title: "Opening of Global Tipping Points Conference 2026",
    theme: "shift",
    objective: agendaObjectiveForSessionTitle(
      "Opening of Global Tipping Points Conference 2026",
    ),
  },
  {
    time: "09:30 – 11:00",
    durationMins: 90,
    type: "plenary",
    title: GTP_AGENDA_TITLE_OPENING_PLENARY_SCIENCE,
    speakerCount: 4,
    theme: "shift",
    objective: agendaObjectiveForSessionTitle(GTP_AGENDA_TITLE_OPENING_PLENARY_SCIENCE),
  },
  {
    time: "11:00 – 11:30",
    durationMins: 30,
    type: "break",
    title: "Coffee Break",
    breakLabel: "Coffee Break",
    breakIcon: "coffee",
  },
  {
    time: "11:30 – 11:40",
    durationMins: 10,
    type: "lightning",
    title: "Lightning Talk: Frontline Realities of Tipping Points in Malaysia",
    speakerCount: 1,
    theme: "shift",
    objective: agendaObjectiveForSessionTitle(
      "Lightning Talk: Frontline Realities of Tipping Points in Malaysia",
    ),
  },
  {
    time: "11:40 – 12:40",
    durationMins: 60,
    type: "plenary",
    title: "Plenary 2: Global Context and ASEAN Pathways",
    speakerCount: 4,
    theme: "shift",
    objective: agendaObjectiveForSessionTitle(
      "Plenary 2: Global Context and ASEAN Pathways",
    ),
  },
  {
    time: "12:40 – 14:00",
    durationMins: 80,
    type: "break",
    title: "Lunch",
    breakLabel: "Lunch",
    breakIcon: "lunch",
  },
  {
    time: "14:00 – 15:30",
    durationMins: 90,
    type: "concurrent",
    title: "Action Workshops",
    theme: "action",
    objective: agendaObjectiveForSessionTitle("Action Workshops"),
    workshops: [
      {
        number: "1",
        title: "Workshop Session: Regional Perspectives Deep Dive",
        objective:
          "Compare regional narratives and priorities on tipping points and how they translate into policy and on-the-ground action.",
      },
      {
        number: "2",
        title: "Workshop Session: Storytelling and Public Relations",
        objective:
          "Develop narrative and communications approaches that make tipping points tangible for diverse public audiences.",
      },
      {
        number: "3",
        title: "Workshop Session: Disinformation and Trust",
        objective:
          "Unpack how misinformation and eroded trust slow transitions, and explore responses that support credible engagement.",
      },
      {
        number: "4",
        title: "Workshop Session: Education and Systems Change",
        objective:
          "Link education and learning systems to the capabilities and mindsets needed for systemic shifts.",
      },
      {
        number: "5",
        title: "Workshop Session: Co-creating Futures",
        objective:
          "Use participatory methods to imagine preferable futures and concrete steps that could tip systems positively.",
      },
      {
        number: "6",
        title: "Workshop Session: The Air We Breathe",
        objective:
          "Connect air quality, public health, and environmental tipping dynamics—especially in urban and regional contexts.",
      },
      {
        number: "7",
        title: "Workshop Session: Tipping Points and the Coral Triangle",
        objective:
          "Focus on marine ecosystems, livelihoods, and governance in the Coral Triangle through a tipping-points lens.",
      },
      {
        number: "8",
        title: "Workshop Session: [Title – Topic from Open Proposals]",
        objective: OBJ_TBC_PROPOSAL,
      },
      {
        number: "9",
        title: "Workshop Session: [Title – Topic from Open Proposals]",
        objective: OBJ_TBC_PROPOSAL,
      },
      {
        number: "10",
        title: "Workshop Session: [Title – Topic from Open Proposals]",
        objective: OBJ_TBC_PROPOSAL,
      },
    ],
  },
  {
    time: "14:00 – 15:30",
    durationMins: 90,
    type: "research",
    title: "Research Sessions",
    theme: "action",
    objective: agendaObjectiveForSessionTitle("Research Sessions"),
    workshops: [
      {
        number: "11",
        title: "Research Session: [Title – Topic from Open Abstract Calls]",
        objective: OBJ_TBC_ABSTRACT,
      },
      {
        number: "12",
        title: "Research Session: [Title – Topic from Open Abstract Calls]",
        objective: OBJ_TBC_ABSTRACT,
      },
    ],
  },
  {
    time: "15:30 – 16:00",
    durationMins: 30,
    type: "break",
    title: "Coffee Break",
    breakLabel: "Coffee Break",
    breakIcon: "coffee",
  },
  {
    time: "16:00 – 16:30",
    durationMins: 30,
    type: "fireside",
    title: "Fireside Chat: [Insert Topic]",
    speakerCount: 1,
    theme: "imagination",
    objective: agendaObjectiveForSessionTitle("Fireside Chat: [Insert Topic]"),
  },
  {
    time: "16:30 – 17:00",
    durationMins: 30,
    type: "reconvening",
    title: "Reconvening",
    objective: agendaObjectiveForSessionTitle("Reconvening"),
  },
  {
    time: "Evening",
    type: "special",
    title: "Film Premiere: How to Live on Earth by Open Planet Studios",
    isEvening: true,
    theme: "imagination",
    objective: agendaObjectiveForSessionTitle(
      "Film Premiere: How to Live on Earth by Open Planet Studios",
    ),
  },
];

export const day2: Session[] = [
  {
    time: "09:00 – 09:10",
    durationMins: 10,
    type: "lightning",
    title: "Lightning Talk: Who Really Pays for Environmental Damage?",
    speakerCount: 1,
    theme: "shift",
    objective: agendaObjectiveForSessionTitle(
      "Lightning Talk: Who Really Pays for Environmental Damage?",
    ),
  },
  {
    time: "09:10 – 10:40",
    durationMins: 90,
    type: "plenary",
    title: "Plenary 3: Flipping the Script",
    speakerCount: 4,
    theme: "imagination",
    objective: agendaObjectiveForSessionTitle("Plenary 3: Flipping the Script"),
  },
  {
    time: "10:40 – 11:10",
    durationMins: 30,
    type: "break",
    title: "Coffee Break",
    breakLabel: "Coffee Break",
    breakIcon: "coffee",
  },
  {
    time: "11:10 – 12:40",
    durationMins: 90,
    type: "plenary",
    title: "Plenary 4: Values and Cultural Tipping Points",
    speakerCount: 4,
    theme: "imagination",
    objective: agendaObjectiveForSessionTitle(
      "Plenary 4: Values and Cultural Tipping Points",
    ),
  },
  {
    time: "12:40 – 14:00",
    durationMins: 80,
    type: "break",
    title: "Lunch",
    breakLabel: "Lunch",
    breakIcon: "lunch",
  },
  {
    time: "14:00 – 15:30",
    durationMins: 90,
    type: "concurrent",
    title: "Action Workshops",
    theme: "action",
    objective: agendaObjectiveForSessionTitle("Action Workshops"),
    workshops: [
      {
        number: "1",
        title: "Workshop Session: Legal Frameworks and Litigation",
        objective:
          "Review how law, rights, and litigation can accelerate or constrain tipping dynamics in climate and nature.",
      },
      {
        number: "2",
        title:
          "Workshop Session: Return on Values (ROV) – Doing Business Differently, Session One",
        objective:
          "Introduce Return on Values framing and practical implications for leadership and business model change.",
      },
      {
        number: "3",
        title: "Workshop Session: Islamic and Innovative Responsible Finance",
        objective:
          "Explore responsible finance—including Islamic finance lenses—to align capital with positive tipping trajectories.",
      },
      {
        number: "4",
        title: "Workshop Session: Health Leadership in Times of Instability",
        objective:
          "Connect planetary health, system shocks, and leadership under uncertainty to tipping-point responses.",
      },
      {
        number: "5",
        title: "Workshop Session: Faith Charter and Toolkit",
        objective:
          "Discuss faith-based commitments and tools that mobilise communities for environmental stewardship and justice.",
      },
      {
        number: "6",
        title: "Workshop Session: [Title – Topic from Open Proposals]",
        objective: OBJ_TBC_PROPOSAL,
      },
      {
        number: "7",
        title: "Workshop Session: [Title – Topic from Open Proposals]",
        objective: OBJ_TBC_PROPOSAL,
      },
      {
        number: "8",
        title: "Workshop Session: [Title – Topic from Open Proposals]",
        objective: OBJ_TBC_PROPOSAL,
      },
      {
        number: "9",
        title: "Workshop Session: [Title – Topic from Open Proposals]",
        objective: OBJ_TBC_PROPOSAL,
      },
      {
        number: "10",
        title: "Workshop Session: [Title – Topic from Open Proposals]",
        objective: OBJ_TBC_PROPOSAL,
      },
    ],
  },
  {
    time: "14:00 – 15:30",
    durationMins: 90,
    type: "research",
    title: "Research Sessions",
    theme: "action",
    objective: agendaObjectiveForSessionTitle("Research Sessions"),
    workshops: [
      {
        number: "11",
        title: "Research Session: [Title – Topic from Open Abstract Calls]",
        objective: OBJ_TBC_ABSTRACT,
      },
      {
        number: "12",
        title: "Research Session: [Title – Topic from Open Abstract Calls]",
        objective: OBJ_TBC_ABSTRACT,
      },
    ],
  },
  {
    time: "15:30 – 16:00",
    durationMins: 30,
    type: "break",
    title: "Coffee Break",
    breakLabel: "Coffee Break",
    breakIcon: "coffee",
  },
  {
    time: "16:00 – 16:30",
    durationMins: 30,
    type: "fireside",
    title: "Fireside Chat: Leadership That Tips Energy Systems",
    speakerCount: 1,
    theme: "imagination",
    objective: agendaObjectiveForSessionTitle(
      "Fireside Chat: Leadership That Tips Energy Systems",
    ),
  },
  {
    time: "16:30 – 17:00",
    durationMins: 30,
    type: "reconvening",
    title: "Reconvening",
    objective: agendaObjectiveForSessionTitle("Reconvening"),
  },
  {
    time: "17:00 – 18:00",
    durationMins: 60,
    type: "special",
    title: "Poster Exhibit",
    theme: "action",
    objective: agendaObjectiveForSessionTitle("Poster Exhibit"),
  },
  {
    time: "19:00",
    type: "special",
    title: "Street Food Dinner",
    isEvening: true,
    theme: "imagination",
    objective: agendaObjectiveForSessionTitle("Street Food Dinner"),
  },
];

export const day3: Session[] = [
  {
    time: "09:00 – 10:00",
    durationMins: 60,
    type: "plenary",
    title: "Plenary 5: Finance for Positive Tipping Points",
    speakerCount: 4,
    theme: "action",
    objective: agendaObjectiveForSessionTitle(
      "Plenary 5: Finance for Positive Tipping Points",
    ),
  },
  {
    time: "10:00 – 11:30",
    durationMins: 90,
    type: "plenary",
    title: "Plenary 6: From Courtrooms to System Change",
    speakerCount: 4,
    theme: "shift",
    objective: agendaObjectiveForSessionTitle(
      "Plenary 6: From Courtrooms to System Change",
    ),
  },
  {
    time: "11:30 – 12:00",
    durationMins: 30,
    type: "break",
    title: "Coffee Break",
    breakLabel: "Coffee Break",
    breakIcon: "coffee",
  },
  {
    time: "12:00 – 13:00",
    durationMins: 60,
    type: "plenary",
    title: "Plenary 7: Change is Possible – Cities as Tipping Points",
    speakerCount: 4,
    theme: "action",
    objective: agendaObjectiveForSessionTitle(
      "Plenary 7: Change is Possible – Cities as Tipping Points",
    ),
  },
  {
    time: "13:00 – 14:00",
    durationMins: 60,
    type: "break",
    title: "Lunch",
    breakLabel: "Lunch",
    breakIcon: "lunch",
  },
  {
    time: "14:00 – 15:30",
    durationMins: 90,
    type: "concurrent",
    title: "Action Workshops",
    theme: "action",
    objective: agendaObjectiveForSessionTitle("Action Workshops"),
    workshops: [
      {
        number: "1",
        title: "Workshop Session: AI and Technology for Systems Transition",
        objective:
          "Discuss responsible use of AI and digital tools to monitor, model, and accelerate system transitions.",
      },
      {
        number: "2",
        title: "Workshop Session: Nature-Based Solutions at Scale",
        objective:
          "Examine how NbS can reach scale, with safeguards, finance, and metrics that align with tipping thinking.",
      },
      {
        number: "3",
        title: "Workshop Session: Food Systems and Tipping Dynamics",
        objective:
          "Link food security, land use, and diets to leverage points and trade-offs in food system transformation.",
      },
      {
        number: "4",
        title:
          "Workshop Session: Return on Values – Doing Business Differently",
        objective:
          "Continue ROV themes—embedding values into strategy, investment, and operations for systemic outcomes.",
      },
      {
        number: "5",
        title: "Workshop Session: Health Leadership",
        objective:
          "Strengthen leadership bridges between health, climate, and equity agendas under growing instability.",
      },
      {
        number: "6",
        title: "Workshop Session: Education Revolution",
        objective:
          "Explore transformative education models that build agency for a tipping-points century.",
      },
      {
        number: "7",
        title: "Workshop Session: System Shifts or System Shocks",
        objective:
          "Contrast managed transitions with disorderly shocks—and what governance needs to favour the former.",
      },
      {
        number: "8",
        title: "Workshop Session: Cleantech Systems Change",
        objective:
          "Connect clean technology deployment to system integration, policy, and tipping dynamics.",
      },
      {
        number: "9",
        title: "Workshop Session: [Title – Topic from Open Proposals]",
        objective: OBJ_TBC_PROPOSAL,
      },
      {
        number: "10",
        title: "Workshop Session: [Title – Topic from Open Proposals]",
        objective: OBJ_TBC_PROPOSAL,
      },
    ],
  },
  {
    time: "14:00 – 15:30",
    durationMins: 90,
    type: "research",
    title: "Research Sessions",
    theme: "action",
    objective: agendaObjectiveForSessionTitle("Research Sessions"),
    workshops: [
      {
        number: "11",
        title: "Research Session: [Title – Topic from Open Abstract Calls]",
        objective: OBJ_TBC_ABSTRACT,
      },
      {
        number: "12",
        title: "Research Session: [Title – Topic from Open Abstract Calls]",
        objective: OBJ_TBC_ABSTRACT,
      },
    ],
  },
  {
    time: "15:30 – 16:00",
    durationMins: 30,
    type: "break",
    title: "Coffee Break",
    breakLabel: "Coffee Break",
    breakIcon: "coffee",
  },
  {
    time: "16:00 – 16:30",
    durationMins: 30,
    type: "fireside",
    title: "Fireside Chat: Peace Dividends and Health Security",
    speakerCount: 1,
    theme: "imagination",
    objective: agendaObjectiveForSessionTitle(
      "Fireside Chat: Peace Dividends and Health Security",
    ),
  },
  {
    time: "16:30 – 17:00",
    durationMins: 30,
    type: "reconvening",
    title: "Reconvening",
    objective: agendaObjectiveForSessionTitle("Reconvening"),
  },
];

export const day4: Session[] = [
  {
    time: "09:00 – 10:30",
    durationMins: 90,
    type: "plenary",
    title: "Plenary 8: Bringing It All Together and Road to COP31",
    speakerCount: 4,
    theme: "shift",
    objective: agendaObjectiveForSessionTitle(
      "Plenary 8: Bringing It All Together and Road to COP31",
    ),
  },
  {
    time: "10:30 – 11:00",
    durationMins: 30,
    type: "break",
    title: "Coffee Break",
    breakLabel: "Coffee Break",
    breakIcon: "coffee",
  },
  {
    time: "11:00 – 12:30",
    durationMins: 90,
    type: "closing",
    title:
      "Next Steps and Closing — Launch of the Kuala Lumpur Tipping Points Declaration",
    theme: "action",
    objective: agendaObjectiveForSessionTitle(
      "Next Steps and Closing — Launch of the Kuala Lumpur Tipping Points Declaration",
    ),
  },
  {
    time: "12:30",
    type: "special",
    title: "End of Conference",
    theme: "action",
    objective: agendaObjectiveForSessionTitle("End of Conference"),
  },
];
