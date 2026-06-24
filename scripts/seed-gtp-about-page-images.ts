/**
 * Re-upload GTP About page images and patch Sanity with proper asset references.
 *
 * Fixes legacy string paths (`*Src`, gallery `src`) on:
 * - galleryBand.slides → `image` + `alt`
 * - whyMattersBand → `tallImage`, `topRightImage`, `bottomRightImage`
 * - quotesBand.quotes → `photo`
 *
 * Patches both published and draft documents (Studio edits the draft).
 *
 * Prerequisites: SANITY_API_TOKEN in .env.local (Editor+).
 * Dataset: SANITY_DATASET from .env.local (default production).
 *
 * Usage:
 *   npm run seed-gtp-about-page-images
 *   DRY_RUN=1 npm run seed-gtp-about-page-images
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
    `Uploading GTP About images (gallery, why-matters, quotes) on dataset "${dataset}"…`,
  );

  const patchedIds = await patchGtpAboutPageImages(client, dryRun);

  if (!dryRun) {
    console.log(
      `Done. Patched: ${patchedIds.join(", ")}. Refresh Studio → GTP About → Publish.`,
    );
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
