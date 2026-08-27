import type {
  GtpAboutEventInquiryCopy,
  GtpAboutGalleryBandCopy,
  GtpAboutGallerySlideCopy,
  GtpAboutHeroCopy,
  GtpAboutImportantDateEntry,
  GtpAboutPageResolved,
  GtpAboutQuoteCardCopy,
  GtpAboutQuotesBandCopy,
  GtpAboutSpeakersChromeCopy,
  GtpAboutSponsorLogoEntry,
  GtpAboutLogoTiersBandCopy,
  GtpAboutLogoTiers,
  GtpLogoTierKey,
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
  DEFAULT_GTP_PARTNERS_BAND,
  DEFAULT_GTP_THEMES_BAND,
  DEFAULT_GTP_WHY_MATTERS,
  GTP_LOGO_TIER_KEYS,
} from "@/data/gtp-about-page-defaults";
import type {
  GtpAccommodationActivityCardCopy,
  GtpAccommodationActivitiesBandCopy,
} from "@/data/gtp-accommodation-activities-defaults";
import {
  DEFAULT_GTP_ACCOMMODATION_ACTIVITIES_BAND,
} from "@/data/gtp-accommodation-activities-defaults";
import type { SectionBlock } from "@/sanity/section-block-types";
import type { GtpAboutWhatIsBandRaw } from "@/sanity/gtp-about-what-is-merge";
import { mergeGtpWhatIsBand } from "@/sanity/gtp-about-what-is-merge";
import { GTP_2026_REGISTRATION_URL } from "@/lib/gtp-registration-url";

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

export type GtpAboutHeroImportantDateRaw = {
  label?: string | null;
  dateText?: string | null;
} | null;

export type GtpAboutHeroBandRaw = {
  enabled?: boolean | null;
  badge?: string | null;
  title?: string | null;
  lede?: string | null;
  primaryCtaLabel?: string | null;
  primaryCtaHref?: string | null;
  secondaryCtaLabel?: string | null;
  secondaryCtaHref?: string | null;
  importantDatesEyebrow?: string | null;
  importantDates?: GtpAboutHeroImportantDateRaw[] | null;
} | null;

export type GtpAboutWhyMattersBandRaw = {
  enabled?: boolean | null;
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
  enabled?: boolean | null;
  title?: string | null;
  subtitle?: string | null;
  footerBlurb?: string | null;
  themes?: GtpAboutThemeCardRaw[] | null;
} | null;

export type GtpAboutSpeakersChromeRaw = {
  enabled?: boolean | null;
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
  enabled?: boolean | null;
  title?: string | null;
  subtitle?: string | null;
  quotes?: GtpAboutQuoteCardRaw[] | null;
} | null;

export type GtpAboutGallerySlideRaw = {
  src?: string | null;
  alt?: string | null;
} | null;

export type GtpAboutGalleryBandRaw = {
  enabled?: boolean | null;
  title?: string | null;
  subtitle?: string | null;
  footerText?: string | null;
  footerLinkLabel?: string | null;
  footerLinkHref?: string | null;
  slides?: GtpAboutGallerySlideRaw[] | null;
} | null;

export type GtpAboutEventInquiryBandRaw = {
  enabled?: boolean | null;
  title?: string | null;
  subtitle?: string | null;
  intro?: string | null;
} | null;

export type GtpAboutSponsorLogoRaw = {
  name?: string | null;
  href?: string | null;
  logoUrl?: string | null;
  tier?: string | null;
} | null;

export type GtpAboutSponsorsBandRaw = {
  enabled?: boolean | null;
  title?: string | null;
  subtitle?: string | null;
  platinum?: GtpAboutSponsorLogoRaw[] | null;
  gold?: GtpAboutSponsorLogoRaw[] | null;
  silver?: GtpAboutSponsorLogoRaw[] | null;
  bronze?: GtpAboutSponsorLogoRaw[] | null;
  others?: GtpAboutSponsorLogoRaw[] | null;
  sponsors?: GtpAboutSponsorLogoRaw[] | null;
  noticeBeforeLink?: string | null;
  noticeLinkText?: string | null;
  noticeLinkHref?: string | null;
} | null;

