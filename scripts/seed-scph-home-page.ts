/**
 * Repo defaults → Sanity `scphHomePage` singleton (hero, highlighted events strip, stats, roadmap, NPHAP on `/`).
 *
 * Hero + events: [`src/data/scph-home-hero-defaults.ts`](src/data/scph-home-hero-defaults.ts). Stats / roadmap /
 * NPHAP mirror [`src/app/(scph)/page.tsx`](src/app/(scph)/page.tsx). `introSections` is seeded empty.
 *
 * Idempotent: fixed _id `scphHomePage` with createOrReplace.
 *
 * Prerequisites: SANITY_API_TOKEN in .env.local (Editor+).
 * Dataset: SANITY_DATASET from .env.local (default production).
 *
 * Usage:
 *   npx tsx scripts/seed-scph-home-page.ts
 *   DRY_RUN=1 npx tsx scripts/seed-scph-home-page.ts
 */

import { createClient } from "@sanity/client";
import * as dotenv from "dotenv";
import * as path from "path";

import {
  DEFAULT_SCPH_HOME_HERO,
  DEFAULT_SCPH_HOME_HIGHLIGHTED_EVENTS,
} from "../src/data/scph-home-hero-defaults";
import { DEFAULT_SCPH_HOME_PARTNERS_COPY } from "../src/data/scph-home-partners-defaults";

dotenv.config({ path: path.join(process.cwd(), ".env.local") });

const DOC_ID = "scphHomePage";

const HERO_SEED = {
  _type: "scphHomeHero" as const,
  headlinePrefix: DEFAULT_SCPH_HOME_HERO.headlinePrefix,
  headlineAccent: DEFAULT_SCPH_HOME_HERO.headlineAccent,
  tagline: DEFAULT_SCPH_HOME_HERO.tagline,
  body: DEFAULT_SCPH_HOME_HERO.body,
};

const HIGHLIGHTED_EVENTS_SEED = DEFAULT_SCPH_HOME_HIGHLIGHTED_EVENTS.map(
  (e) => ({
    _type: "scphHomeHighlightedEvent" as const,
    _key: e.id,
    label: e.label,
    title: e.title,
    subtitle: e.subtitle,
    ...(e.teaser ? { teaser: e.teaser } : {}),
    href: e.href,
    openInNewTab: e.external,
  }),
);

/** Same strings as `homeStats` + `StatsRow` variant on the home page. */
const STATS_ROW = {
  _type: "sectionStatsRow" as const,
  enabled: true,
  variant: "blue-band" as const,
  items: [
    {
      _type: "sectionStatItem" as const,
      _key: "stat-priority",
      value: "3",
      label: "Priority Areas",
    },
    {
      _type: "sectionStatItem" as const,
      _key: "stat-projects",
      value: "10+",
      label: "Research Projects",
    },
    {
      _type: "sectionStatItem" as const,
      _key: "stat-partners",
      value: "50+",
      label: "Partners & Collaborators",
    },
    {
      _type: "sectionStatItem" as const,
      _key: "stat-pubs",
      value: "20+",
      label: "Publications",
    },
  ],
};

/** Matches `RoadmapSection`: muted, wide prose, primary + outline CTAs. */
const ROADMAP_SECTION = {
  _type: "sectionProseCta" as const,
  enabled: true,
  title: "Planetary Health Roadmap and Action Plan",
  subtitle: "How do we 'do' Planetary Health?",
  background: "muted" as const,
  constrainProse: false,
  actionsInsideProse: false,
  body: `The Planetary Health Roadmap and Action Plan aims to bridge Planetary Health discourse between academia and action via policy, political, and civil society spaces, and to begin the process of pulling together an impactful set of actions that address the interconnected issues of human and environmental health. The Roadmap addresses the pressing need for a coordinated global response to the environmental challenges that threaten human health and biodiversity.`,
  ctas: [
    {
      _type: "sectionCtaLink" as const,
      _key: "roadmap-read",
      label: "Read the Roadmap Action Plan",
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
};

/** Matches `NphapSection`: default bg, buttons inside prose column, one primary CTA. */
const NPHAP_SECTION = {
  _type: "sectionProseCta" as const,
  enabled: true,
  title: "The National Planetary Health Action Plan (NPHAP)",
  subtitle: "Malaysia's First Action Plan",
  background: "default" as const,
  constrainProse: true,
  actionsInsideProse: true,
  body: `At the Planetary Health Annual Meeting 2025 in Rotterdam, Malaysia was recognised as the first nation to develop a national-level Planetary Health Action Plan, demonstrating leadership in protecting people and the planet.

Developed by the Academy of Sciences Malaysia, NPHAP charts a bold, whole-of-nation framework to align Malaysia's development within planetary boundaries.`,
  ctas: [
    {
      _type: "sectionCtaLink" as const,
      _key: "nphap-report",
      label: "Read the full NPHAP",
      href: "https://www.akademisains.gov.my/nphap-full-report/",
      openInNewTab: true,
      style: "primary" as const,
    },
  ],
};

const PARTNERS_BAND_SEED = {
  showBand: true,
  title: DEFAULT_SCPH_HOME_PARTNERS_COPY.title,
  subtitle: DEFAULT_SCPH_HOME_PARTNERS_COPY.subtitle,
  partners: [] as const,
  noticeBeforeLink: DEFAULT_SCPH_HOME_PARTNERS_COPY.noticeBeforeLink,
  noticeLinkText: DEFAULT_SCPH_HOME_PARTNERS_COPY.noticeLinkText,
  noticeLinkHref: DEFAULT_SCPH_HOME_PARTNERS_COPY.noticeLinkHref,
};

function buildDocument() {
  return {
    _id: DOC_ID,
    _type: "scphHomePage" as const,
    internalTitle: "Home",
    hero: HERO_SEED,
    highlightedEvents: HIGHLIGHTED_EVENTS_SEED,
    statsRow: STATS_ROW,
    introSections: [] as const,
    roadmapSection: ROADMAP_SECTION,
    nphapSection: NPHAP_SECTION,
    partnersBand: PARTNERS_BAND_SEED,
  };
}

async function main() {
  const doc = buildDocument();

  if (process.env.DRY_RUN) {
    console.log(JSON.stringify(doc, null, 2));
    return;
  }

  const token = process.env.SANITY_API_TOKEN;
  if (!token) {
    console.error(
      "SANITY_API_TOKEN is not set. Add it to .env.local (see import-gtp-programme-to-sanity.ts).",
    );
    process.exit(1);
  }

  const dataset = process.env.SANITY_DATASET ?? "production";

  const client = createClient({
    projectId: "y0tkemxm",
    dataset,
    apiVersion: "2024-01-01",
    token,
    useCdn: false,
  });

  await client.transaction().createOrReplace(doc).commit();
  console.log(
    `Upserted ${DOC_ID} on dataset "${dataset}". Open Studio (same dataset) and Publish if needed.`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
