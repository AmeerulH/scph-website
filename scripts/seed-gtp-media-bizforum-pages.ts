/**
 * Minimal Sanity singletons for GTP 2026 Media and Business forum pages, plus About.
 *
 * Upserts `gtp2026MediaPage`, `gtp2026BizForumPage`, and `gtp2026AboutPage` with fixed
 * _id matching _type. About payload is built by `scripts/lib/gtp-about-page-seed-doc.ts`
 * (same as `npm run seed-gtp-about-page`). Run `cd studio && npx sanity schema deploy`
 * after schema changes.
 *
 * Prerequisites: SANITY_API_TOKEN in .env.local (Editor+).
 * Dataset: SANITY_DATASET from .env.local (default production).
 *
 * Usage:
 *   npm run seed-gtp-media-bizforum-pages
 *   DRY_RUN=1 npm run seed-gtp-media-bizforum-pages
 */

import { createClient, type SanityClient } from "@sanity/client";
import * as dotenv from "dotenv";
import * as path from "path";

import {
  buildGtpAboutPageSeedDocument,
  GTP_ABOUT_PAGE_DOCUMENT_ID,
} from "./lib/gtp-about-page-seed-doc";

dotenv.config({ path: path.join(process.cwd(), ".env.local") });

const MEDIA_ID = "gtp2026MediaPage";
const BIZ_ID = "gtp2026BizForumPage";

async function buildDocuments(
  client: SanityClient | null,
  dryRun: boolean,
): Promise<Record<string, unknown>[]> {
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

  const about = await buildGtpAboutPageSeedDocument(client, dryRun);

  return [media, bizForum, about];
}

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
      "SANITY_API_TOKEN is not set. Add it to .env.local (see import-gtp-programme-to-sanity.ts).",
    );
    process.exit(1);
  }

  const docs = await buildDocuments(client, dryRun);

  if (dryRun) {
    console.log(JSON.stringify(docs, null, 2));
    return;
  }

  let tx = client!.transaction();
  for (const doc of docs) {
    tx = tx.createOrReplace(
      doc as unknown as {_id: string; _type: string} & Record<string, unknown>,
    );
  }
  await tx.commit({ autoGenerateArrayKeys: true });

  console.log(
    `Upserted ${MEDIA_ID}, ${BIZ_ID}, and ${GTP_ABOUT_PAGE_DOCUMENT_ID} on dataset "${process.env.SANITY_DATASET ?? "production"}". Open Studio and Publish if needed.`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
