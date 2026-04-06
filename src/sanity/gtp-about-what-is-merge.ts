import {
  DEFAULT_GTP_WHAT_IS_BAND,
  type GtpWhatIsBandContent,
} from "@/data/gtp-about-what-is-defaults";

export type GtpAboutWhatIsBandRaw = {
  eyebrow?: string | null;
  title?: string | null;
  body?: string | null;
  quote?: string | null;
  learnMoreIntro?: string | null;
  learnMoreLinkLabel?: string | null;
  learnMoreLinkUrl?: string | null;
  downloadButtonLabel?: string | null;
  downloadButtonUrl?: string | null;
  reportCoverUrl?: string | null;
};

/** When CMS has title + body, use it; otherwise keep built-in defaults. */
export function mergeGtpWhatIsBand(
  raw: GtpAboutWhatIsBandRaw | null | undefined,
): GtpWhatIsBandContent {
  const d = DEFAULT_GTP_WHAT_IS_BAND;
  if (!raw?.title?.trim() || !raw?.body?.trim()) {
    return d;
  }
  const parts = raw.body
    .split(/\n\n/)
    .map((s) => s.trim())
    .filter(Boolean);
  const p1 = parts[0] ?? "";
  const p2 = parts[1] ?? "";
  return {
    eyebrow: raw.eyebrow?.trim() || d.eyebrow,
    title: raw.title.trim(),
    bodyParagraphs: [p1, p2],
    quote: raw.quote?.trim() || d.quote,
    learnMoreIntro: raw.learnMoreIntro?.trim() || d.learnMoreIntro,
    learnMoreLinkLabel: raw.learnMoreLinkLabel?.trim() || d.learnMoreLinkLabel,
    learnMoreLinkUrl: raw.learnMoreLinkUrl?.trim() || d.learnMoreLinkUrl,
    downloadButtonLabel:
      raw.downloadButtonLabel?.trim() || d.downloadButtonLabel,
    downloadButtonUrl: raw.downloadButtonUrl?.trim() || d.downloadButtonUrl,
    reportCoverSrc: raw.reportCoverUrl?.trim() || d.reportCoverSrc,
  };
}
