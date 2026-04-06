/**
 * Default SCPH home hero + highlighted-events strip (matches former hardcoded `ScphHero`).
 * Used by the hero component, CMS resolvers, and `seed-scph-home-page`.
 */

export type ScphHomeHeroCopy = {
  headlinePrefix: string;
  headlineAccent: string;
  tagline: string;
  body: string;
};

export type ScphHomeHighlightedEventItem = {
  id: string;
  label: string;
  title: string;
  subtitle: string;
  teaser?: string;
  href: string;
  external: boolean;
};

export const DEFAULT_SCPH_HOME_HERO: ScphHomeHeroCopy = {
  headlinePrefix: "Sunway Centre for",
  headlineAccent: "Planetary Health",
  tagline: "Where knowledge meets action",
  body:
    'A "Think-and-Do" tank, committed to research and advocacy that advances planetary health through three priority areas: healthy cities, health-centred decarbonisation, and driving an education revolution.',
};

export const DEFAULT_SCPH_HOME_HIGHLIGHTED_EVENTS: ScphHomeHighlightedEventItem[] =
  [
    {
      id: "gtp-2026",
      label: "Upcoming · 2026",
      title: "Global Tipping Points 2026",
      subtitle: "Kuala Lumpur, Malaysia",
      teaser:
        "Decisions that will shape generations—science, finance, culture & policy in Asia for the first time.",
      href: "/events/gtp-2026/about",
      external: false,
    },
  ];
