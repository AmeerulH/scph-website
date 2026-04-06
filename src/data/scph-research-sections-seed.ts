/**
 * **Reference only** — not applied by `seed-scph-section-pages` (Research keeps JSX layout).
 *
 * Stats, roadmap (`SectionProseCta` with icons), and pillar `IconCardGrid` live in
 * [`research/page.tsx`](../app/(scph)/research/page.tsx). Generic `section*` blocks cannot
 * match that UI; use this file as copy reference or after richer CMS blocks exist.
 */

export const SCPH_RESEARCH_PAGE_SECTIONS_SEED = [
  {
    _type: "sectionStatsRow" as const,
    _key: "research-stats",
    enabled: true,
    variant: "light-green" as const,
    items: [
      {
        _type: "sectionStatItem" as const,
        _key: "rs-experts",
        value: "100+",
        label: "Experts",
      },
      {
        _type: "sectionStatItem" as const,
        _key: "rs-wg",
        value: "4",
        label: "Working Groups",
      },
      {
        _type: "sectionStatItem" as const,
        _key: "rs-areas",
        value: "7",
        label: "Action Areas",
      },
      {
        _type: "sectionStatItem" as const,
        _key: "rs-year",
        value: "2024",
        label: "Published",
      },
    ],
  },
  {
    _type: "sectionProseCta" as const,
    _key: "research-roadmap",
    enabled: true,
    title: "How Do We 'Do' Planetary Health?",
    subtitle: "The Roadmap",
    background: "default" as const,
    constrainProse: true,
    actionsInsideProse: false,
    body: `The Planetary Health Roadmap and Action Plan was unveiled as the primary outcome of the 2024 Planetary Health Summit and 6th Annual Meeting (PHAM 2024). In today's world, marked by escalating environmental challenges and their impact on human well-being, the Roadmap and Action Plan can help to answer the question: "How do we 'do' Planetary Health?"

The development of this Roadmap and Action Plan was made possible through the collaborative efforts of experts working across four working groups and includes more than 100 experts from prestigious institutions around the planet. The document aims to bridge Planetary Health discourse between academia and action via policy, political, and civil society spaces, and to begin the process of pulling together an impactful set of actions that address the interconnected issues of human and environmental health.

The Roadmap addresses the pressing need for a coordinated global response to the environmental challenges that threaten human health and biodiversity.`,
    ctas: [
      {
        _type: "sectionCtaLink" as const,
        _key: "roadmap-full",
        label: "Read the Full Roadmap",
        href: "https://drive.google.com/file/d/1ZFUFo09NkJJRpOl5Y5cLmV_HoA_4msRe/view",
        openInNewTab: true,
        style: "primary" as const,
      },
      {
        _type: "sectionCtaLink" as const,
        _key: "roadmap-briefing",
        label: "Download Briefing Note",
        href: "https://files.visura.co/users/12837/babfa360f16e6c7f017963cd1ed79502.pdf",
        openInNewTab: true,
        style: "outline" as const,
      },
    ],
  },
  {
    _type: "sectionRichText" as const,
    _key: "research-pillars",
    enabled: true,
    eyebrow: "Action Areas",
    heading: "Seven Pathways to Planetary Health",
    body: `01 — Preventing the Next Pandemic
Strengthening global health architecture to detect, prevent, and respond to infectious disease threats shaped by environmental disruption.

02 — Tackling the Climate Emergency
Integrating health at the centre of climate policy to accelerate decarbonisation while delivering co-benefits for human well-being.

03 — Creating Healthy Cities
Advancing urban design, green infrastructure, and city governance to build environments where people and the planet thrive.

04 — Achieving Sustainable Food Systems
Transforming how food is produced, distributed, and consumed to nourish people while restoring natural ecosystems.

05 — Advancing Planetary Health Communications
Building public understanding, narrative, and civic engagement around the connections between human health and the health of the planet.

06 — Encouraging Effective Planetary Health Governance
Designing political, institutional, and policy frameworks that enable coordinated intersectoral action on planetary health.

07 — Creating A Planetary Health Education Revolution
Reimagining education systems to equip the next generation with the knowledge, values, and skills to protect and restore planetary health.`,
  },
];
