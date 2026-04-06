/**
 * Minimal Sanity singletons for GTP 2026 Media and Business forum routes
 *
 * Upserts `gtp2026MediaPage` and `gtp2026BizForumPage` with fixed _id matching _type,
 * placeholder copy, empty `sections`. Editors add section blocks in Studio when ready.
 *
 * Prerequisites: SANITY_API_TOKEN in .env.local (Editor+).
 * Dataset: SANITY_DATASET from .env.local (default production).
 *
 * Usage:
 *   npx tsx scripts/seed-gtp-media-bizforum-pages.ts
 *   DRY_RUN=1 npx tsx scripts/seed-gtp-media-bizforum-pages.ts
 */

import { createClient } from "@sanity/client";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env.local") });

const MEDIA_ID = "gtp2026MediaPage";
const BIZ_ID = "gtp2026BizForumPage";

function buildDocuments() {
  const media = {
    _id: MEDIA_ID,
    _type: "gtp2026MediaPage" as const,
    internalTitle: "Media",
    pageTitle: "Media",
    heroLede:
      "Press enquiries, accreditation, and resources for covering Global Tipping Points Conference 2026 in Kuala Lumpur.",
    placeholderDescription:
      "Media kits, spokesperson contacts, and downloadable assets will be published here closer to the conference. For urgent press enquiries, use the contact options on the Get involved page.",
    sections: [],
  };

  const bizForum = {
    _id: BIZ_ID,
    _type: "gtp2026BizForumPage" as const,
    internalTitle: "Business forum",
    pageTitle: "Business forum",
    heroLede:
      "Finance and private sector dialogue at Global Tipping Points Conference 2026—partnerships and insights for positive tipping points.",
    placeholderDescription:
      "Programming, participation details, and partnership opportunities for the business forum will be announced here. Check back or contact the team via Get involved for early interest.",
    sections: [],
  };

  return [media, bizForum];
}

async function main() {
  const docs = buildDocuments();

  if (process.env.DRY_RUN) {
    console.log(JSON.stringify(docs, null, 2));
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

  let tx = client.transaction();
  for (const doc of docs) {
    tx = tx.createOrReplace(
      doc as unknown as {_id: string; _type: string} & Record<string, unknown>,
    );
  }
  await tx.commit({ autoGenerateArrayKeys: true });

  console.log(
    `Upserted ${MEDIA_ID} and ${BIZ_ID} on dataset "${dataset}". Open Studio and Publish if needed.`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
