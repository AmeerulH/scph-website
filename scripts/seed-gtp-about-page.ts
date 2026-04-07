/**
 * Upserts `gtp2026AboutPage` only (full bands from repo defaults + PIK sponsor upload).
 *
 * Use this when you need to refresh About without touching Media or Business forum shells.
 * Shared payload: `scripts/lib/gtp-about-page-seed-doc.ts`.
 *
 * Prerequisites: SANITY_API_TOKEN in .env.local (Editor+).
 * Dataset: SANITY_DATASET from .env.local (default production).
 *
 * Usage:
 *   npm run seed-gtp-about-page
 *   DRY_RUN=1 npm run seed-gtp-about-page
 */

import { createClient } from "@sanity/client";
import * as dotenv from "dotenv";
import * as path from "path";

import {
  buildGtpAboutPageSeedDocument,
  GTP_ABOUT_PAGE_DOCUMENT_ID,
} from "./lib/gtp-about-page-seed-doc";

dotenv.config({ path: path.join(process.cwd(), ".env.local") });

async function main() {
  const dryRun = Boolean(process.env.DRY_RUN);

  const client =
    !dryRun && process.env.SANITY_API_TOKEN
      ? createClient({
          projectId: "y0tkemxm",
          dataset: process.env.SANITY_DATASET ?? "production",
          apiVersion: "2024-01-01",
          token: process.env.SANITY_API_TOKEN,
          useCdn: false,
        })
      : null;

  if (!dryRun && !process.env.SANITY_API_TOKEN) {
    console.error(
      "SANITY_API_TOKEN is not set. Add it to .env.local (see other seed scripts).",
    );
    process.exit(1);
  }

  const doc = await buildGtpAboutPageSeedDocument(client, dryRun);

  if (dryRun) {
    console.log(JSON.stringify(doc, null, 2));
    return;
  }

  await client!
    .transaction()
    .createOrReplace(
      doc as unknown as {_id: string; _type: string} & Record<string, unknown>,
    )
    .commit({ autoGenerateArrayKeys: true });

  console.log(
    `Upserted ${GTP_ABOUT_PAGE_DOCUMENT_ID} on dataset "${process.env.SANITY_DATASET ?? "production"}". Open Studio and Publish if needed.`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