export type GtpAboutPartnersBandRaw = {
  enabled?: boolean | null;
  title?: string | null;
  subtitle?: string | null;
  platinum?: GtpAboutSponsorLogoRaw[] | null;
  gold?: GtpAboutSponsorLogoRaw[] | null;
  silver?: GtpAboutSponsorLogoRaw[] | null;
  bronze?: GtpAboutSponsorLogoRaw[] | null;
  others?: GtpAboutSponsorLogoRaw[] | null;
  partners?: GtpAboutSponsorLogoRaw[] | null;
  supportedBy?: GtpAboutSponsorLogoRaw[] | null;
  noticeBeforeLink?: string | null;
  noticeLinkText?: string | null;
  noticeLinkHref?: string | null;
} | null;

export type GtpAboutAccommodationCardRaw = {
  categoryLabel?: string | null;
  title?: string | null;
  description?: string | null;
  primaryCtaLabel?: string | null;
  primaryCtaHref?: string | null;
  mapsHref?: string | null;
  address?: string | null;
  imageUrl?: string | null;
  backgroundGradient?: string | null;
} | null;

export type GtpAboutAccommodationActivitiesBandRaw = {
  enabled?: boolean | null;
  title?: string | null;
  subtitle?: string | null;
  intro?: string | null;
  cards?: GtpAboutAccommodationCardRaw[] | null;
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
  accommodationActivitiesBand?: GtpAboutAccommodationActivitiesBandRaw;
  eventInquiryBand?: GtpAboutEventInquiryBandRaw;
  sponsorsBand?: GtpAboutSponsorsBandRaw;
  partnersBand?: GtpAboutPartnersBandRaw;
};

/** On-site register route is deprecated; hero primary CTA must open Sunway Events. */
function heroPrimaryRegistrationHref(
  fromCms: string | null | undefined,
  fallback: string,
): string {
  const resolved = s(fromCms, fallback);
  if (resolved.includes("/events/gtp-2026/register")) {
    return GTP_2026_REGISTRATION_URL;
  }
  return resolved;
}

function mergeImportantDates(
  raw: GtpAboutHeroBandRaw,
  fallback: GtpAboutImportantDateEntry[],
): GtpAboutImportantDateEntry[] {
  const datesRaw = raw?.importantDates;
  const fromCms =
    Array.isArray(datesRaw) && datesRaw.length > 0
      ? (datesRaw
          .map((row) => {
            if (!row || typeof row !== "object") return null;
            const label = row.label?.trim();
            const date = row.dateText?.trim();
            if (!label || !date) return null;
            return { label, date };
          })
          .filter(Boolean) as GtpAboutImportantDateEntry[])
      : [];
  return fromCms.length > 0 ? fromCms : [...fallback];
}

