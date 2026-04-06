import type {
  GtpAboutEventInquiryCopy,
  GtpAboutGalleryBandCopy,
  GtpAboutGallerySlideCopy,
  GtpAboutHeroCopy,
  GtpAboutPageResolved,
  GtpAboutQuoteCardCopy,
  GtpAboutQuotesBandCopy,
  GtpAboutSpeakersChromeCopy,
  GtpAboutSponsorLogoEntry,
  GtpAboutSponsorsBandCopy,
  GtpAboutThemeCardCopy,
  GtpAboutThemeIconKey,
  GtpAboutThemesBandCopy,
  GtpAboutWhyMattersCopy,
} from "@/data/gtp-about-page-defaults";
import {
  DEFAULT_GTP_ABOUT_HERO,
  DEFAULT_GTP_EVENT_INQUIRY,
  DEFAULT_GTP_GALLERY_BAND,
  DEFAULT_GTP_QUOTES_BAND,
  DEFAULT_GTP_SPEAKERS_CHROME,
  DEFAULT_GTP_SPONSORS_BAND,
  DEFAULT_GTP_THEMES_BAND,
  DEFAULT_GTP_WHY_MATTERS,
} from "@/data/gtp-about-page-defaults";
import type { SectionBlock } from "@/sanity/section-block-types";
import type { GtpAboutWhatIsBandRaw } from "@/sanity/gtp-about-what-is-merge";
import { mergeGtpWhatIsBand } from "@/sanity/gtp-about-what-is-merge";

function s(v: string | null | undefined, fallback: string): string {
  const t = v?.trim();
  return t ? t : fallback;
}

const ICONS: GtpAboutThemeIconKey[] = ["trending-down", "lightbulb", "zap"];

function normIcon(v: string | null | undefined): GtpAboutThemeIconKey {
  const t = v?.trim();
  return ICONS.includes(t as GtpAboutThemeIconKey)
    ? (t as GtpAboutThemeIconKey)
    : "trending-down";
}

export type GtpAboutHeroBandRaw = {
  badge?: string | null;
  title?: string | null;
  lede?: string | null;
  primaryCtaLabel?: string | null;
  primaryCtaHref?: string | null;
  secondaryCtaLabel?: string | null;
  secondaryCtaHref?: string | null;
} | null;

export type GtpAboutWhyMattersBandRaw = {
  eyebrow?: string | null;
  title?: string | null;
  body?: string | null;
  ctaLabel?: string | null;
  ctaHref?: string | null;
  tallImageSrc?: string | null;
  topRightImageSrc?: string | null;
  bottomRightImageSrc?: string | null;
  tallImageAlt?: string | null;
  topRightImageAlt?: string | null;
  bottomRightImageAlt?: string | null;
} | null;

export type GtpAboutThemeCardRaw = {
  num?: string | null;
  title?: string | null;
  body?: string | null;
  icon?: string | null;
} | null;

export type GtpAboutThemesBandRaw = {
  title?: string | null;
  subtitle?: string | null;
  footerBlurb?: string | null;
  themes?: GtpAboutThemeCardRaw[] | null;
} | null;

export type GtpAboutSpeakersChromeRaw = {
  title?: string | null;
  subtitle?: string | null;
} | null;

export type GtpAboutQuoteCardRaw = {
  name?: string | null;
  designation?: string | null;
  quote?: string | null;
  photoSrc?: string | null;
  avatarObjectClass?: string | null;
  avatarScaleClass?: string | null;
} | null;

export type GtpAboutQuotesBandRaw = {
  title?: string | null;
  subtitle?: string | null;
  quotes?: GtpAboutQuoteCardRaw[] | null;
} | null;

export type GtpAboutGallerySlideRaw = {
  src?: string | null;
  alt?: string | null;
} | null;

export type GtpAboutGalleryBandRaw = {
  title?: string | null;
  subtitle?: string | null;
  footerText?: string | null;
  footerLinkLabel?: string | null;
  footerLinkHref?: string | null;
  slides?: GtpAboutGallerySlideRaw[] | null;
} | null;

export type GtpAboutEventInquiryBandRaw = {
  title?: string | null;
  subtitle?: string | null;
  intro?: string | null;
} | null;

export type GtpAboutSponsorLogoRaw = {
  name?: string | null;
  href?: string | null;
  logoUrl?: string | null;
} | null;

export type GtpAboutSponsorsBandRaw = {
  title?: string | null;
  subtitle?: string | null;
  sponsors?: GtpAboutSponsorLogoRaw[] | null;
  noticeBeforeLink?: string | null;
  noticeLinkText?: string | null;
  noticeLinkHref?: string | null;
} | null;

