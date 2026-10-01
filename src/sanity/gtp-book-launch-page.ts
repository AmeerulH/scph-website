import { client } from "./client";
import {
  GTP_BOOK_LAUNCH_DEFAULTS,
  type GtpBookLaunchImage,
  type GtpBookLaunchResolved,
} from "@/data/gtp-book-launch-page-defaults";

type Str = string | null | undefined;

type RawImage = { url?: Str; alt?: Str; width?: number | null; height?: number | null };

type RawBookLaunch = {
  pageTitle?: Str;
  seoDescription?: Str;
  heroImage?: RawImage | null;
  bookTitle?: Str;
  bookSubtitle?: Str;
  authorName?: Str;
  cover?: RawImage | null;
  dateLabel?: Str;
  time?: Str;
  venue?: Str;
  detailsNote?: Str;
  registrationClosed?: boolean | null;
  registrationUrl?: Str;
  registrationLabel?: Str;
  registrationPendingLabel?: Str;
  introLead?: Str;
  body?: Str;
  pullQuote?: Str;
  pullQuoteAttribution?: Str;
  authorRole?: Str;
  authorBio?: Str;
  authorPhoto?: RawImage | null;
  thanksEnabled?: boolean | null;
  thanksTitle?: Str;
  thanksBody?: Str;
};

const image = (field: string) =>
  `{ "url": ${field}.asset->url, "alt": ${field}.alt, "width": ${field}.asset->metadata.dimensions.width, "height": ${field}.asset->metadata.dimensions.height }`;

const bookLaunchQuery = `*[_type == "gtp2026BookLaunchPage"][0]{
  pageTitle, seoDescription,
  "heroImage": ${image("heroImage")},
  bookTitle, bookSubtitle, authorName,
  "cover": ${image("coverImage")},
  dateLabel, time, venue, detailsNote,
  registrationClosed, registrationUrl, registrationLabel, registrationPendingLabel,
  introLead, body, pullQuote, pullQuoteAttribution,
  authorRole, authorBio,
  "authorPhoto": ${image("authorPhoto")},
  thanksEnabled, thanksTitle, thanksBody
}`;

const s = (v: Str, fallback: string) => v?.trim() || fallback;
const paragraphs = (v: Str, fallback: string[]) => {
  const parts = v?.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
  return parts?.length ? parts : fallback;
};
const safeUrl = (v: Str) => {
  const t = v?.trim();
  return t && /^https:\/\//i.test(t) ? t : undefined;
};
const toImage = (raw: RawImage | null | undefined, fallbackAlt: string): GtpBookLaunchImage | null =>
  raw?.url
    ? {
        src: raw.url,
        alt: raw.alt?.trim() || fallbackAlt,
        width: raw.width ?? undefined,
        height: raw.height ?? undefined,
      }
    : null;

export function mergeGtpBookLaunchPage(raw: RawBookLaunch | null): GtpBookLaunchResolved {
  const d = GTP_BOOK_LAUNCH_DEFAULTS;
  if (!raw) return d;

  const bookTitle = s(raw.bookTitle, d.bookTitle);
  const authorName = s(raw.authorName, d.authorName);

  return {
    pageTitle: s(raw.pageTitle, d.pageTitle),
    seoDescription: s(raw.seoDescription, d.seoDescription),
    heroImage: toImage(raw.heroImage, d.heroImage.alt) ?? d.heroImage,
    bookTitle,
    bookSubtitle: s(raw.bookSubtitle, d.bookSubtitle),
    authorName,
    cover: toImage(raw.cover, bookTitle ? `Cover of ${bookTitle}` : "Book cover"),
    dateLabel: s(raw.dateLabel, d.dateLabel),
    time: s(raw.time, d.time),
    venue: s(raw.venue, d.venue),
    detailsNote: s(raw.detailsNote, d.detailsNote),
    registration: {
      closed: raw.registrationClosed ?? d.registration.closed,
      url: safeUrl(raw.registrationUrl),
      label: s(raw.registrationLabel, d.registration.label),
      pendingLabel: s(raw.registrationPendingLabel, d.registration.pendingLabel),
    },
    introLead: s(raw.introLead, d.introLead),
    body: paragraphs(raw.body, d.body),
    pullQuote: s(raw.pullQuote, d.pullQuote),
    pullQuoteAttribution: s(raw.pullQuoteAttribution, d.pullQuoteAttribution),
    author: {
      role: s(raw.authorRole, d.author.role),
      bio: paragraphs(raw.authorBio, d.author.bio),
      photo: toImage(raw.authorPhoto, authorName),
    },
    thanks: {
      enabled: raw.thanksEnabled ?? d.thanks.enabled,
      title: s(raw.thanksTitle, d.thanks.title),
      body: s(raw.thanksBody, d.thanks.body),
    },
  };
}

export async function getGtpBookLaunchPage(): Promise<GtpBookLaunchResolved> {
  const raw = await client.fetch<RawBookLaunch | null>(bookLaunchQuery).catch(() => null);
  return mergeGtpBookLaunchPage(raw);
}
