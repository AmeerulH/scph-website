/**
 * Seeds copy + empty album shells for `gtp2026MediaPage` WITHOUT overwriting editor content.
 *
 * Uses createIfNotExists + setIfMissing: existing fields (including uploaded photos,
 * podcast/video entries and any edited copy) are never replaced. Images are not seeded;
 * the site shows GTP 2025 placeholder photos until albums are filled in Studio.
 *
 * Prerequisites: SANITY_API_TOKEN in .env.local (Editor+), schema deployed
 * (`cd studio && npx sanity schema deploy`).
 * Refuses to run against `production` unless ALLOW_PRODUCTION=1.
 *
 * Usage:
 *   DRY_RUN=1 npm run seed-gtp-media-page
 *   SANITY_DATASET=development npm run seed-gtp-media-page
 */

import { createClient } from "@sanity/client";
import * as dotenv from "dotenv";
import * as path from "path";

import { GTP_MEDIA_DEFAULTS } from "../src/data/gtp-media-page-defaults";

dotenv.config({ path: path.join(process.cwd(), ".env.local") });

const DOC_ID = "gtp2026MediaPage";

function buildFields() {
  const d = GTP_MEDIA_DEFAULTS;
  return {
    internalTitle: "Media",
    pageTitle: d.hero.title,
    heroLede: d.hero.lede,
    photosTitle: d.photos.title,
    photosIntro: d.photos.intro.join("\n\n"),
    photoAlbums: d.photos.albums.map((a) => ({
      _type: "gtpMediaPhotoAlbum",
      title: a.title,
      ...(a.dateLabel ? { dateLabel: a.dateLabel } : {}),
      photos: [],
      driveLinks: [],
    })),
    podcastsTitle: d.podcasts.title,
    podcastsIntro: d.podcasts.intro.join("\n\n"),
    videosTitle: d.videos.title,
    videosIntro: d.videos.intro.join("\n\n"),
    ...(d.videos.channelUrl ? { youtubeChannelUrl: d.videos.channelUrl } : {}),
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

  await client.createIfNotExists({ _id: DOC_ID, _type: "gtp2026MediaPage" });
  await client.patch(DOC_ID).setIfMissing(fields).commit({ autoGenerateArrayKeys: true });
  console.log(
    `Seeded missing fields on ${DOC_ID} (dataset "${dataset}"). Existing content was left untouched. Publish in Studio if needed.`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
