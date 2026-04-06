/**
 * Repo defaults → Sanity `gtp2026SubmissionsPage` singleton
 *
 * Source: src/sanity/gtp-marketing-defaults.ts (same copy as mergeGtpSubmissionsCopy fallbacks).
 * Idempotent: fixed _id `gtp2026SubmissionsPage` with createOrReplace.
 *
 * Prerequisites: SANITY_API_TOKEN in .env.local (Editor+).
 * Dataset: SANITY_DATASET from .env.local (default production).
 *
 * Usage:
 *   npx tsx scripts/seed-gtp-submissions-page.ts
 *   DRY_RUN=1 npx tsx scripts/seed-gtp-submissions-page.ts
 */

import { createClient } from "@sanity/client";
import * as dotenv from "dotenv";
import * as path from "path";

import { DEFAULT_SUBMISSIONS } from "../src/sanity/gtp-marketing-defaults";
import {
  DEFAULT_ABSTRACT_FORM_COPY,
  DEFAULT_WORKSHOP_FORM_COPY,
} from "../src/sanity/gtp-submissions-form-defaults";

dotenv.config({ path: path.join(process.cwd(), ".env.local") });

const DOC_ID = "gtp2026SubmissionsPage";

function buildWorkshopFormForSanity() {
  const w = DEFAULT_WORKSHOP_FORM_COPY;
  return {
    ...w,
    requirementsSections: w.requirementsSections.map((sec) => ({
      _type: "gtp2026SubmissionsRichSection" as const,
      title: sec.title,
      intro: sec.intro,
      footer: sec.footer,
      bullets: sec.bullets,
    })),
    evaluationGroups: w.evaluationGroups.map((g) => ({
      _type: "gtp2026SubmissionsEvalCriterionGroup" as const,
      title: g.title,
      items: g.items,
    })),
  };
}

function buildDocument() {
  const d = DEFAULT_SUBMISSIONS;
  return {
    _id: DOC_ID,
    _type: "gtp2026SubmissionsPage" as const,
    internalTitle: "Submissions",
    heroTitle: d.heroTitle,
    heroLede: d.heroLede,
    heroTitleSize: d.heroTitleSize,
    pillarsIntroBold: d.pillarsIntroBold,
    pillarsIntro: d.pillarsIntro,
    pillarsOutro: d.pillarsOutro,
    pillarsLinkLabel: d.pillarsLinkLabel,
    pillarsLinkUrl: d.pillarsLinkUrl,
    pillars: d.pillars.map((p) => ({
      _type: "gtp2026SubmissionsPillarSlot" as const,
      title: p.title,
      body: p.body,
    })),
    themesSectionTitle: d.themesSectionTitle,
    themesIntro: d.themesIntro,
    themes: d.themes.map((t) => ({
      _type: "gtp2026SubmissionsThemeSlot" as const,
      title: t.title,
      body: t.body,
    })),
    ctaTitle: d.ctaTitle,
    ctaSubtitle: d.ctaSubtitle,
    abstractTabLabel: d.abstractTabLabel,
    abstractDeadline: d.abstractDeadline,
    workshopTabLabel: d.workshopTabLabel,
    workshopDeadline: d.workshopDeadline,
    abstractFormIntro: d.abstractFormIntro,
    workshopFormIntro: d.workshopFormIntro,
    backToTopLabel: d.backToTopLabel,
    abstractForm: { ...DEFAULT_ABSTRACT_FORM_COPY },
    workshopForm: buildWorkshopFormForSanity(),
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

  await client
    .transaction()
    .createOrReplace(doc)
    .commit({ autoGenerateArrayKeys: true });
  console.log(
    `Upserted ${DOC_ID} on dataset "${dataset}". Open Studio (same dataset) and Publish if needed.`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
