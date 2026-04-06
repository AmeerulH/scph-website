import type {
  SectionProseCtaBlock,
  SectionStatsRowBlock,
} from "@/sanity/section-block-types";

/** Raw band shapes (no React icons) — merged in `scph-page-bands-merge`. */

/** Used when no About page document exists in Sanity (local repo imagery). */
export type ScphAboutFoundationDefaults = {
  eyebrow: string;
  heading: string;
  body: string;
  image1FallbackSrc: string;
  image1Alt: string;
  image1Caption: string;
  image2FallbackSrc: string;
  image2Alt: string;
  image2Caption: string;
};

export const SCPH_ABOUT_FOUNDATION_DEFAULTS: ScphAboutFoundationDefaults = {
  eyebrow: "Our Foundation",
  heading: "What is Planetary Health?",
  body: `A planetary health approach to human development recognises that humankind has made significant progress in many ways with the industrial, green and technological revolutions as examples. But these development gains are now being offset by increasingly obvious disruption to the health of the planet.

We can see this in depleted biodiversity, changing land use and cover, a massive increase in air pollution, shortages of natural resources, and the resulting damage to our lived environment — most clearly demonstrated through recent pandemic and disease outbreaks and the climate emergency.`,
  image1FallbackSrc: "/images/scph/ph-diagram.png",
  image1Alt: "Planetary Health Diagram",
  image1Caption: "PH Diagram",
  image2FallbackSrc: "/images/scph/wedding-cake.png",
  image2Alt: "Wedding Cake Diagram",
  image2Caption: "Wedding Cake",
};

export type ScphAboutStrategyCardSeed = {
  id: string;
  iconKey: "target" | "arrow-right" | "book-open" | "users";
  title: string;
  description: string;
  href: string;
};

export const SCPH_ABOUT_STRATEGY_CARDS_DEFAULT: ScphAboutStrategyCardSeed[] = [
  {
    id: "vision-mission",
    iconKey: "target",
    title: "Vision & Mission",
    description:
      "Our vision and mission set the direction for all our work, guiding how we advance planetary health across disciplines and borders.",
    href: "#",
  },
  {
    id: "strategy-2025-27",
    iconKey: "arrow-right",
    title: "2025–27 Strategy",
    description:
      "Our three-year strategy outlines the concrete steps we are taking to translate evidence into meaningful action for people and the planet.",
    href: "#",
  },
  {
    id: "core-values",
    iconKey: "book-open",
    title: "Core Values",
    description:
      "We are guided by a set of core values that shape our culture, partnerships, and the way we engage with communities and institutions.",
    href: "#",
  },
  {
    id: "strategic-pillars",
    iconKey: "users",
    title: "Strategic Pillars",
    description:
      "Our strategic pillars organise our work into focused areas: healthy cities, health-centred decarbonisation, and an education revolution.",
    href: "#",
  },
];

export const SCPH_ABOUT_STRATEGY_DEFAULTS = {
  sectionSubtitle: "Our Vision & Mission",
  sectionTitle: "Sunway Centre for Planetary Health",
  introBody: `Sunway Centre for Planetary Health is committed to research and advocacy that advances planetary health through three priority areas: healthy cities, health-centred decarbonisation, and driving an education revolution.

Anchored at Sunway University in Kuala Lumpur, we work across disciplines and borders to translate evidence into meaningful action for people and the planet.`,
  cards: SCPH_ABOUT_STRATEGY_CARDS_DEFAULT,
};

export const SCPH_ABOUT_JOURNEY_DEFAULTS = {
  sectionSubtitle: "Our Journey",
  sectionTitle: "Milestone Reached and Future Aspiration",
  placeholderTitle: "Journey timeline coming soon",
  placeholderBody:
    "This section will display SCPH's milestones and future aspirations once the timeline assets are provided.",
};

export const SCPH_RESEARCH_STATS_DEFAULT: SectionStatsRowBlock = {
  _type: "sectionStatsRow",
  enabled: true,
  variant: "light-green",
  items: [
    { _type: "sectionStatItem", value: "100+", label: "Experts" },
    { _type: "sectionStatItem", value: "4", label: "Working Groups" },
    { _type: "sectionStatItem", value: "7", label: "Action Areas" },
    { _type: "sectionStatItem", value: "2024", label: "Published" },
  ],
};

