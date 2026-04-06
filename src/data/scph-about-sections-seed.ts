/**
 * **Reference only** — not applied by `seed-scph-section-pages` (About keeps JSX layout).
 *
 * Foundation / strategy / journey on `/about-us` use `TwoColumnTextImages` and `IconCardGrid`
 * in code; `sectionRichText` cannot reproduce that UI. Re-enable in the seed script only after
 * richer CMS block types exist (or accept plain-text-only bands).
 *
 * Meet the Team stays `teamMember` + `scphMeetTheTeamPage`.
 */

export const SCPH_ABOUT_PAGE_SECTIONS_SEED = [
  {
    _type: "sectionRichText" as const,
    _key: "about-foundation",
    enabled: true,
    eyebrow: "Our Foundation",
    heading: "What is Planetary Health?",
    body: `A planetary health approach to human development recognises that humankind has made significant progress in many ways with the industrial, green and technological revolutions as examples. But these development gains are now being offset by increasingly obvious disruption to the health of the planet.

We can see this in depleted biodiversity, changing land use and cover, a massive increase in air pollution, shortages of natural resources, and the resulting damage to our lived environment — most clearly demonstrated through recent pandemic and disease outbreaks and the climate emergency.

The live page also displays the Planetary Health diagram and Wedding Cake diagram beside this content — keep or replace those visuals in a future layout pass.`,
  },
  {
    _type: "sectionRichText" as const,
    _key: "about-strategy-intro",
    enabled: true,
    eyebrow: "Our Vision & Mission",
    heading: "Sunway Centre for Planetary Health",
    body: `Sunway Centre for Planetary Health is committed to research and advocacy that advances planetary health through three priority areas: healthy cities, health-centred decarbonisation, and driving an education revolution.

Anchored at Sunway University in Kuala Lumpur, we work across disciplines and borders to translate evidence into meaningful action for people and the planet.`,
  },
  {
    _type: "sectionRichText" as const,
    _key: "about-strategy-themes",
    enabled: true,
    eyebrow: "Strategic focus",
    heading: "Vision, strategy, values & pillars",
    body: `Vision & Mission
Our vision and mission set the direction for all our work, guiding how we advance planetary health across disciplines and borders.

2025–27 Strategy
Our three-year strategy outlines the concrete steps we are taking to translate evidence into meaningful action for people and the planet.

Core Values
We are guided by a set of core values that shape our culture, partnerships, and the way we engage with communities and institutions.

Strategic Pillars
Our strategic pillars organise our work into focused areas: healthy cities, health-centred decarbonisation, and an education revolution.`,
  },
  {
    _type: "sectionRichText" as const,
    _key: "about-journey",
    enabled: true,
    eyebrow: "Our Journey",
    heading: "Milestone Reached and Future Aspiration",
    body: `Journey timeline coming soon.

This section will display SCPH's milestones and future aspirations once the timeline assets are provided.`,
  },
];
