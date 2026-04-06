/**
 * Minimal Sanity singletons for GTP 2026 Media, Business forum, and About (CMS bands)
 *
 * Upserts `gtp2026MediaPage`, `gtp2026BizForumPage`, and `gtp2026AboutPage` with fixed
 * _id matching _type. About document includes full page bands (hero through sponsors)
 * from repo defaults, including **PIK** under `sponsorsBand.sponsors` (logo uploaded
 * from `public/images/gtp/logos/pik-logo.png`). Run `cd studio && npx sanity schema deploy`
 * after schema changes.
 *
 * Prerequisites: SANITY_API_TOKEN in .env.local (Editor+).
 * Dataset: SANITY_DATASET from .env.local (default production).
 *
 * Usage:
 *   npx tsx scripts/seed-gtp-media-bizforum-pages.ts
 *   DRY_RUN=1 npx tsx scripts/seed-gtp-media-bizforum-pages.ts
 */

import { createClient, type SanityClient } from "@sanity/client";
import * as dotenv from "dotenv";
import * as fs from "fs";
import * as path from "path";

import {
  DEFAULT_GTP_ABOUT_HERO,
  DEFAULT_GTP_EVENT_INQUIRY,
  DEFAULT_GTP_GALLERY_BAND,
  DEFAULT_GTP_QUOTES_BAND,
  DEFAULT_GTP_SPEAKERS_CHROME,
  DEFAULT_GTP_SPONSORS_BAND,
  DEFAULT_GTP_THEMES_BAND,
  DEFAULT_GTP_WHAT_IS_BAND,
  DEFAULT_GTP_WHY_MATTERS,
  GTP_ABOUT_PIK_SPONSOR_SEED,
} from "../src/data/gtp-about-page-defaults";

dotenv.config({ path: path.join(process.cwd(), ".env.local") });

const PUBLIC_DIR = path.join(process.cwd(), "public");

const MEDIA_ID = "gtp2026MediaPage";
const BIZ_ID = "gtp2026BizForumPage";
const ABOUT_ID = "gtp2026AboutPage";

