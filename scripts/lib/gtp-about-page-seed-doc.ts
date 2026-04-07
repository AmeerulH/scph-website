/**
 * Shared payload builder for `gtp2026AboutPage` Sanity upserts.
 * Used by `seed-gtp-about-page.ts` and `seed-gtp-media-bizforum-pages.ts`.
 */

import type { SanityClient } from "@sanity/client";
import * as fs from "fs";
import * as path from "path";

import {
  DEFAULT_GTP_ABOUT_HERO,
  DEFAULT_GTP_ABOUT_IMPORTANT_DATES,
  DEFAULT_GTP_EVENT_INQUIRY,
  DEFAULT_GTP_GALLERY_BAND,
  DEFAULT_GTP_QUOTES_BAND,
  DEFAULT_GTP_SPEAKERS_CHROME,
  DEFAULT_GTP_SPONSORS_BAND,
  DEFAULT_GTP_THEMES_BAND,
  DEFAULT_GTP_WHAT_IS_BAND,
  DEFAULT_GTP_WHY_MATTERS,
  GTP_ABOUT_PIK_SPONSOR_SEED,
} from "../../src/data/gtp-about-page-defaults";

export const GTP_ABOUT_PAGE_DOCUMENT_ID = "gtp2026AboutPage";

const publicDir = path.join(process.cwd(), "public");

async function uploadImage(
  client: SanityClient,
  imagePath: string,
  label: string,
): Promise<{ _type: "image"; asset: { _type: "reference"; _ref: string } } | null> {
  const localPath = path.join(publicDir, imagePath.replace(/^\//, ""));

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

/** Full singleton document for `createOrReplace` (fixed `_id`). */
export async function buildGtpAboutPageSeedDocument(
  client: SanityClient | null,
  dryRun: boolean,
): Promise<Record<string, unknown>> {
  const what = DEFAULT_GTP_WHAT_IS_BAND;
  const why = DEFAULT_GTP_WHY_MATTERS;
  const sponsors = await buildPikSponsorEntries(client, dryRun);

  return {
    _id: GTP_ABOUT_PAGE_DOCUMENT_ID,
    _type: "gtp2026AboutPage",
    internalTitle: "GTP About",
    heroBand: (() => {
      const { importantDates: _dates, ...heroRest } = DEFAULT_GTP_ABOUT_HERO;
      return {
        ...heroRest,
        importantDates: DEFAULT_GTP_ABOUT_IMPORTANT_DATES.map((row, i) => ({
          _type: "gtpFooterImportantDate" as const,
          _key: `hero-id-${i}`,
          label: row.label,
          dateText: row.date,
        })),
      };
    })(),
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
