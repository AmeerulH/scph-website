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
  DEFAULT_GTP_PARTNERS_BAND,
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
    console.log(`   ✅ Image uploaded (${label}): ${asset._id}`);
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

async function buildGallerySlides(
  client: SanityClient | null,
  dryRun: boolean,
): Promise<Record<string, unknown>[]> {
  const slides: Record<string, unknown>[] = [];

  for (let i = 0; i < DEFAULT_GTP_GALLERY_BAND.slides.length; i++) {
    const slide = DEFAULT_GTP_GALLERY_BAND.slides[i];
    const alt = slide.alt;

    if (dryRun) {
      slides.push({
        _type: "gtpAboutGallerySlide",
        _key: `gallery-slide-${i}`,
        alt,
        _dryRunNote: "image would upload from public",
        imagePath: slide.src,
      });
      continue;
    }

    if (!client) continue;

    const image = await uploadImage(client, slide.src, slide.alt);
    if (!image) {
      console.warn(`   ⚠️  Gallery slide skipped (upload failed): ${slide.alt}`);
      continue;
    }

    slides.push({
      _type: "gtpAboutGallerySlide",
      _key: `gallery-slide-${i}`,
      alt,
      image,
    });
  }

  return slides;
}

/** Upload gallery bento images and return Sanity slide rows (`image` + `alt`, no `src`). */
export async function buildGtpAboutGallerySlidesForSanity(
  client: SanityClient | null,
  dryRun: boolean,
): Promise<Record<string, unknown>[]> {
  return buildGallerySlides(client, dryRun);
}

async function buildWhyMattersImageFields(
  client: SanityClient | null,
  dryRun: boolean,
): Promise<Record<string, unknown>> {
  const why = DEFAULT_GTP_WHY_MATTERS;
  const fields: Record<string, unknown> = {
    tallImageAlt: why.tallImageAlt,
    topRightImageAlt: why.topRightImageAlt,
    bottomRightImageAlt: why.bottomRightImageAlt,
  };

  if (dryRun) {
    return {
      ...fields,
      _dryRunTallImagePath: why.tallImageSrc,
      _dryRunTopRightImagePath: why.topRightImageSrc,
      _dryRunBottomRightImagePath: why.bottomRightImageSrc,
    };
  }

  if (!client) return fields;

  const tallImage = await uploadImage(client, why.tallImageSrc, why.tallImageAlt);
  const topRightImage = await uploadImage(
    client,
    why.topRightImageSrc,
    why.topRightImageAlt,
  );
  const bottomRightImage = await uploadImage(
    client,
    why.bottomRightImageSrc,
    why.bottomRightImageAlt,
  );

  if (tallImage) fields.tallImage = tallImage;
  if (topRightImage) fields.topRightImage = topRightImage;
  if (bottomRightImage) fields.bottomRightImage = bottomRightImage;

  return fields;
}

async function buildQuoteCards(
  client: SanityClient | null,
  dryRun: boolean,
): Promise<Record<string, unknown>[]> {
  const quotes: Record<string, unknown>[] = [];

  for (let i = 0; i < DEFAULT_GTP_QUOTES_BAND.quotes.length; i++) {
    const q = DEFAULT_GTP_QUOTES_BAND.quotes[i];
    const row: Record<string, unknown> = {
      _type: "gtpAboutQuoteCard",
      _key: `quote-${i}`,
      name: q.name,
      designation: q.designation,
      quote: q.quote,
      ...(q.avatarObjectClass ? { avatarObjectClass: q.avatarObjectClass } : {}),
      ...(q.avatarScaleClass ? { avatarScaleClass: q.avatarScaleClass } : {}),
    };

    if (dryRun) {
      row._dryRunPhotoPath = q.photoSrc;
      quotes.push(row);
      continue;
    }

    if (!client) continue;

    const photo = await uploadImage(client, q.photoSrc, q.name);
    if (!photo) {
      console.warn(`   ⚠️  Quote photo skipped (upload failed): ${q.name}`);
      continue;
    }
    row.photo = photo;
    quotes.push(row);
  }

  return quotes;
}

