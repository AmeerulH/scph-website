import { DEFAULT_SCPH_HOME_PARTNERS_COPY } from "@/data/scph-home-partners-defaults";

export type ScphHomePartnerLogoEntry = {
  name: string;
  logoUrl: string;
  href?: string;
};

export type ScphHomePartnersBandResolved = {
  showBand: boolean;
  title: string;
  subtitle: string;
  partnerLogos: ScphHomePartnerLogoEntry[];
  noticeBeforeLink: string;
  noticeLinkText: string;
  noticeLinkHref: string;
};

export type ScphHomePartnersBandRaw = {
  showBand?: boolean | null;
  title?: string | null;
  subtitle?: string | null;
  partners?: Array<{
    name?: string | null;
    href?: string | null;
    logoUrl?: string | null;
  }> | null;
  noticeBeforeLink?: string | null;
  noticeLinkText?: string | null;
  noticeLinkHref?: string | null;
} | null;

function s(v: string | null | undefined, fallback: string): string {
  const t = v?.trim();
  return t ? t : fallback;
}

function mergePartnerLogo(
  raw: NonNullable<NonNullable<ScphHomePartnersBandRaw>["partners"]>[number],
): ScphHomePartnerLogoEntry | null {
  const logoUrl = raw.logoUrl?.trim();
  const name = raw.name?.trim();
  if (!logoUrl || !name) return null;
  const href = raw.href?.trim();
  const entry: ScphHomePartnerLogoEntry = { name, logoUrl };
  if (href) entry.href = href;
  return entry;
}

export function scphHomePartnersHasQualifyingLogos(
  band: ScphHomePartnersBandResolved,
): boolean {
  return band.partnerLogos.some(
    (x) => Boolean(x.logoUrl?.trim() && x.name?.trim()),
  );
}

export function mergeScphHomePartnersBand(
  raw: ScphHomePartnersBandRaw | undefined,
): ScphHomePartnersBandResolved {
  const d = DEFAULT_SCPH_HOME_PARTNERS_COPY;
  if (!raw) {
    return {
      showBand: true,
      title: d.title,
      subtitle: d.subtitle,
      partnerLogos: [],
      noticeBeforeLink: d.noticeBeforeLink,
      noticeLinkText: d.noticeLinkText,
      noticeLinkHref: d.noticeLinkHref,
    };
  }

  const partnerLogos = (raw.partners ?? [])
    .map(mergePartnerLogo)
    .filter((x): x is ScphHomePartnerLogoEntry => x != null);

  return {
    showBand: raw.showBand !== false,
    title: s(raw.title, d.title),
    subtitle: s(raw.subtitle, d.subtitle),
    partnerLogos,
    noticeBeforeLink: s(raw.noticeBeforeLink, d.noticeBeforeLink),
    noticeLinkText: s(raw.noticeLinkText, d.noticeLinkText),
    noticeLinkHref: s(raw.noticeLinkHref, d.noticeLinkHref),
  };
}