async function uploadImage(
  client: SanityClient,
  imagePath: string,
  label: string,
): Promise<{ _type: "image"; asset: { _type: "reference"; _ref: string } } | null> {
  const localPath = path.join(PUBLIC_DIR, imagePath.replace(/^\//, ""));

  if (!fs.existsSync(localPath)) {
    console.warn(`   ⚠️  Image not found, skipping: ${localPath}`);
    return null;
  }

  const ext = path.extname(localPath).replace(".", "") || "png";
  const fileStream = fs.createReadStream(localPath);

  try {
    const asset = await client.assets.upload("image", fileStream, {
      filename: path.basename(localPath),
      contentType: `image/${ext === "jpg" ? "jpeg" : ext}`,
    });
    console.log(`   ✅ Sponsor logo uploaded (${label}): ${asset._id}`);
    return {
      _type: "image",
      asset: { _type: "reference", _ref: asset._id },
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.warn(`   ⚠️  Image upload failed (${label}): ${msg}`);
    return null;
  }
}

async function buildPikSponsorEntries(
  client: SanityClient | null,
  dryRun: boolean,
): Promise<Record<string, unknown>[]> {
  const pik = GTP_ABOUT_PIK_SPONSOR_SEED;

  if (dryRun) {
    return [
      {
        _type: "gtpAboutSponsorLogo",
        _key: "seed-pik",
        name: pik.name,
        href: pik.href,
        _dryRunNote: "logo would upload from public",
        logoPath: pik.logoPublicPath,
      },
    ];
  }

  if (!client) return [];

  const logo = await uploadImage(client, pik.logoPublicPath, pik.name);
  if (!logo) {
    console.warn(
      "   ⚠️  PIK logo missing; sponsorsBand.sponsors will be empty (site falls back to JSX strip).",
    );
    return [];
  }

  return [
    {
      _type: "gtpAboutSponsorLogo",
      _key: "seed-pik",
      name: pik.name,
      href: pik.href,
      logo,
    },
  ];
}

async function buildAboutDocument(
  client: SanityClient | null,
  dryRun: boolean,
): Promise<Record<string, unknown>> {
  const what = DEFAULT_GTP_WHAT_IS_BAND;
  const why = DEFAULT_GTP_WHY_MATTERS;
  const sponsors = await buildPikSponsorEntries(client, dryRun);

  return {
    _id: ABOUT_ID,
    _type: "gtp2026AboutPage",
    internalTitle: "GTP About",
    heroBand: { ...DEFAULT_GTP_ABOUT_HERO },
    whatIsBand: {
      eyebrow: what.eyebrow,
      title: what.title,
      body: `${what.bodyParagraphs[0]}\n\n${what.bodyParagraphs[1]}`,
      quote: what.quote,
      learnMoreIntro: what.learnMoreIntro,
      learnMoreLinkLabel: what.learnMoreLinkLabel,
      learnMoreLinkUrl: what.learnMoreLinkUrl,
      downloadButtonLabel: what.downloadButtonLabel,
      downloadButtonUrl: what.downloadButtonUrl,
    },
    whyMattersBand: {
      eyebrow: why.eyebrow,
      title: why.title,
      body: why.bodyParagraphs.join("\n\n"),
      ctaLabel: why.ctaLabel,
      ctaHref: why.ctaHref,
      tallImageSrc: why.tallImageSrc,
      topRightImageSrc: why.topRightImageSrc,
      bottomRightImageSrc: why.bottomRightImageSrc,
      tallImageAlt: why.tallImageAlt,
      topRightImageAlt: why.topRightImageAlt,
      bottomRightImageAlt: why.bottomRightImageAlt,
    },
    themesBand: {
      title: DEFAULT_GTP_THEMES_BAND.title,
      subtitle: DEFAULT_GTP_THEMES_BAND.subtitle,
      footerBlurb: DEFAULT_GTP_THEMES_BAND.footerBlurb,
      themes: DEFAULT_GTP_THEMES_BAND.themes.map((t) => ({
        num: t.num,
        title: t.title,
        body: t.body,
        icon: t.icon,
      })),
    },
    speakersChrome: { ...DEFAULT_GTP_SPEAKERS_CHROME },
    quotesBand: {
      title: DEFAULT_GTP_QUOTES_BAND.title,
      subtitle: DEFAULT_GTP_QUOTES_BAND.subtitle,
      quotes: DEFAULT_GTP_QUOTES_BAND.quotes.map((q) => ({
        name: q.name,
        designation: q.designation,
        quote: q.quote,
        photoSrc: q.photoSrc,
        ...(q.avatarObjectClass
          ? { avatarObjectClass: q.avatarObjectClass }
          : {}),
        ...(q.avatarScaleClass ? { avatarScaleClass: q.avatarScaleClass } : {}),
      })),
    },
    galleryBand: {
      title: DEFAULT_GTP_GALLERY_BAND.title,
      subtitle: DEFAULT_GTP_GALLERY_BAND.subtitle,
      footerText: DEFAULT_GTP_GALLERY_BAND.footerText,
      footerLinkLabel: DEFAULT_GTP_GALLERY_BAND.footerLinkLabel,
      footerLinkHref: DEFAULT_GTP_GALLERY_BAND.footerLinkHref,
      slides: DEFAULT_GTP_GALLERY_BAND.slides.map((s) => ({
        src: s.src,
        alt: s.alt,
      })),
    },
    eventInquiryBand: { ...DEFAULT_GTP_EVENT_INQUIRY },
    sponsorsBand: {
      title: DEFAULT_GTP_SPONSORS_BAND.title,
      subtitle: DEFAULT_GTP_SPONSORS_BAND.subtitle,
      noticeBeforeLink: DEFAULT_GTP_SPONSORS_BAND.noticeBeforeLink,
      noticeLinkText: DEFAULT_GTP_SPONSORS_BAND.noticeLinkText,
      noticeLinkHref: DEFAULT_GTP_SPONSORS_BAND.noticeLinkHref,
      sponsors,
    },
    sections: [],
  };
}

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

  const about = await buildAboutDocument(client, dryRun);

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
    `Upserted ${MEDIA_ID}, ${BIZ_ID}, and ${ABOUT_ID} on dataset "${process.env.SANITY_DATASET ?? "production"}". Open Studio and Publish if needed.`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
