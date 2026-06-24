/**
 * Gallery-only alias — runs the full About page image patch (gallery + other bands).
 * Prefer: `npm run seed-gtp-about-page-images`
 */

import { createClient } from "@sanity/client";
import * as dotenv from "dotenv";
import * as path from "path";

import { patchGtpAboutPageImages } from "./lib/gtp-about-page-seed-doc";

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

  console.log(
    `Note: this script now patches all GTP About image bands. Use seed-gtp-about-page-images for the same behaviour.\n` +
      `Uploading on dataset "${dataset}"…`,
  );

  const patchedIds = await patchGtpAboutPageImages(client, dryRun);

  if (!dryRun) {
    console.log(`Done. Patched: ${patchedIds.join(", ")}.`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
