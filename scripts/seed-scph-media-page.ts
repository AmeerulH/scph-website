/**
 * Seeds the SCPH Media singleton (`scphMediaPage`) with hero copy, article cards,
 * and footer link defaults (matches previous hardcoded `/media` content).
 *
 * Idempotent: `_id` = `scphMediaPage`; one transaction.
 *
 * Prerequisites: SANITY_API_TOKEN in .env.local (Editor+).
 * Dataset: SANITY_DATASET from .env.local (default production).
 *
 * Usage:
 *   npx tsx scripts/seed-scph-media-page.ts
 *   DRY_RUN=1 npx tsx scripts/seed-scph-media-page.ts
 */

import { createClient } from "@sanity/client";
import * as dotenv from "dotenv";
import * as path from "path";
import {
  SCPH_MEDIA_ARTICLES_DEFAULT,
  SCPH_MEDIA_PAGE_DEFAULTS,
} from "../src/data/scph-media-page-defaults";

dotenv.config({ path: path.join(process.cwd(), ".env.local") });

const mediaDoc = {
  _id: "scphMediaPage",
  _type: "scphMediaPage" as const,
  internalTitle: "Media page",
  heroEyebrow: SCPH_MEDIA_PAGE_DEFAULTS.heroEyebrow,
  heroTitle: SCPH_MEDIA_PAGE_DEFAULTS.heroTitle,
  heroLede: SCPH_MEDIA_PAGE_DEFAULTS.heroLede,
  articlesSectionTitle: SCPH_MEDIA_PAGE_DEFAULTS.articlesSectionTitle,
  articlesSectionSubtitle: SCPH_MEDIA_PAGE_DEFAULTS.articlesSectionSubtitle,
  viewAllArticlesUrl: SCPH_MEDIA_PAGE_DEFAULTS.viewAllArticlesUrl,
  viewAllArticlesLabel: SCPH_MEDIA_PAGE_DEFAULTS.viewAllArticlesLabel,
  readArticleLabel: SCPH_MEDIA_PAGE_DEFAULTS.readArticleLabel,
  articlesIntroNote: SCPH_MEDIA_PAGE_DEFAULTS.articlesIntroNote,
  articles: SCPH_MEDIA_ARTICLES_DEFAULT.map((a, i) => ({
    _key: `article-${i}`,
    title: a.title,
    tag: a.tag,
    body: a.body,
  })),
  sections: [] as const,
};

async function main() {
  if (process.env.DRY_RUN) {
    console.log(JSON.stringify(mediaDoc, null, 2));
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

  await client.createOrReplace(mediaDoc);

  console.log(
    `Upserted scphMediaPage on dataset "${dataset}". Deploy schema, then Publish in Studio.`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
