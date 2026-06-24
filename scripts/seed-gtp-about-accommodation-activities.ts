/**
 * Upserts `gtp2026AboutPage.accommodationActivitiesBand` (carousel cards + copy).
 * Does not replace other About bands — patches only this section on published + draft.
 *
 * Usage:
 *   npm run seed-gtp-about-accommodation-activities
 *   DRY_RUN=1 npm run seed-gtp-about-accommodation-activities
 */

import { createClient } from "@sanity/client";
import * as dotenv from "dotenv";
import * as path from "path";

import { patchGtpAboutAccommodationActivitiesBand } from "./lib/gtp-about-page-seed-doc";

dotenv.config({ path: path.join(process.cwd(), ".env.local") });

async function main() {
  const dryRun = Boolean(process.env.DRY_RUN);
  const dataset = process.env.SANITY_DATASET ?? "production";

  if (!dryRun && !process.env.SANITY_API_TOKEN) {
    console.error(
      "SANITY_API_TOKEN is not set. Add it to .env.local (see other seed scripts).",
    );
    process.exit(1);
  }

  const client = createClient({
    projectId: "y0tkemxm",
    dataset,
    apiVersion: "2024-01-01",
    token: process.env.SANITY_API_TOKEN || undefined,
    useCdn: false,
  });

  const patchedIds = await patchGtpAboutAccommodationActivitiesBand(client, dryRun);

  if (!dryRun) {
    console.log(
      `Done. Patched: ${patchedIds.join(", ")}. Open Studio → GTP About → Publish.`,
    );
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
