/**
 * Seeds SCPH About / Research / Network singletons with structured bands that
 * match the layouts in the app (defaults mirror repo copy).
 *
 * Idempotent: fixed `_id` = `_type` per document; one transaction.
 *
 * Prerequisites: SANITY_API_TOKEN in .env.local (Editor+).
 * Dataset: SANITY_DATASET from .env.local (default production).
 *
 * Usage:
 *   npx tsx scripts/seed-scph-section-pages.ts
 *   DRY_RUN=1 npx tsx scripts/seed-scph-section-pages.ts
 */

import { createClient } from "@sanity/client";
import * as dotenv from "dotenv";
import * as path from "path";
import {
  SCPH_ABOUT_FOUNDATION_DEFAULTS,
  SCPH_ABOUT_JOURNEY_DEFAULTS,
  SCPH_ABOUT_STRATEGY_DEFAULTS,
  SCPH_NETWORK_COMMUNITY_DEFAULTS,
  SCPH_RESEARCH_PILLARS_DEFAULT,
  SCPH_RESEARCH_PILLARS_SECTION_DEFAULTS,
  SCPH_RESEARCH_ROADMAP_DEFAULT,
  SCPH_RESEARCH_STATS_DEFAULT,
} from "../src/data/scph-page-bands-defaults";

dotenv.config({ path: path.join(process.cwd(), ".env.local") });

const aboutDoc = {
  _id: "scphAboutPage",
  _type: "scphAboutPage" as const,
  internalTitle: "About page",
  foundation: {
    eyebrow: SCPH_ABOUT_FOUNDATION_DEFAULTS.eyebrow,
    heading: SCPH_ABOUT_FOUNDATION_DEFAULTS.heading,
    body: SCPH_ABOUT_FOUNDATION_DEFAULTS.body,
  },
  strategy: {
    sectionSubtitle: SCPH_ABOUT_STRATEGY_DEFAULTS.sectionSubtitle,
    sectionTitle: SCPH_ABOUT_STRATEGY_DEFAULTS.sectionTitle,
    introBody: SCPH_ABOUT_STRATEGY_DEFAULTS.introBody,
    cards: SCPH_ABOUT_STRATEGY_DEFAULTS.cards.map((c, i) => ({
      _key: `strategy-card-${i}`,
      iconKey: c.iconKey,
      title: c.title,
      description: c.description,
      href: c.href,
    })),
  },
  journey: { ...SCPH_ABOUT_JOURNEY_DEFAULTS },
  sections: [] as const,
};

const researchDoc = {
  _id: "scphResearchPage",
  _type: "scphResearchPage" as const,
  internalTitle: "Research page",
  statsRow: {
    ...SCPH_RESEARCH_STATS_DEFAULT,
    items: (SCPH_RESEARCH_STATS_DEFAULT.items ?? []).map((item, i) => ({
      ...item,
      _key: `stat-${i}`,
    })),
  },
  roadmapBlock: {
    ...SCPH_RESEARCH_ROADMAP_DEFAULT,
    ctas: (SCPH_RESEARCH_ROADMAP_DEFAULT.ctas ?? []).map((c, i) => ({
      ...c,
      _key: `roadmap-cta-${i}`,
    })),
  },
  pillarsSectionSubtitle:
    SCPH_RESEARCH_PILLARS_SECTION_DEFAULTS.pillarsSectionSubtitle,
  pillarsSectionTitle:
    SCPH_RESEARCH_PILLARS_SECTION_DEFAULTS.pillarsSectionTitle,
  pillars: SCPH_RESEARCH_PILLARS_DEFAULT.map((p, i) => ({
    _key: `pillar-${i}`,
    iconKey: p.iconKey,
    num: p.num,
    title: p.title,
    description: p.description,
  })),
  sections: [] as const,
};

const networkDoc = {
  _id: "scphNetworkPage",
  _type: "scphNetworkPage" as const,
  internalTitle: "Network page",
  community: {
    copyEyebrow: SCPH_NETWORK_COMMUNITY_DEFAULTS.copyEyebrow,
    copyTitle: SCPH_NETWORK_COMMUNITY_DEFAULTS.copyTitle,
    copyBody: SCPH_NETWORK_COMMUNITY_DEFAULTS.copyBody,
    benefitsEyebrow: SCPH_NETWORK_COMMUNITY_DEFAULTS.benefitsEyebrow,
    benefitsTitle: SCPH_NETWORK_COMMUNITY_DEFAULTS.benefitsTitle,
    benefitItems: [...SCPH_NETWORK_COMMUNITY_DEFAULTS.benefitItems],
  },
  sections: [] as const,
};

async function main() {
  const docs = [aboutDoc, researchDoc, networkDoc];

  if (process.env.DRY_RUN) {
    console.log(JSON.stringify(docs, null, 2));
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

  await client
    .transaction()
    .createOrReplace(aboutDoc)
    .createOrReplace(researchDoc)
    .createOrReplace(networkDoc)
    .commit();

  console.log(
    `Upserted scphAboutPage, scphResearchPage, scphNetworkPage on dataset "${dataset}". Deploy schema, then Publish in Studio.`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