export const SCPH_RESEARCH_ROADMAP_DEFAULT: SectionProseCtaBlock = {
  _type: "sectionProseCta",
  enabled: true,
  title: "How Do We 'Do' Planetary Health?",
  subtitle: "The Roadmap",
  body: `The Planetary Health Roadmap and Action Plan was unveiled as the primary outcome of the 2024 Planetary Health Summit and 6th Annual Meeting (PHAM 2024). In today's world, marked by escalating environmental challenges and their impact on human well-being, the Roadmap and Action Plan can help to answer the question: "How do we 'do' Planetary Health?"

The development of this Roadmap and Action Plan was made possible through the collaborative efforts of experts working across four working groups and includes more than 100 experts from prestigious institutions around the planet. The document aims to bridge Planetary Health discourse between academia and action via policy, political, and civil society spaces, and to begin the process of pulling together an impactful set of actions that address the interconnected issues of human and environmental health.

The Roadmap addresses the pressing need for a coordinated global response to the environmental challenges that threaten human health and biodiversity.`,
  background: "default",
  constrainProse: true,
  actionsInsideProse: false,
  ctas: [
    {
      _type: "sectionCtaLink",
      label: "Read the Full Roadmap",
      href: "https://drive.google.com/file/d/1ZFUFo09NkJJRpOl5Y5cLmV_HoA_4msRe/view",
      openInNewTab: true,
      style: "primary",
    },
    {
      _type: "sectionCtaLink",
      label: "Download Briefing Note",
      href: "https://files.visura.co/users/12837/babfa360f16e6c7f017963cd1ed79502.pdf",
      openInNewTab: true,
      style: "outline",
    },
  ],
};

export type ScphResearchPillarSeed = {
  id: string;
  iconKey:
    | "shield-alert"
    | "thermometer"
    | "building2"
    | "wheat"
    | "megaphone"
    | "landmark"
    | "graduation-cap";
  num: string;
  title: string;
  description: string;
};

export const SCPH_RESEARCH_PILLARS_DEFAULT: ScphResearchPillarSeed[] = [
  {
    id: "01",
    iconKey: "shield-alert",
    num: "01",
    title: "Preventing the Next Pandemic",
    description:
      "Strengthening global health architecture to detect, prevent, and respond to infectious disease threats shaped by environmental disruption.",
  },
  {
    id: "02",
    iconKey: "thermometer",
    num: "02",
    title: "Tackling the Climate Emergency",
    description:
      "Integrating health at the centre of climate policy to accelerate decarbonisation while delivering co-benefits for human well-being.",
  },
  {
    id: "03",
    iconKey: "building2",
    num: "03",
    title: "Creating Healthy Cities",
    description:
      "Advancing urban design, green infrastructure, and city governance to build environments where people and the planet thrive.",
  },
  {
    id: "04",
    iconKey: "wheat",
    num: "04",
    title: "Achieving Sustainable Food Systems",
    description:
      "Transforming how food is produced, distributed, and consumed to nourish people while restoring natural ecosystems.",
  },
  {
    id: "05",
    iconKey: "megaphone",
    num: "05",
    title: "Advancing Planetary Health Communications",
    description:
      "Building public understanding, narrative, and civic engagement around the connections between human health and the health of the planet.",
  },
  {
    id: "06",
    iconKey: "landmark",
    num: "06",
    title: "Encouraging Effective Planetary Health Governance",
    description:
      "Designing political, institutional, and policy frameworks that enable coordinated intersectoral action on planetary health.",
  },
  {
    id: "07",
    iconKey: "graduation-cap",
    num: "07",
    title: "Creating A Planetary Health Education Revolution",
    description:
      "Reimagining education systems to equip the next generation with the knowledge, values, and skills to protect and restore planetary health.",
  },
];

export const SCPH_RESEARCH_PILLARS_SECTION_DEFAULTS = {
  pillarsSectionSubtitle: "Action Areas",
  pillarsSectionTitle: "Seven Pathways to Planetary Health",
};

export const SCPH_NETWORK_COMMUNITY_DEFAULTS = {
  copyEyebrow: "Who Qualifies",
  copyTitle: "Anyone Who Shares Our Vision",
  copyBody: `Anyone who shares our vision for a world where the health of humans and the planet thrive in harmony!

Whether you are a student, researcher, policymaker, or community advocate — there is a place for you in the planetary health movement.`,
  benefitsEyebrow: "What You Get",
  benefitsTitle: "Member Benefits",
  benefitItems: [
    "Opportunity to get your organisation, social enterprise, or project featured within SCPH's research themes",
    "Opportunity to write for our Medium page",
    "Exclusive access to SCPH's partners' events",
    "Early-bird access to SCPH events",
    "Access to an online community of like-minded individuals",
  ],
};
