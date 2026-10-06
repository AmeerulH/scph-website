export type GtpProgrammeActivitySlug =
  | "action-workshops"
  | "ai-thinkers-networking-breakfast"
  | "film-screening"
  | "sensorial-station";

/** One knowledge-partner mark on an Action Workshop day. */
export type GtpActionWorkshopPartnerLogo = {
  name: string;
  logoUrl: string;
  logoAlt: string;
  href?: string;
};

/** Logos shown in one row under a single Action Workshop date. */
export type GtpActionWorkshopPartnerDay = {
  dateLabel: string;
  label: string;
  partners: GtpActionWorkshopPartnerLogo[];
};

export type GtpProgrammeActivityEntry = {
  title: string;
  dateLabel?: string;
  description?: string;
  posterUrl?: string;
  posterAlt?: string;
  posterWidth?: number;
  posterHeight?: number;
  /** Artificial Intelligence Sessions: ISO date (YYYY-MM-DD) used for order and the large date. */
  sessionDate?: string;
  /** Short tag such as "Workshop" or "Networking Breakfast". */
  format?: string;
  time?: string;
  venue?: string;
  /** Per-session registration; falls back to the page-level button when empty. */
  registrationUrl?: string;
  registrationLabel?: string;
  /** Greyed-out button text while there is no registration URL. */
  registrationPendingLabel?: string;
};

/** Sensorial Station rows. Same shape as a Sustainability commitment, without the highlight figure. */
export type GtpProgrammeActivityStation = {
  id: string;
  category: string;
  headline: string;
  body: string;
  image?: { src: string; alt: string };
  link?: { label: string; href: string };
};

export type GtpProgrammeActivityPage = {
  slug: GtpProgrammeActivitySlug;
  pageTitle: string;
  heroImageUrl?: string;
  heroLede: string;
  intro: string;
  registrationStatus: "open" | "comingSoon" | "closed";
  registrationLabel: string;
  registrationUrl?: string;
  /** Page-level poster for the breakfast, film, and sensorial pages. */
  showcasePosterUrl?: string;
  showcasePosterAlt?: string;
  showcasePosterWidth?: number;
  showcasePosterHeight?: number;
  entries: GtpProgrammeActivityEntry[];
  /** Action Workshops: partner logo rows keyed by the day heading. */
  knowledgePartnerDays: GtpActionWorkshopPartnerDay[];
  /** Sensorial Station: heading above the numbered station list. */
  stationsTitle: string;
  stations: GtpProgrammeActivityStation[];
};

const actionWorkshops: GtpProgrammeActivityEntry[] = [
  ["The Power of Narrative: Becoming Climate and Health Storytellers", "13 October 2026"],
  ["Coral tipping points building the region's capacity to respond", "13 October 2026"],
  ["From Commitment to Delivery Implementing the Sustainable Faith Institution — A Faith Toolkit Lab", "13 October 2026", "Faith institutions hold reach, trust, and moral authority at a scale the planetary health movement urgently needs. Working in six teams across buildings, events, finance, community norms, youth, and storytelling, participants use the Faith-Based Toolkit for Planetary Health to design real delivery plans and shape Toolkit Version 2."],
  ["Clean Air – A Positive Tipping Point for Health and the Climate", "13 October 2026"],
  ["Positive Tipping Points for Protecting Tropical Forests", "13 October 2026"],
  ["Global Citizen Participation in Earth System Tipping Points Governance", "13 October 2026"],
  ["Operationalizing Health Impact Assessment for Cross-Sectoral Action", "13 October 2026"],
  ["Exploring a Systemic Capital Allocation Framework to reframe decisions and accelerate the Shift", "13 October 2026"],
  ["Systems Change in Times of Disruption: New Opportunities for the Global Energy Transition", "13 October 2026"],
  ["Rethinking Leadership: How to Live on Earth", "13 October 2026"],
  ["Wellbeing societies: from negative to positive economic tipping points", "13 October 2026"],
  ["Climate Disinformation: Understanding the System and Fighting Back", "14 October 2026", "Help participants understand how climate disinformation is produced, funded, amplified, and normalised; and build practical skills to identify, pre-empt, and counter it effectively."],
  ["Action on Super Pollutants – the emergency brake on climate change.", "14 October 2026"],
  ["Doing Tipping Points Justice", "14 October 2026"],
  ["Accelerating Action: The Missing Architecture for Purpose-Led ROV Firms", "14 October 2026"],
  ["Global empirical lessons for tipping positive changes", "14 October 2026"],
  ["Mobilising Leadership for Healthier and Equitable Societies", "14 October 2026"],
  ["Tipping the Balance with Data: Optimizing Action with Innovation in Technology and Policy", "14 October 2026"],
  ["Energy By Design in Southeast Asia: Developing Systems Change Strategies for Power, Industry and Cooling", "14 October 2026"],
  ["Developing a Resilience Sensing System for Sustainability and Security in Asia", "14 October 2026"],
  ["Learning from Nature’s BrillianceTipping Points – Pathways for Innovation", "14 October 2026"],
].map(([title, dateLabel, description]) => ({title, dateLabel, description}));

