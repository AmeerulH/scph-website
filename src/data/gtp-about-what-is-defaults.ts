/**
 * Default copy for the GTP About “What are Global Tipping Points” band.
 * Used as JSX fallback and as the seed payload for `gtp2026AboutPage.whatIsBand`.
 */
export type GtpWhatIsBandContent = {
  eyebrow: string;
  title: string;
  bodyParagraphs: [string, string];
  quote: string;
  learnMoreIntro: string;
  learnMoreLinkLabel: string;
  learnMoreLinkUrl: string;
  downloadButtonLabel: string;
  downloadButtonUrl: string;
  /** Public path under `/public` or absolute URL (e.g. Sanity image URL). */
  reportCoverSrc: string;
};

export const DEFAULT_GTP_WHAT_IS_BAND: GtpWhatIsBandContent = {
  eyebrow: "New Reality",
  title: "What are Global Tipping Points",
  bodyParagraphs: [
    "The Global Tipping Points initiative, led by Prof. Tim Lenton, is a global research and policy effort focused on understanding critical thresholds in the Earth system where small changes can trigger large, irreversible shifts in climate, ecosystems, and human societies.",
    "It identifies both dangerous and positive tipping points that could rapidly accelerate solutions like clean energy adoption or ecosystem restoration. The initiative aims to translate cutting-edge science into actionable pathways for governments, finance, and society to trigger rapid transformations toward a stable climate and a healthier planet.",
  ],
  quote: "Systems that once seemed immovable can suddenly shift.",
  learnMoreIntro: "To learn more about Global Tipping Points, visit",
  learnMoreLinkLabel: "global-tipping-points.org",
  learnMoreLinkUrl: "https://global-tipping-points.org/",
  downloadButtonLabel: "Download GTP 2025 Report",
  downloadButtonUrl: "https://global-tipping-points.org/download/1418/",
  reportCoverSrc: "/images/gtp/report-cover.avif",
};
