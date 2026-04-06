/**
 * Repo defaults → Sanity `gtp2026RegisterPage` singleton
 *
 * Source: src/sanity/gtp-marketing-defaults.ts (same copy as mergeGtpRegisterCopy fallbacks).
 * Idempotent: fixed _id `gtp2026RegisterPage` with createOrReplace.
 *
 * Prerequisites: SANITY_API_TOKEN in .env.local (Editor+).
 * Dataset: SANITY_DATASET from .env.local (default production).
 *
 * Usage:
 *   npx tsx scripts/seed-gtp-register-page.ts
 *   DRY_RUN=1 npx tsx scripts/seed-gtp-register-page.ts
 */

import { createClient } from "@sanity/client";
import * as dotenv from "dotenv";
import * as path from "path";

import { DEFAULT_REGISTER } from "../src/sanity/gtp-marketing-defaults";

dotenv.config({ path: path.join(process.cwd(), ".env.local") });

const DOC_ID = "gtp2026RegisterPage";

function buildDocument() {
  const d = DEFAULT_REGISTER;
  return {
    _id: DOC_ID,
    _type: "gtp2026RegisterPage" as const,
    internalTitle: "Register",
    heroTitle: d.heroTitle,
    heroLede: d.heroLede,
    sectionTitle: d.sectionTitle,
    sectionSubtitle: d.sectionSubtitle,
    bodyLead: d.bodyLead,
    bodyHighlight: d.bodyHighlight,
    bodyMore: d.bodyMore,
    primaryCtaLabel: d.primaryCtaLabel,
    secondaryCtaLabel: d.secondaryCtaLabel,
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