export type GtpAboutPageDocumentRaw = {
  sections?: SectionBlock[] | null;
  whatIsBand?: GtpAboutWhatIsBandRaw | null;
  heroBand?: GtpAboutHeroBandRaw;
  whyMattersBand?: GtpAboutWhyMattersBandRaw;
  themesBand?: GtpAboutThemesBandRaw;
  speakersChrome?: GtpAboutSpeakersChromeRaw;
  quotesBand?: GtpAboutQuotesBandRaw;
  galleryBand?: GtpAboutGalleryBandRaw;
  eventInquiryBand?: GtpAboutEventInquiryBandRaw;
  sponsorsBand?: GtpAboutSponsorsBandRaw;
};

function mergeHero(raw: GtpAboutHeroBandRaw): GtpAboutHeroCopy {
  const d = DEFAULT_GTP_ABOUT_HERO;
  if (!raw) return d;
  return {
    badge: s(raw.badge, d.badge),
    title: s(raw.title, d.title),
    lede: s(raw.lede, d.lede),
    primaryCtaLabel: s(raw.primaryCtaLabel, d.primaryCtaLabel),
    primaryCtaHref: s(raw.primaryCtaHref, d.primaryCtaHref),
    secondaryCtaLabel: s(raw.secondaryCtaLabel, d.secondaryCtaLabel),
    secondaryCtaHref: s(raw.secondaryCtaHref, d.secondaryCtaHref),
  };
}

function splitThree(
  body: string,
  fallback: [string, string, string],
): [string, string, string] {
  const parts = body
    .split(/\n\n/)
    .map((x) => x.trim())
    .filter(Boolean);
  return [
    parts[0] ?? fallback[0],
    parts[1] ?? fallback[1],
    parts[2] ?? fallback[2],
  ];
}

function mergeWhyMatters(raw: GtpAboutWhyMattersBandRaw): GtpAboutWhyMattersCopy {
  const d = DEFAULT_GTP_WHY_MATTERS;
  if (!raw) return d;
  const bodyParagraphs = raw.body?.trim()
    ? splitThree(raw.body, d.bodyParagraphs)
    : d.bodyParagraphs;
  return {
    eyebrow: s(raw.eyebrow, d.eyebrow),
    title: s(raw.title, d.title),
    bodyParagraphs,
    ctaLabel: s(raw.ctaLabel, d.ctaLabel),
    ctaHref: s(raw.ctaHref, d.ctaHref),
    tallImageSrc: s(raw.tallImageSrc, d.tallImageSrc),
    topRightImageSrc: s(raw.topRightImageSrc, d.topRightImageSrc),
    bottomRightImageSrc: s(raw.bottomRightImageSrc, d.bottomRightImageSrc),
    tallImageAlt: s(raw.tallImageAlt, d.tallImageAlt),
    topRightImageAlt: s(raw.topRightImageAlt, d.topRightImageAlt),
    bottomRightImageAlt: s(raw.bottomRightImageAlt, d.bottomRightImageAlt),
  };
}

function mergeThemeCard(
  raw: GtpAboutThemeCardRaw,
  d: GtpAboutThemeCardCopy,
): GtpAboutThemeCardCopy {
  if (!raw) return d;
  const num = s(raw.num, d.num);
  return {
    id: num.replace(/\s/g, "") || d.id,
    num,
    icon: normIcon(raw.icon ?? d.icon),
    title: s(raw.title, d.title),
    body: s(raw.body, d.body),
  };
}

function mergeThemes(raw: GtpAboutThemesBandRaw): GtpAboutThemesBandCopy {
  const d = DEFAULT_GTP_THEMES_BAND;
  if (!raw?.themes?.length) return d;
  const themes = d.themes.map((def, i) =>
    mergeThemeCard(raw.themes?.[i] ?? null, def),
  );
  return {
    title: s(raw.title, d.title),
    subtitle: s(raw.subtitle, d.subtitle),
    footerBlurb: s(raw.footerBlurb, d.footerBlurb),
    themes,
  };
}

function mergeSpeakersChrome(
  raw: GtpAboutSpeakersChromeRaw,
): GtpAboutSpeakersChromeCopy {
  const d = DEFAULT_GTP_SPEAKERS_CHROME;
  if (!raw) return d;
  return {
    title: s(raw.title, d.title),
    subtitle: s(raw.subtitle, d.subtitle),
  };
}

