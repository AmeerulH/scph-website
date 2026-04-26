/**
 * Repo defaults → Sanity `scphJournalistWorkshopsPage` singleton (/network/journalist-workshops).
 *
 * Idempotent: fixed _id `scphJournalistWorkshopsPage` with createOrReplace.
 * Add workshop rows (code + Drive folder id) in Studio after seed; publish to go live.
 *
 * Prerequisites: SANITY_API_TOKEN in .env.local (Editor+).
 * Dataset: SANITY_DATASET from .env.local (default production).
 *
 * After schema changes: `cd studio && npx sanity schema deploy`
 *
 * Usage:
 *   npm run seed-scph-journalist-workshops-page
 *   DRY_RUN=1 npm run seed-scph-journalist-workshops-page
 */

import { createClient } from "@sanity/client";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env.local") });

const DOC_ID = "scphJournalistWorkshopsPage";

function buildDocument() {
  return {
    _id: DOC_ID,
    _type: "scphJournalistWorkshopsPage" as const,
    internalTitle: "Journalist workshops",
    pageTitle: "Journalist workshops",
    intro: "",
    workshops: [],
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
      "SANITY_API_TOKEN is not set. Add it to .env.local (see other seed scripts).",
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
    `Upserted ${DOC_ID} on dataset "${dataset}". Open Studio → SCPH Journalist workshops → add workshop rows → Publish.`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
