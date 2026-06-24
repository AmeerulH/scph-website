/**
 * Repo defaults → Sanity `gtp2026SpeakersPage` singleton
 *
 * Seeds the hero copy for /events/gtp-2026/speakers.
 * Hero photo is optional in Studio; when missing, the site uses
 * `public/images/gtp/speakers/speaker-mic-hero.jpg`.
 * Idempotent: fixed _id `gtp2026SpeakersPage` with createOrReplace.
 *
 * Prerequisites: SANITY_API_TOKEN in .env.local (Editor+).
 * Dataset: SANITY_DATASET from .env.local (default production).
 *
 * Usage:
 *   npm run seed-gtp-speakers-page
 *   DRY_RUN=1 npm run seed-gtp-speakers-page
 */

import { createClient } from "@sanity/client";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env.local") });

const DOC_ID = "gtp2026SpeakersPage";

function buildDocument() {
  return {
    _id: DOC_ID,
    _type: "gtp2026SpeakersPage" as const,
    internalTitle: "Speakers page",
    heroLabel: "Global Tipping Points 2026",
    heroHeading: "Our Speakers",
    heroDescription:
      "GTP 2026 brings together leading scientists, policymakers, and innovators from across the globe. Over four days in Kuala Lumpur, they will share breakthroughs, challenge assumptions, and chart a course for positive tipping points on climate, biodiversity, and planetary health.",
    heroDateLocation: "12–15 October 2026 · Kuala Lumpur, Malaysia",
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
      "SANITY_API_TOKEN is not set. Add it to .env.local (Editor+ role required).",
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
    `Upserted ${DOC_ID} on dataset "${dataset}". Open Studio and Publish to make it live.`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