/** Legacy string-path fields removed when migrating to Sanity image assets. */
export const GTP_ABOUT_LEGACY_IMAGE_FIELD_PATHS = [
  "whyMattersBand.tallImageSrc",
  "whyMattersBand.topRightImageSrc",
  "whyMattersBand.bottomRightImageSrc",
] as const;

/** Flat Sanity patch `.set()` payload for gallery, why-matters photos, and quote photos. */
export async function buildGtpAboutPageImagePatchSet(
  client: SanityClient | null,
  dryRun: boolean,
): Promise<Record<string, unknown>> {
  const slides = await buildGallerySlides(client, dryRun);
  const whyImages = await buildWhyMattersImageFields(client, dryRun);
  const quotes = await buildQuoteCards(client, dryRun);

  const setPatch: Record<string, unknown> = {
    "galleryBand.slides": slides,
    "quotesBand.quotes": quotes,
  };

  for (const [key, value] of Object.entries(whyImages)) {
    if (key.startsWith("_dryRun")) continue;
    setPatch[`whyMattersBand.${key}`] = value;
  }

  return setPatch;
}

export async function patchGtpAboutPageImages(
  client: SanityClient,
  dryRun: boolean,
): Promise<string[]> {
  const setPatch = await buildGtpAboutPageImagePatchSet(client, dryRun);

  if (dryRun) {
    console.log(
      JSON.stringify(
        {
          set: setPatch,
          unset: [...GTP_ABOUT_LEGACY_IMAGE_FIELD_PATHS],
        },
        null,
        2,
      ),
    );
    return [];
  }

  const patchIds = [GTP_ABOUT_PAGE_DOCUMENT_ID];
  const draftId = `drafts.${GTP_ABOUT_PAGE_DOCUMENT_ID}`;
  const draftExists = await client.fetch<boolean>(
    `defined(*[_id == $id][0]._id)`,
    { id: draftId },
  );
  if (draftExists) patchIds.push(draftId);

  for (const id of patchIds) {
    await client
      .patch(id)
      .set(setPatch)
      .unset([...GTP_ABOUT_LEGACY_IMAGE_FIELD_PATHS])
      .commit({ autoGenerateArrayKeys: true });
    console.log(`Patched About page images on ${id}`);
  }

  return patchIds;
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
      "   ⚠️  PIK logo missing; partnersBand.partners will be empty (site falls back to JSX strip).",
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
  const partners = sponsors;

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
      ...(await buildWhyMattersImageFields(client, dryRun)),
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
      quotes: await buildQuoteCards(client, dryRun),
    },
    galleryBand: {
      title: DEFAULT_GTP_GALLERY_BAND.title,
      subtitle: DEFAULT_GTP_GALLERY_BAND.subtitle,
      footerText: DEFAULT_GTP_GALLERY_BAND.footerText,
      footerLinkLabel: DEFAULT_GTP_GALLERY_BAND.footerLinkLabel,
      footerLinkHref: DEFAULT_GTP_GALLERY_BAND.footerLinkHref,
      slides: await buildGallerySlides(client, dryRun),
    },
    eventInquiryBand: { ...DEFAULT_GTP_EVENT_INQUIRY },
    sponsorsBand: {
      title: DEFAULT_GTP_SPONSORS_BAND.title,
      subtitle: DEFAULT_GTP_SPONSORS_BAND.subtitle,
      noticeBeforeLink: DEFAULT_GTP_SPONSORS_BAND.noticeBeforeLink,
      noticeLinkText: DEFAULT_GTP_SPONSORS_BAND.noticeLinkText,
      noticeLinkHref: DEFAULT_GTP_SPONSORS_BAND.noticeLinkHref,
      sponsors: [],
    },
    partnersBand: {
      title: DEFAULT_GTP_PARTNERS_BAND.title,
      subtitle: DEFAULT_GTP_PARTNERS_BAND.subtitle,
      noticeBeforeLink: DEFAULT_GTP_PARTNERS_BAND.noticeBeforeLink,
      noticeLinkText: DEFAULT_GTP_PARTNERS_BAND.noticeLinkText,
      noticeLinkHref: DEFAULT_GTP_PARTNERS_BAND.noticeLinkHref,
      partners,
    },
    sections: [],
  };
}