function mergeHero(raw: GtpAboutHeroBandRaw): GtpAboutHeroCopy {
  const d = DEFAULT_GTP_ABOUT_HERO;
  if (!raw) return d;
  return {
    enabled: raw.enabled !== false,
    badge: s(raw.badge, d.badge),
    title: s(raw.title, d.title),
    lede: s(raw.lede, d.lede),
    primaryCtaLabel: s(raw.primaryCtaLabel, d.primaryCtaLabel),
    primaryCtaHref: heroPrimaryRegistrationHref(
      raw.primaryCtaHref,
      d.primaryCtaHref,
    ),
    secondaryCtaLabel: s(raw.secondaryCtaLabel, d.secondaryCtaLabel),
    secondaryCtaHref: s(raw.secondaryCtaHref, d.secondaryCtaHref),
    importantDatesEyebrow: s(raw.importantDatesEyebrow, d.importantDatesEyebrow),
    importantDates: mergeImportantDates(raw, d.importantDates),
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
    enabled: raw.enabled !== false,
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
  const enabled = raw?.enabled !== false;
  if (!raw?.themes?.length) return { ...d, enabled };
  const themes = d.themes.map((def, i) =>
    mergeThemeCard(raw.themes?.[i] ?? null, def),
  );
  return {
    enabled,
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
    enabled: raw.enabled !== false,
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
  const enabled = raw?.enabled !== false;
  if (!raw?.quotes?.length) return { ...d, enabled };
  const quotes = d.quotes.map((def, i) =>
    mergeQuoteCard(raw.quotes?.[i] ?? null, def),
  );
  return {
    enabled,
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
    enabled: raw.enabled !== false,
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
    enabled: raw.enabled !== false,
    title: s(raw.title, d.title),
    subtitle: s(raw.subtitle, d.subtitle),
    intro: s(raw.intro, d.intro),
  };
}

function slugFromCardTitle(title: string): string {
  return title
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function mergeAccommodationCard(
  raw: GtpAboutAccommodationCardRaw,
  fallback: GtpAccommodationActivityCardCopy,
): GtpAccommodationActivityCardCopy {
  if (!raw) return fallback;
  const title = s(raw.title, fallback.title);
  const imageUrl = raw.imageUrl?.trim() || fallback.imageUrl;
  const card: GtpAccommodationActivityCardCopy = {
    id: slugFromCardTitle(title) || fallback.id,
    categoryLabel: s(raw.categoryLabel, fallback.categoryLabel),
    title,
    description: s(raw.description, fallback.description),
    primaryCtaLabel: s(raw.primaryCtaLabel, fallback.primaryCtaLabel),
    primaryCtaHref: s(raw.primaryCtaHref, fallback.primaryCtaHref),
    backgroundGradient: s(
      raw.backgroundGradient,
      fallback.backgroundGradient,
    ),
  };
  const mapsHref = raw.mapsHref?.trim() || fallback.mapsHref;
  if (mapsHref) card.mapsHref = mapsHref;
  const address = raw.address?.trim() || fallback.address;
  if (address) card.address = address;
  if (imageUrl) card.imageUrl = imageUrl;
  return card;
}

function mergeAccommodationActivities(
  raw: GtpAboutAccommodationActivitiesBandRaw,
): GtpAccommodationActivitiesBandCopy {
  const d = DEFAULT_GTP_ACCOMMODATION_ACTIVITIES_BAND;
  if (!raw) return d;

  const rawCards = raw.cards ?? [];
  const cards =
    rawCards.length > 0
      ? rawCards.map((row, i) =>
          mergeAccommodationCard(
            row,
            d.cards[i] ?? d.cards[d.cards.length - 1],
          ),
        )
      : d.cards;

  const subtitleRaw = raw.subtitle?.trim() ?? "";
  return {
    enabled: raw.enabled !== false,
    title: s(raw.title, d.title),
    subtitle: subtitleRaw,
    intro: s(raw.intro, d.intro),
    cards,
  };
}

function mergeLogoEntry(
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

function mergeSponsorLogo(
  raw: GtpAboutSponsorLogoRaw,
): (GtpAboutSponsorLogoEntry & { tier?: GtpLogoTierKey }) | null {
  const base = mergeLogoEntry(raw);
  if (!base || !raw) return null;
  const tierRaw = raw.tier?.trim();
  const tier =
    tierRaw && (GTP_LOGO_TIER_KEYS as readonly string[]).includes(tierRaw)
      ? (tierRaw as GtpLogoTierKey)
      : undefined;
  return tier ? { ...base, tier } : base;
}

function emptyMergedLogoTiers(): GtpAboutLogoTiers {
  return {
    platinum: [],
    gold: [],
    silver: [],
    bronze: [],
    others: [],
  };
}

function pushLogoIntoTiers(
  tiers: GtpAboutLogoTiers,
  entry: GtpAboutSponsorLogoEntry & { tier?: GtpLogoTierKey },
) {
  if (!entry.tier) return;
  const list = tiers[entry.tier];
  if (list.length >= 5) return;
  list.push({
    name: entry.name,
    logoUrl: entry.logoUrl,
    ...(entry.href ? { href: entry.href } : {}),
  });
}

function collectFlatLogos(
  raw: NonNullable<GtpAboutSponsorsBandRaw | GtpAboutPartnersBandRaw>,
  logosKey: "sponsors" | "partners",
): GtpAboutSponsorLogoEntry[] {
  const out: GtpAboutSponsorLogoEntry[] = [];
  const seen = new Set<string>();

  const push = (entry: GtpAboutSponsorLogoEntry | null) => {
    if (!entry) return;
    const key = `${entry.name}::${entry.logoUrl}`;
    if (seen.has(key)) return;
    seen.add(key);
    out.push(entry);
  };

  const flatLogos =
    logosKey === "sponsors"
      ? (raw as GtpAboutSponsorsBandRaw)?.sponsors
      : (raw as GtpAboutPartnersBandRaw)?.partners;

  for (const row of flatLogos ?? []) {
    push(mergeLogoEntry(row));
  }

  for (const key of GTP_LOGO_TIER_KEYS) {
    for (const row of raw[key] ?? []) {
      push(mergeLogoEntry(row));
    }
  }

  return out;
}

function collectSupportedByLogos(
  raw: GtpAboutPartnersBandRaw,
): GtpAboutSponsorLogoEntry[] {
  if (!raw) return [];
  const out: GtpAboutSponsorLogoEntry[] = [];
  const seen = new Set<string>();

  const push = (entry: GtpAboutSponsorLogoEntry | null) => {
    if (!entry) return;
    const key = `${entry.name}::${entry.logoUrl}`;
    if (seen.has(key)) return;
    seen.add(key);
    out.push(entry);
  };

  for (const row of raw.supportedBy ?? []) {
    push(mergeLogoEntry(row));
  }

  return out;
}

function mergeLogoTiersBand(
  raw: GtpAboutSponsorsBandRaw | GtpAboutPartnersBandRaw,
  defaults: GtpAboutLogoTiersBandCopy,
  logosKey: "sponsors" | "partners",
): GtpAboutLogoTiersBandCopy {
  if (!raw) return defaults;

  if (logosKey === "partners") {
    return {
      enabled: raw.enabled !== false,
      title: s(raw.title, defaults.title),
      subtitle: s(raw.subtitle, defaults.subtitle),
      tiers: emptyMergedLogoTiers(),
      logos: collectFlatLogos(raw, "partners"),
      supportedByLogos: collectSupportedByLogos(raw as GtpAboutPartnersBandRaw),
      noticeBeforeLink: s(raw.noticeBeforeLink, defaults.noticeBeforeLink),
      noticeLinkText: s(raw.noticeLinkText, defaults.noticeLinkText),
      noticeLinkHref: s(raw.noticeLinkHref, defaults.noticeLinkHref),
    };
  }

  const tiers = emptyMergedLogoTiers();
  const flatLogos = (raw as GtpAboutSponsorsBandRaw)?.sponsors;

  for (const row of flatLogos ?? []) {
    const entry = mergeSponsorLogo(row);
    if (entry) pushLogoIntoTiers(tiers, entry);
  }

  for (const key of GTP_LOGO_TIER_KEYS) {
    for (const row of raw[key] ?? []) {
      const entry = mergeSponsorLogo(row);
      if (!entry) continue;
      pushLogoIntoTiers(tiers, { ...entry, tier: entry.tier ?? key });
    }
  }

  return {
    enabled: raw.enabled !== false,
    title: s(raw.title, defaults.title),
    subtitle: s(raw.subtitle, defaults.subtitle),
    tiers,
    logos: [],
    supportedByLogos: [],
    noticeBeforeLink: s(raw.noticeBeforeLink, defaults.noticeBeforeLink),
    noticeLinkText: s(raw.noticeLinkText, defaults.noticeLinkText),
    noticeLinkHref: s(raw.noticeLinkHref, defaults.noticeLinkHref),
  };
}

export function mergeGtpAboutPage(
  doc: GtpAboutPageDocumentRaw | null | undefined,
): GtpAboutPageResolved {
  return {
    hero: mergeHero(doc?.heroBand ?? null),
    accommodationActivities: mergeAccommodationActivities(
      doc?.accommodationActivitiesBand ?? null,
    ),
    whatIs: mergeGtpWhatIsBand(doc?.whatIsBand),
    whyMatters: mergeWhyMatters(doc?.whyMattersBand ?? null),
    themes: mergeThemes(doc?.themesBand ?? null),
    speakersChrome: mergeSpeakersChrome(doc?.speakersChrome ?? null),
    quotes: mergeQuotes(doc?.quotesBand ?? null),
    gallery: mergeGallery(doc?.galleryBand ?? null),
    eventInquiry: mergeEventInquiry(doc?.eventInquiryBand ?? null),
    sponsors: mergeLogoTiersBand(
      doc?.sponsorsBand ?? null,
      DEFAULT_GTP_SPONSORS_BAND,
      "sponsors",
    ),
    partners: mergeLogoTiersBand(
      doc?.partnersBand ?? null,
      DEFAULT_GTP_PARTNERS_BAND,
      "partners",
    ),
  };
}
