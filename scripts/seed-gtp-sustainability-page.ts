/**
 * Seeds copy for the `gtp2026SustainabilityPage` singleton WITHOUT overwriting editor content.
 *
 * Uses createIfNotExists + setIfMissing: anything already in the document (including
 * uploaded images and edited commitments) is left alone. Images are not seeded; the site
 * shows static fallback photos until images are uploaded in Studio.
 *
 * Prerequisites: SANITY_API_TOKEN in .env.local (Editor+), schema deployed
 * (`cd studio && npx sanity schema deploy`).
 * Refuses to run against `production` unless ALLOW_PRODUCTION=1.
 *
 * Usage:
 *   DRY_RUN=1 npm run seed-gtp-sustainability-page
 *   SANITY_DATASET=development npm run seed-gtp-sustainability-page
 */

import { createClient } from "@sanity/client";
import * as dotenv from "dotenv";
import * as path from "path";

import { GTP_SUSTAINABILITY_DEFAULTS } from "../src/data/gtp-sustainability-page-defaults";

dotenv.config({ path: path.join(process.cwd(), ".env.local") });

const DOC_ID = "gtp2026SustainabilityPage";

function buildFields() {
  const d = GTP_SUSTAINABILITY_DEFAULTS;
  return {
    internalTitle: "Sustainability",
    pageTitle: d.title,
    seoDescription: d.seoDescription,
    introLead: d.introLead,
    introBody: d.introBody.join("\n\n"),
    commitmentsTitle: d.commitmentsTitle,
    commitments: d.commitments.map((c) => ({
      _type: "gtpSustainabilityCommitment",
      category: c.category,
      headline: c.headline,
      body: c.body,
      ...(c.link ? { link: c.link } : {}),
    })),
    homeTeaserEnabled: d.teaser.enabled,
    homeTeaserTitle: d.teaser.title,
    homeTeaserBody: d.teaser.body,
  };
}

async function main() {
  const dataset = process.env.SANITY_DATASET ?? "production";
  const fields = buildFields();

  if (process.env.DRY_RUN) {
    console.log(JSON.stringify({ _id: DOC_ID, dataset, setIfMissing: fields }, null, 2));
    return;
  }
  if (!process.env.SANITY_API_TOKEN) {
    console.error("SANITY_API_TOKEN is not set. Add it to .env.local.");
    process.exit(1);
  }
  if (dataset === "production" && !process.env.ALLOW_PRODUCTION) {
    console.error(
      'Refusing to write to "production". Use SANITY_DATASET=development, or set ALLOW_PRODUCTION=1 after exporting current CMS state.',
    );
    process.exit(1);
  }

  const client = createClient({
    projectId: "y0tkemxm",
    dataset,
    apiVersion: "2024-01-01",
    token: process.env.SANITY_API_TOKEN,
    useCdn: false,
  });

  await client.createIfNotExists({ _id: DOC_ID, _type: "gtp2026SustainabilityPage" });
  await client.patch(DOC_ID).setIfMissing(fields).commit({ autoGenerateArrayKeys: true });
  console.log(
    `Seeded missing fields on ${DOC_ID} (dataset "${dataset}"). Existing content was left untouched. Publish in Studio if needed.`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
