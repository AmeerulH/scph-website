import {
  Coffee,
  Layers,
  Zap,
  MessageSquare,
  RefreshCw,
  Star,
  Film,
  Users,
} from "lucide-react";
import type { Session, SessionType } from "./types";

// ─── Tab configuration ────────────────────────────────────────────────────────

export const TABS = [
  { id: "pre",  label: "Pre-Conference" },
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
  opening:     { label: "Opening",              badgeClass: "bg-gtp-dark-teal/10 text-gtp-dark-teal", Icon: Star },
  plenary:     { label: "Plenary",              badgeClass: "bg-gtp-teal/15 text-gtp-teal-dark",      Icon: Layers },
  lightning:   { label: "Lightning Talk",       badgeClass: "bg-gtp-orange/10 text-gtp-orange",        Icon: Zap },
  fireside:    { label: "Fireside Chat",        badgeClass: "bg-gtp-green/15 text-gtp-dark-green",     Icon: MessageSquare },
  reconvening: { label: "Reconvening",          badgeClass: "bg-gray-100 text-gray-500",               Icon: RefreshCw },
  concurrent:  { label: "Concurrent Sessions",  badgeClass: "bg-gtp-teal/10 text-gtp-dark-teal",      Icon: Users },
  special:     { label: "Special Event",        badgeClass: "bg-gtp-green/10 text-gtp-dark-green",     Icon: Film },
  closing:     { label: "Closing",              badgeClass: "bg-gtp-dark-teal/10 text-gtp-dark-teal",  Icon: Star },
  break:       { label: "Break",                badgeClass: "bg-gray-100 text-gray-400",               Icon: Coffee },
};

// ─── Agenda Data ──────────────────────────────────────────────────────────────

export const day1: Session[] = [
  {
    time: "09:00 – 09:30",
    durationMins: 30,
    type: "opening",
    title: "Opening of GTP 2026 Conference",
  },
  {
    time: "09:30 – 11:00",
    durationMins: 90,
    type: "plenary",
    title: "Opening Plenary: The Science of Global Tipping Points",
    speakerCount: 4,
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
  },
  {
    time: "11:40 – 12:40",
    durationMins: 60,
    type: "plenary",
    title: "Plenary 2: Global Context and ASEAN Pathways",
    speakerCount: 4,
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
    title: "Deep Dive Sessions",
    workshops: [
      { number: "1",  title: "Workshop Session: Regional Perspectives Deep Dive" },
      { number: "2",  title: "Workshop Session: Storytelling and Public Relations" },
      { number: "3",  title: "Workshop Session: Disinformation and Trust" },
      { number: "4",  title: "Workshop Session: Education and Systems Change" },
      { number: "5",  title: "Workshop Session: Co-creating Futures" },
      { number: "6",  title: "Workshop Session: The Air We Breathe" },
      { number: "7",  title: "Workshop Session: Tipping Points and the Coral Triangle" },
      { number: "8",  title: "Workshop Session: [Title – Topic from Open Proposals]" },
      { number: "9",  title: "Workshop Session: [Title – Topic from Open Proposals]" },
      { number: "10", title: "Workshop Session: [Title – Topic from Open Proposals]" },
      { number: "11", title: "Research Session: [Title – Topic from Open Abstract Calls]" },
      { number: "12", title: "Research Session: [Title – Topic from Open Abstract Calls]" },
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
  },
  {
    time: "16:30 – 17:00",
    durationMins: 30,
    type: "reconvening",
    title: "Reconvening",
  },
  {
    time: "Evening",
    type: "special",
    title: "Film Premiere: How to Live on Earth by Open Planet Studios",
    isEvening: true,
  },
];

export const day2: Session[] = [
  {
    time: "09:00 – 09:10",
    durationMins: 10,
    type: "lightning",
    title: "Lightning Talk: Who Really Pays for Environmental Damage?",
    speakerCount: 1,
  },
  {
    time: "09:10 – 10:40",
    durationMins: 90,
    type: "plenary",
    title: "Plenary 3: Flipping the Script",
    speakerCount: 4,
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
    title: "Breakout Sessions",
    workshops: [
      { number: "1",  title: "Workshop Session: Legal Frameworks and Litigation" },
      { number: "2",  title: "Workshop Session: Return on Values (ROV) – Doing Business Differently, Session One" },
      { number: "3",  title: "Workshop Session: Islamic and Innovative Responsible Finance" },
      { number: "4",  title: "Workshop Session: Health Leadership in Times of Instability" },
      { number: "5",  title: "Workshop Session: Faith Charter and Toolkit" },
      { number: "6",  title: "Workshop Session: [Title – Topic from Open Proposals]" },
      { number: "7",  title: "Workshop Session: [Title – Topic from Open Proposals]" },
      { number: "8",  title: "Workshop Session: [Title – Topic from Open Proposals]" },
      { number: "9",  title: "Workshop Session: [Title – Topic from Open Proposals]" },
      { number: "10", title: "Workshop Session: [Title – Topic from Open Proposals]" },
      { number: "11", title: "Research Session: [Title – Topic from Open Abstract Calls]" },
      { number: "12", title: "Research Session: [Title – Topic from Open Abstract Calls]" },
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
  },
  {
    time: "16:30 – 17:00",
    durationMins: 30,
    type: "reconvening",
    title: "Reconvening",
  },
  {
    time: "17:00 – 18:00",
    durationMins: 60,
    type: "special",
    title: "Poster Exhibit",
  },
  {
    time: "19:00",
    type: "special",
    title: "Street Food Dinner",
    isEvening: true,
  },
];

export const day3: Session[] = [
  {
    time: "09:00 – 10:00",
    durationMins: 60,
    type: "plenary",
    title: "Plenary 5: Finance for Positive Tipping Points",
    speakerCount: 4,
  },
  {
    time: "10:00 – 11:30",
    durationMins: 90,
    type: "plenary",
    title: "Plenary 6: From Courtrooms to System Change",
    speakerCount: 4,
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
    title: "Deep Dive Sessions",
    workshops: [
      { number: "1",  title: "Workshop Session: AI and Technology for Systems Transition" },
      { number: "2",  title: "Workshop Session: Nature-Based Solutions at Scale" },
      { number: "3",  title: "Workshop Session: Food Systems and Tipping Dynamics" },
      { number: "4",  title: "Workshop Session: Return on Values – Doing Business Differently" },
      { number: "5",  title: "Workshop Session: Health Leadership" },
      { number: "6",  title: "Workshop Session: Education Revolution" },
      { number: "7",  title: "Workshop Session: System Shifts or System Shocks" },
      { number: "8",  title: "Workshop Session: Cleantech Systems Change" },
      { number: "9",  title: "Workshop Session: [Title – Topic from Open Proposals]" },
      { number: "10", title: "Workshop Session: [Title – Topic from Open Proposals]" },
      { number: "11", title: "Research Session: [Title – Topic from Open Abstract Calls]" },
      { number: "12", title: "Research Session: [Title – Topic from Open Abstract Calls]" },
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
  },
  {
    time: "16:30 – 17:00",
    durationMins: 30,
    type: "reconvening",
    title: "Reconvening",
  },
];

export const day4: Session[] = [
  {
    time: "09:00 – 10:30",
    durationMins: 90,
    type: "plenary",
    title: "Plenary 8: Bringing It All Together and Road to COP31",
    speakerCount: 4,
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
    title: "Next Steps and Closing — Launch of the Kuala Lumpur Tipping Points Declaration",
  },
  {
    time: "12:30",
    type: "special",
    title: "End of Conference",
  },
];
