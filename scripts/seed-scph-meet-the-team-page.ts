/**
 * Repo defaults → Sanity `scphMeetTheTeamPage` singleton (Meet the Team chrome on /about-us).
 *
 * Field values match [`studio/schemaTypes/scphMeetTheTeamPageType.ts`](studio/schemaTypes/scphMeetTheTeamPageType.ts)
 * `initialValue`s and the JSX fallbacks in [`src/app/(scph)/about-us/page.tsx`](src/app/(scph)/about-us/page.tsx).
 * Roster rows remain `teamMember` docs (`import-team-to-sanity.js`).
 *
 * Idempotent: fixed _id `scphMeetTheTeamPage` with createOrReplace.
 *
 * Prerequisites: SANITY_API_TOKEN in .env.local (Editor+).
 * Dataset: SANITY_DATASET from .env.local (default production).
 *
 * Usage:
 *   npx tsx scripts/seed-scph-meet-the-team-page.ts
 *   DRY_RUN=1 npx tsx scripts/seed-scph-meet-the-team-page.ts
 */

import { createClient } from "@sanity/client";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env.local") });

const DOC_ID = "scphMeetTheTeamPage";

function buildDocument() {
  return {
    _id: DOC_ID,
    _type: "scphMeetTheTeamPage" as const,
    internalTitle: "Meet the Team",
    sectionTitle: "Meet the Team",
    sectionSubtitle: "Our Team",
    showGetInvolvedCta: true,
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
