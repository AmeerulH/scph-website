/**
 * Seeds copy for the `gtp2026BookLaunchPage` singleton WITHOUT overwriting editor content.
 *
 * Uses createIfNotExists + setIfMissing: anything already in the document (including uploaded
 * images and edited copy) is left alone. Images are not seeded; the site shows designed
 * fallbacks until they are uploaded in Studio. Book title, date, time, venue and the
 * registration link are deliberately left empty for the team to enter.
 *
 * Prerequisites: SANITY_API_TOKEN in .env.local (Editor+), schema deployed
 * (`cd studio && npx sanity schema deploy`).
 * Refuses to run against `production` unless ALLOW_PRODUCTION=1.
 *
 * Usage:
 *   DRY_RUN=1 npm run seed-gtp-book-launch-page
 *   SANITY_DATASET=development npm run seed-gtp-book-launch-page
 */

import { createClient } from "@sanity/client";
import * as dotenv from "dotenv";
import * as path from "path";

import { GTP_BOOK_LAUNCH_DEFAULTS } from "../src/data/gtp-book-launch-page-defaults";

dotenv.config({ path: path.join(process.cwd(), ".env.local") });

const DOC_ID = "gtp2026BookLaunchPage";

function buildFields() {
  const d = GTP_BOOK_LAUNCH_DEFAULTS;
  return {
    internalTitle: "Book Launch",
    pageTitle: d.pageTitle,
    seoDescription: d.seoDescription,
    authorName: d.authorName,
    registrationLabel: d.registration.label,
    registrationPendingLabel: d.registration.pendingLabel,
    registrationClosed: d.registration.closed,
    introLead: d.introLead,
    body: d.body.join("\n\n"),
    authorRole: d.author.role,
    thanksEnabled: d.thanks.enabled,
    thanksTitle: d.thanks.title,
    thanksBody: d.thanks.body,
  };
}

async function main() {
  const dataset = process.env.SANITY_DATASET ?? "production";
  const fields = buildFields();

  if (process.env.DRY_RUN) {
    console.log(JSON.stringify({ _id: DOC_ID, dataset, setIfMissing: fields }, null, 2));
    return;
  }
  if (!process.env.SANITY_API_TOKEN) {
    console.error("SANITY_API_TOKEN is not set. Add it to .env.local.");
    process.exit(1);
  }
  if (dataset === "production" && !process.env.ALLOW_PRODUCTION) {
    console.error(
      'Refusing to write to "production". Use SANITY_DATASET=development, or set ALLOW_PRODUCTION=1 after exporting current CMS state.',
    );
    process.exit(1);
  }

  const client = createClient({
    projectId: "y0tkemxm",
    dataset,
    apiVersion: "2024-01-01",
    token: process.env.SANITY_API_TOKEN,
    useCdn: false,
  });

  await client.createIfNotExists({ _id: DOC_ID, _type: "gtp2026BookLaunchPage" });
  await client.patch(DOC_ID).setIfMissing(fields).commit();
  console.log(
    `Seeded missing fields on ${DOC_ID} (dataset "${dataset}"). Existing content was left untouched. Publish in Studio if needed.`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
