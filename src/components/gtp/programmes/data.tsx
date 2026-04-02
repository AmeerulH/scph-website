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
  concurrent:  { label: "Action Workshops",     badgeClass: "bg-gtp-teal/10 text-gtp-dark-teal",      Icon: Users },
  research:    { label: "Research Sessions",    badgeClass: "bg-gtp-orange/10 text-gtp-orange",        Icon: BookOpen },
  special:     { label: "Special Event",        badgeClass: "bg-gtp-green/10 text-gtp-dark-green",     Icon: Film },
  closing:     { label: "Closing",              badgeClass: "bg-gtp-dark-teal/10 text-gtp-dark-teal",  Icon: Star },
  break:       { label: "Break",                badgeClass: "bg-gray-100 text-gray-400",               Icon: Coffee },
};

// ─── Type-specific gradient banners (shared with modal & carousel) ────────────

export const TYPE_GRADIENTS: Record<string, string> = {
  opening:     "from-[#0D4D5E] via-[#009CB4] to-[#0D4D5E]",
  plenary:     "from-[#009CB4] via-[#0D4D5E] to-[#007d90]",
  lightning:   "from-[#DB5D00] via-[#0D4D5E] to-[#009CB4]",
  fireside:    "from-[#5C8119] via-[#0D4D5E] to-[#009CB4]",
  concurrent:  "from-[#009CB4] via-[#0D4D5E] to-[#5C8119]",
  research:    "from-[#DB5D00] via-[#0D4D5E] to-[#009CB4]",
  special:     "from-[#86BC25] via-[#0D4D5E] to-[#009CB4]",
  closing:     "from-[#0D4D5E] via-[#007d90] to-[#009CB4]",
  reconvening: "from-[#4b6070] via-[#2d4450] to-[#0D4D5E]",
  break:       "from-[#6b7280] via-[#4b5563] to-[#374151]",
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
    speakers: [
      { name: "Dr. Sarah Chen",      designation: "Marine Biologist, IUCN" },
      { name: "Prof. James Okafor",  designation: "Climate Economist, University of Lagos" },
      { name: "Dr. Amara Diallo",    designation: "Systems Ecologist, UNEP" },
      { name: "Prof. Lena Fischer",  designation: "Environmental Law, Heidelberg University" },
    ],
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
    speakers: [
      { name: "Dr. Nurul Ain Mohd",  designation: "Forest Researcher, UPM" },
    ],
  },
  {
    time: "11:40 – 12:40",
    durationMins: 60,
    type: "plenary",
    title: "Plenary 2: Global Context and ASEAN Pathways",
    speakers: [
      { name: "Prof. Raj Patel",     designation: "Sustainability, UC Berkeley" },
      { name: "Dr. Maya Sharma",     designation: "Urban Climate Planner, WRI" },
      { name: "Dr. Carlos Mendoza",  designation: "Energy Systems, IRENA" },
      { name: "Dr. Yuki Tanaka",     designation: "Technology & Policy, OECD" },
    ],
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
    ],
  },
  {
    time: "14:00 – 15:30",
    durationMins: 90,
    type: "research",
    title: "Research Sessions",
    workshops: [
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
    speakers: [
      { name: "Dr. Fatima Al-Rashid", designation: "Climate Justice Advocate, Climate Action Network" },
    ],
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
    speakers: [
      { name: "Prof. David Kurniawan", designation: "Environmental Economics, UI Jakarta" },
    ],
  },
  {
    time: "09:10 – 10:40",
    durationMins: 90,
    type: "plenary",
    title: "Plenary 3: Flipping the Script",
    speakers: [
      { name: "Dr. Sarah Chen",        designation: "Marine Biologist, IUCN" },
      { name: "Dr. Aiko Watanabe",     designation: "Behavioural Science, Tokyo University" },
      { name: "Prof. Kwame Asante",    designation: "Political Ecology, University of Ghana" },
      { name: "Dr. Elena Vasquez",     designation: "Media & Climate Communication, Reuters" },
    ],
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
    speakers: [
      { name: "Prof. James Okafor",    designation: "Climate Economist, University of Lagos" },
      { name: "Dr. Priya Nair",        designation: "Cultural Anthropology, JNU New Delhi" },
      { name: "Dr. Lars Eriksson",     designation: "Philosophy of Science, Uppsala University" },
      { name: "Dr. Amara Diallo",      designation: "Systems Ecologist, UNEP" },
    ],
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
    ],
  },
  {
    time: "14:00 – 15:30",
    durationMins: 90,
    type: "research",
    title: "Research Sessions",
    workshops: [
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
    speakers: [
      { name: "Dr. Carlos Mendoza",   designation: "Energy Systems, IRENA" },
    ],
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
    speakers: [
      { name: "Dr. Yuki Tanaka",       designation: "Technology & Policy, OECD" },
      { name: "Dr. Sofia Andersen",    designation: "Green Finance, Nordic Investment Bank" },
      { name: "Prof. Raj Patel",       designation: "Sustainability, UC Berkeley" },
      { name: "Dr. Fatima Al-Rashid",  designation: "Climate Justice Advocate, Climate Action Network" },
    ],
  },
  {
    time: "10:00 – 11:30",
    durationMins: 90,
    type: "plenary",
    title: "Plenary 6: From Courtrooms to System Change",
    speakers: [
      { name: "Prof. Lena Fischer",    designation: "Environmental Law, Heidelberg University" },
      { name: "Dr. Ngozi Adeyemi",     designation: "International Climate Law, African Union" },
      { name: "Dr. Marcus Webb",       designation: "Strategic Litigation, ClientEarth" },
      { name: "Dr. Maya Sharma",       designation: "Urban Climate Planner, WRI" },
    ],
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
    speakers: [
      { name: "Dr. Elena Vasquez",     designation: "Media & Climate Communication, Reuters" },
      { name: "Prof. Kwame Asante",    designation: "Political Ecology, University of Ghana" },
      { name: "Dr. Aiko Watanabe",     designation: "Behavioural Science, Tokyo University" },
      { name: "Dr. Lars Eriksson",     designation: "Philosophy of Science, Uppsala University" },
    ],
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
    ],
  },
  {
    time: "14:00 – 15:30",
    durationMins: 90,
    type: "research",
    title: "Research Sessions",
    workshops: [
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
    speakers: [
      { name: "Dr. Priya Nair",        designation: "Cultural Anthropology, JNU New Delhi" },
    ],
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
    speakers: [
      { name: "Dr. Sarah Chen",        designation: "Marine Biologist, IUCN" },
      { name: "Prof. James Okafor",    designation: "Climate Economist, University of Lagos" },
      { name: "Dr. Sofia Andersen",    designation: "Green Finance, Nordic Investment Bank" },
      { name: "Dr. Marcus Webb",       designation: "Strategic Litigation, ClientEarth" },
    ],
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
