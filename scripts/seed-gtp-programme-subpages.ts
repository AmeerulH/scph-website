/**
 * Creates the three GTP programme-activity page documents if missing.
 *
 * This script refuses `production`: it is for preview/test datasets. Editors own
 * published content, so it never overwrites a document that already exists.
 *
 * Usage:
 *   SANITY_DATASET=development npm run seed-gtp-programme-subpages
 *   SANITY_DATASET=development DRY_RUN=1 npm run seed-gtp-programme-subpages
 */

import { createClient } from "@sanity/client";
import * as dotenv from "dotenv";
import * as path from "path";
import { DEFAULT_GTP_PROGRAMME_ACTIVITY_PAGES } from "../src/data/gtp-programme-activity-defaults";

dotenv.config({ path: path.join(process.cwd(), ".env.local") });

const dataset = process.env.SANITY_DATASET ?? "production";

function buildDocuments() {
  return Object.values(DEFAULT_GTP_PROGRAMME_ACTIVITY_PAGES).map((page) => ({
    _id: `gtp2026ProgrammeActivityPage-${page.slug}`,
    _type: "gtp2026ProgrammeActivityPage" as const,
    internalTitle: page.pageTitle,
    pageTitle: page.pageTitle,
    slug: page.slug,
    heroLede: page.heroLede,
    intro: page.intro,
    registrationStatus: page.registrationStatus,
    registrationLabel: page.registrationLabel,
    registrationUrl: page.registrationUrl,
    entries: page.entries.map((entry, index) => ({
      _key: `${page.slug}-${index + 1}`,
      _type: "gtpProgrammeActivityEntry",
      title: entry.title,
      dateLabel: entry.dateLabel,
      description: entry.description,
    })),
  }));
}

async function main() {
  const docs = buildDocuments();
  if (process.env.DRY_RUN) {
    console.log(JSON.stringify(docs, null, 2));
    return;
  }
  if (dataset === "production") {
    throw new Error("Refusing to seed production. Set SANITY_DATASET to a test dataset.");
  }
  const token = process.env.SANITY_API_TOKEN?.trim();
  if (!token) throw new Error("SANITY_API_TOKEN is not set.");

  const client = createClient({
    projectId: "y0tkemxm",
    dataset,
    apiVersion: "2024-01-01",
    token,
    useCdn: false,
  });
  const tx = docs.reduce(
    (transaction, document) => transaction.createIfNotExists(document),
    client.transaction(),
  );
  await tx.commit({ autoGenerateArrayKeys: true });
  console.log(`Created missing programme activity pages in "${dataset}".`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