export const DEFAULT_GTP_PROGRAMME_ACTIVITY_PAGES: Record<
  GtpProgrammeActivitySlug,
  GtpProgrammeActivityPage
> = {
  "action-workshops": {
    slug: "action-workshops",
    pageTitle: "Action Workshops",
    heroLede: "13–14 October 2026 · Global Tipping Points Conference",
    intro: "Join practical, participatory sessions exploring how ideas become action. Descriptions and facilitator information will be added as they are confirmed.",
    registrationStatus: "comingSoon",
    registrationLabel: "Registration opening soon",
    entries: actionWorkshops,
    knowledgePartnerDays: [],
    stationsTitle: "The stations",
    stations: [],
  },
  "ai-thinkers-networking-breakfast": {
    slug: "ai-thinkers-networking-breakfast",
    pageTitle: "Artificial Intelligence Sessions",
    heroLede: "11–15 October 2026 · Global Tipping Points Conference",
    intro: "Artificial intelligence is rapidly changing how we think, work, relate, decide and organise society. Join the networking breakfasts and workshops that bring thinkers and practitioners together to consider what kind of hybrid future we want to create, and what it will take to make it pro-people, pro-planet and pro-potential.",
    registrationStatus: "open",
    registrationLabel: "Register",
    registrationUrl: "https://forms.cloud.microsoft/r/GncA02pMWe",
    knowledgePartnerDays: [],
    entries: [
      {
        title: "AI Workshop",
        dateLabel: "11 October 2026",
        sessionDate: "2026-10-11",
        format: "Workshop",
        description: "Details to be announced.",
      },
      {
        title: "AI Thinkers Networking Breakfast: Curating a Hybrid Future",
        dateLabel: "13 October 2026",
        sessionDate: "2026-10-13",
        format: "Networking Breakfast",
        description: "Grounded in the logic of ProSocial AI, these sessions connect technological change with human agency, meaning, prosperity and planetary health. Bring a perspective, a question, or a productive disagreement.",
        registrationLabel: "Register for the breakfast",
        registrationUrl: "https://forms.cloud.microsoft/r/GncA02pMWe",
      },
      {
        title: "AI Thinkers Networking Breakfast: Curating a Hybrid Future",
        dateLabel: "15 October 2026",
        sessionDate: "2026-10-15",
        format: "Networking Breakfast",
        description: "Grounded in the logic of ProSocial AI, these sessions connect technological change with human agency, meaning, prosperity and planetary health. Bring a perspective, a question, or a productive disagreement.",
        registrationLabel: "Register for the breakfast",
        registrationUrl: "https://forms.cloud.microsoft/r/GncA02pMWe",
      },
      {
        title: "AI Workshop",
        dateLabel: "15 October 2026",
        sessionDate: "2026-10-15",
        format: "Workshop",
        description: "Details to be announced.",
      },
    ],
    stationsTitle: "The stations",
    stations: [],
  },
  "film-screening": {
    slug: "film-screening",
    pageTitle: "Film Screening",
    heroLede: "Global Tipping Points Conference 2026",
    intro: "Film screening details will be announced soon. Please check back for the programme, timings and registration information.",
    registrationStatus: "comingSoon",
    registrationLabel: "Details coming soon",
    entries: [],
    knowledgePartnerDays: [],
    stationsTitle: "The stations",
    stations: [],
  },
  "sensorial-station": {
    slug: "sensorial-station",
    pageTitle: "Sensorial Station",
    heroLede: "Global Tipping Points Conference 2026",
    intro:
      "Sensorial Station details will be announced soon. Please check back for the programme, timings and registration information.",
    registrationStatus: "comingSoon",
    registrationLabel: "Details coming soon",
    entries: [],
    knowledgePartnerDays: [],
    stationsTitle: "The stations",
    stations: [],
  },
};