function mergeQuoteCard(
  raw: GtpAboutQuoteCardRaw,
  d: GtpAboutQuoteCardCopy,
): GtpAboutQuoteCardCopy {
  if (!raw) return d;
  const avatarObjectClass =
    raw.avatarObjectClass?.trim() || d.avatarObjectClass;
  const avatarScaleClass = raw.avatarScaleClass?.trim() || d.avatarScaleClass;
  const out: GtpAboutQuoteCardCopy = {
    name: s(raw.name, d.name),
    designation: s(raw.designation, d.designation),
    quote: s(raw.quote, d.quote),
    photoSrc: s(raw.photoSrc, d.photoSrc),
  };
  if (avatarObjectClass) out.avatarObjectClass = avatarObjectClass;
  if (avatarScaleClass) out.avatarScaleClass = avatarScaleClass;
  return out;
}

function mergeQuotes(raw: GtpAboutQuotesBandRaw): GtpAboutQuotesBandCopy {
  const d = DEFAULT_GTP_QUOTES_BAND;
  if (!raw?.quotes?.length) return d;
  const quotes = d.quotes.map((def, i) =>
    mergeQuoteCard(raw.quotes?.[i] ?? null, def),
  );
  return {
    title: s(raw.title, d.title),
    subtitle: s(raw.subtitle, d.subtitle),
    quotes,
  };
}

function mergeSlide(
  raw: GtpAboutGallerySlideRaw,
  d: GtpAboutGallerySlideCopy,
): GtpAboutGallerySlideCopy {
  if (!raw) return d;
  return {
    src: s(raw.src, d.src),
    alt: s(raw.alt, d.alt),
  };
}

function mergeGallery(raw: GtpAboutGalleryBandRaw): GtpAboutGalleryBandCopy {
  const d = DEFAULT_GTP_GALLERY_BAND;
  if (!raw) return d;
  const slides = d.slides.map((def, i) =>
    mergeSlide(raw.slides?.[i] ?? null, def),
  );
  return {
    title: s(raw.title, d.title),
    subtitle: s(raw.subtitle, d.subtitle),
    footerText: s(raw.footerText, d.footerText),
    footerLinkLabel: s(raw.footerLinkLabel, d.footerLinkLabel),
    footerLinkHref: s(raw.footerLinkHref, d.footerLinkHref),
    slides,
  };
}

function mergeEventInquiry(
  raw: GtpAboutEventInquiryBandRaw,
): GtpAboutEventInquiryCopy {
  const d = DEFAULT_GTP_EVENT_INQUIRY;
  if (!raw) return d;
  return {
    title: s(raw.title, d.title),
    subtitle: s(raw.subtitle, d.subtitle),
    intro: s(raw.intro, d.intro),
  };
}

function mergeSponsorLogo(
  raw: GtpAboutSponsorLogoRaw,
): GtpAboutSponsorLogoEntry | null {
  if (!raw) return null;
  const logoUrl = raw.logoUrl?.trim();
  const name = raw.name?.trim();
  if (!logoUrl || !name) return null;
  const href = raw.href?.trim();
  const entry: GtpAboutSponsorLogoEntry = { name, logoUrl };
  if (href) entry.href = href;
  return entry;
}

function mergeSponsors(raw: GtpAboutSponsorsBandRaw): GtpAboutSponsorsBandCopy {
  const d = DEFAULT_GTP_SPONSORS_BAND;
  if (!raw) return d;
  const sponsorLogos = (raw.sponsors ?? [])
    .map(mergeSponsorLogo)
    .filter((x): x is GtpAboutSponsorLogoEntry => x != null);
  return {
    title: s(raw.title, d.title),
    subtitle: s(raw.subtitle, d.subtitle),
    sponsorLogos,
    noticeBeforeLink: s(raw.noticeBeforeLink, d.noticeBeforeLink),
    noticeLinkText: s(raw.noticeLinkText, d.noticeLinkText),
    noticeLinkHref: s(raw.noticeLinkHref, d.noticeLinkHref),
  };
}

export function mergeGtpAboutPage(
  doc: GtpAboutPageDocumentRaw | null | undefined,
): GtpAboutPageResolved {
  return {
    hero: mergeHero(doc?.heroBand ?? null),
    whatIs: mergeGtpWhatIsBand(doc?.whatIsBand),
    whyMatters: mergeWhyMatters(doc?.whyMattersBand ?? null),
    themes: mergeThemes(doc?.themesBand ?? null),
    speakersChrome: mergeSpeakersChrome(doc?.speakersChrome ?? null),
    quotes: mergeQuotes(doc?.quotesBand ?? null),
    gallery: mergeGallery(doc?.galleryBand ?? null),
    eventInquiry: mergeEventInquiry(doc?.eventInquiryBand ?? null),
    sponsors: mergeSponsors(doc?.sponsorsBand ?? null),
  };
}
