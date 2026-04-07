/**
 * Default copy for `/events/gtp-2026/about` (matches former hardcoded page).
 * Used for CMS merge fallbacks and for `seed-gtp-media-bizforum-pages` About document.
 */

import { GTP_2026_REGISTRATION_URL } from "@/lib/gtp-registration-url";
import type { GtpWhatIsBandContent } from "./gtp-about-what-is-defaults";
import { DEFAULT_GTP_WHAT_IS_BAND } from "./gtp-about-what-is-defaults";

export type { GtpWhatIsBandContent } from "./gtp-about-what-is-defaults";

/** Shown in the About hero above the programme carousel (from `gtp2026AboutPage.heroBand`). */
export type GtpAboutImportantDateEntry = { label: string; date: string };

export const DEFAULT_GTP_ABOUT_IMPORTANT_DATES: GtpAboutImportantDateEntry[] = [
  { label: "Action Workshop Submission Deadline", date: "8 May 2026" },
  { label: "Abstract Submission Deadline", date: "15 May 2026" },
  { label: "Registration Opens", date: "TBC" },
  { label: "Early Bird Registration", date: "TBC" },
];

export type GtpAboutHeroCopy = {
  enabled: boolean;
  badge: string;
  title: string;
  lede: string;
  primaryCtaLabel: string;
  primaryCtaHref: string;
  secondaryCtaLabel: string;
  secondaryCtaHref: string;
  /** Eyebrow above the important-dates strip in the hero. */
  importantDatesEyebrow: string;
  importantDates: GtpAboutImportantDateEntry[];
};

export const DEFAULT_GTP_ABOUT_HERO: GtpAboutHeroCopy = {
  enabled: true,
  badge: "12–15 October 2026 · Kuala Lumpur, Malaysia",
  title: "Global Tipping Points Conference 2026",
  lede: "From Understanding to Imagination to Action: Crossing Thresholds for a Thriving Planet",
  primaryCtaLabel: "Register Now →",
  primaryCtaHref: GTP_2026_REGISTRATION_URL,
  secondaryCtaLabel: "Learn More",
  secondaryCtaHref: "/events/gtp-2026/about#about",
  importantDatesEyebrow: "Important dates",
  importantDates: DEFAULT_GTP_ABOUT_IMPORTANT_DATES,
};

export type GtpAboutWhyMattersCopy = {
  enabled: boolean;
  eyebrow: string;
  title: string;
  bodyParagraphs: [string, string, string];
  ctaLabel: string;
  ctaHref: string;
  tallImageSrc: string;
  topRightImageSrc: string;
  bottomRightImageSrc: string;
  tallImageAlt: string;
  topRightImageAlt: string;
  bottomRightImageAlt: string;
};

export const DEFAULT_GTP_WHY_MATTERS: GtpAboutWhyMattersCopy = {
  enabled: true,
  eyebrow: "Why This Meeting Matters",
  title: "The Idea behind Global Tipping Points Conference 2026",
  bodyParagraphs: [
    "The world is approaching decisions that will shape lives, economies and ecosystems for generations. Climate change is no longer a distant risk; its impacts are already visible in food systems, health, cities and financial stability.",
    "Yet the future is not fixed. Research on tipping points shows that when leadership, investment and public confidence align, change can accelerate rapidly and systems that once seemed immovable can shift.",
    "Global Tipping Points Conference 2026 (GTP 2026) focuses on where that momentum can be unlocked. Hosted in Asia for the first time, the meeting brings together leaders from science, finance, culture and policy in a region where climate risks are intensifying but where many of the solutions are already emerging at scale.",
  ],
  ctaLabel: "Explore the Programme",
  ctaHref: "/events/gtp-2026/programmes",
  tallImageSrc: "/images/gtp/conference/leaves.jpg",
  topRightImageSrc: "/images/gtp/conference/river.jpg",
  bottomRightImageSrc: "/images/gtp/conference/solar.jpg",
  tallImageAlt: "Nature and sustainability",
  topRightImageAlt: "River ecosystem",
  bottomRightImageAlt: "Solar energy transition",
};

export type GtpAboutThemeIconKey = "trending-down" | "lightbulb" | "zap";

export type GtpAboutThemeCardCopy = {
  id: string;
  num: string;
  icon: GtpAboutThemeIconKey;
  title: string;
  body: string;
};

export type GtpAboutThemesBandCopy = {
  enabled: boolean;
  title: string;
  subtitle: string;
  footerBlurb: string;
  themes: GtpAboutThemeCardCopy[];
};

export const DEFAULT_GTP_THEMES_BAND: GtpAboutThemesBandCopy = {
  enabled: true,
  title: "Three Pathways to Change",
  subtitle: "Conference Themes",
  footerBlurb:
    "The conference is designed for leaders who want clarity, confidence that they are not alone, and credible pathways forward.",
  themes: [
    {
      id: "01",
      num: "01",
      icon: "trending-down",
      title: "Understanding the Shift",
      body: "Clarifying what is changing in the world today, including climate and nature risks, as well as social and economic pressures that affect health, food security and stability.",
    },
    {
      id: "02",
      num: "02",
      icon: "lightbulb",
      title: "Igniting Imagination",
      body: "Exploring how culture, faith, creativity and moral leadership help people, communities and institutions transition into reformation.",
    },
    {
      id: "03",
      num: "03",
      icon: "zap",
      title: "Accelerating Action",
      body: "Identifying what policies, investments and partnerships can reinforce each other and create lasting momentum.",
    },
  ],
};

export type GtpAboutSpeakersChromeCopy = {
  enabled: boolean;
  title: string;
  subtitle: string;
};

export const DEFAULT_GTP_SPEAKERS_CHROME: GtpAboutSpeakersChromeCopy = {
  enabled: true,
  title: "Speaker Highlights",
  subtitle: "Our Speakers",
};

export type GtpAboutQuoteCardCopy = {
  name: string;
  designation: string;
  quote: string;
  photoSrc: string;
  avatarObjectClass?: string;
  avatarScaleClass?: string;
};

export type GtpAboutQuotesBandCopy = {
  enabled: boolean;
  title: string;
  subtitle: string;
  quotes: GtpAboutQuoteCardCopy[];
};

export const DEFAULT_GTP_QUOTES_BAND: GtpAboutQuotesBandCopy = {
  enabled: true,
  title: "Words from Our Co-Chairs",
  subtitle: "Leadership Voices",
  quotes: [
    {
      name: "Tim Lenton",
      designation:
        "Co-Chair · Founding Director, Global Systems Institute, University of Exeter",
      quote:
        "The Global Tipping Points Conference 2026 is a great opportunity for a bunch of us to come together as businesses, as thinkers, as policymakers, both to wrestle down the incredible risks we're running in crossing tipping points in the Earth system—our life support system—but also how can we together seize the positive tipping point opportunities to accelerate us out of trouble and into a healthier, happier, flourishing future together.",
      photoSrc: "/images/gtp/co-chairs/tim-lenton.jpg",
      avatarObjectClass: "object-[50%_38%]",
    },
    {
      name: "Johan Rockström",
      designation:
        "Co-Chair · Director, Potsdam Institute for Climate Impact Research",
      quote:
        "Scientifically, we know we are moving towards profound challenges and risks at the planetary scale, with an increasing risk of tipping points in the Earth system. Against this backdrop, the Malaysian Global Tipping Point Conference offers a crucial forum to examine how positive societal tipping points can help build more equitable, stable and resilient societies.",
      photoSrc: "/images/gtp/co-chairs/johan-rockstrom.jpg",
      avatarObjectClass: "object-[50%_22%]",
      avatarScaleClass: "scale-[1.35] origin-[50%_28%]",
    },
    {
      name: "Jemilah Mahmood",
      designation:
        "Co-Chair · Executive Director, Sunway Centre for Planetary Health, Sunway University",
      quote:
        "This year, the Sunway Centre for Planetary Health will proudly host the Global Tipping Points Conference at Sunway University, the first in Asia. Together, scientists, policymakers, business leaders, civil society, Indigenous voices, artists, and youth will unite to spotlight South and Southeast Asia's lived realities and accelerate the positive tipping points we need for a healthier planet and future. Join us in Sunway this October and we will see you there! Follow us on @sunwaycph to find out more!",
      photoSrc: "/images/scph/team/professor-tan-sri-dr-jemilah-mahmood.png",
      avatarObjectClass: "object-[50%_22%]",
      avatarScaleClass: "scale-[1.48] origin-[50%_6%]",
    },
  ],
};

export type GtpAboutGallerySlideCopy = { src: string; alt: string };

export type GtpAboutGalleryBandCopy = {
  enabled: boolean;
  title: string;
  subtitle: string;
  footerText: string;
  footerLinkLabel: string;
  footerLinkHref: string;
  slides: GtpAboutGallerySlideCopy[];
};

/** Bento strip order (15 images). */
export const DEFAULT_GTP_GALLERY_SLIDES: GtpAboutGallerySlideCopy[] = [
  { src: "/images/gtp/gtp-2025/main-photo.avif", alt: "GTP 2025 — Group Photo" },
  { src: "/images/gtp/gtp-2025/preview-004.avif", alt: "GTP 2025 session" },
  { src: "/images/gtp/gtp-2025/networking.avif", alt: "Networking" },
  { src: "/images/gtp/gtp-2025/conf-7.avif", alt: "Conference session" },
  { src: "/images/gtp/gtp-2025/games-on-lawn.avif", alt: "Outdoor activities" },
  { src: "/images/gtp/gtp-2025/conf-4.avif", alt: "Conference session" },
  { src: "/images/gtp/gtp-2025/preview-117.avif", alt: "GTP 2025 preview" },
  { src: "/images/gtp/gtp-2025/conf-15.jpg", alt: "Conference session" },
  { src: "/images/gtp/gtp-2025/conf-9.avif", alt: "Conference session" },
  { src: "/images/gtp/gtp-2025/workshop.avif", alt: "Workshop" },
  { src: "/images/gtp/gtp-2025/conf-18.jpg", alt: "Conference session" },
  { src: "/images/gtp/gtp-2025/conf-5.avif", alt: "Conference session" },
  { src: "/images/gtp/gtp-2025/preview-092.avif", alt: "GTP 2025 preview" },
  { src: "/images/gtp/gtp-2025/preview-106.avif", alt: "GTP 2025 preview" },
  { src: "/images/gtp/gtp-2025/conf-12.avif", alt: "Conference session" },
];

export const DEFAULT_GTP_GALLERY_BAND: GtpAboutGalleryBandCopy = {
  enabled: true,
  title: "Moments That Matter",
  subtitle: "Our Gallery",
  footerText: "Photos from GTP 2025.",
  footerLinkLabel: "See more →",
  footerLinkHref: "/events/gtp-2026/media",
  slides: DEFAULT_GTP_GALLERY_SLIDES,
};

export type GtpAboutEventInquiryCopy = {
  enabled: boolean;
  title: string;
  subtitle: string;
  intro: string;
};

export const DEFAULT_GTP_EVENT_INQUIRY: GtpAboutEventInquiryCopy = {
  enabled: true,
  title: "Questions about the event?",
  subtitle: "Get in touch",
  intro:
    "Send us a message about registration, programme details, or general enquiries. We'll respond as soon as we can.",
};

/** Resolved sponsor row (Sanity image URL or future public path). */
export type GtpAboutSponsorLogoEntry = {
  name: string;
  logoUrl: string;
  href?: string;
};

export type GtpAboutSponsorsBandCopy = {
  enabled: boolean;
  title: string;
  subtitle: string;
  /** When non-empty, marquee uses these instead of PIK + placeholders. */
  sponsorLogos: GtpAboutSponsorLogoEntry[];
  noticeBeforeLink: string;
  noticeLinkText: string;
  noticeLinkHref: string;
};

export const DEFAULT_GTP_SPONSORS_BAND: GtpAboutSponsorsBandCopy = {
  enabled: true,
  title: "Building a Global Coalition",
  subtitle: "Our Sponsors & Partners",
  sponsorLogos: [],
  noticeBeforeLink: "Partner and sponsor logos coming soon. Interested in partnering? ",
  noticeLinkText: "Get in touch →",
  noticeLinkHref: "/events/gtp-2026/get-involved#partnership",
};

/** PIK row for `seed-gtp-media-bizforum-pages` (uploads logo from `public/`). */
export const GTP_ABOUT_PIK_SPONSOR_SEED = {
  name: "Potsdam Institute for Climate Impact Research (PIK)",
  href: "https://www.pik-potsdam.de/",
  logoPublicPath: "/images/gtp/logos/pik-logo.png",
} as const;

export type GtpAboutPageResolved = {
  hero: GtpAboutHeroCopy;
  whatIs: GtpWhatIsBandContent;
  whyMatters: GtpAboutWhyMattersCopy;
  themes: GtpAboutThemesBandCopy;
  speakersChrome: GtpAboutSpeakersChromeCopy;
  quotes: GtpAboutQuotesBandCopy;
  gallery: GtpAboutGalleryBandCopy;
  eventInquiry: GtpAboutEventInquiryCopy;
  sponsors: GtpAboutSponsorsBandCopy;
};

/** At least one sponsor row with logo URL + name (public sponsors band gate). */
export function gtpAboutSponsorsBandHasQualifyingLogos(
  band: GtpAboutSponsorsBandCopy,
): boolean {
  return band.sponsorLogos.some(
    (x) => Boolean(x.logoUrl?.trim() && x.name?.trim()),
  );
}

export { DEFAULT_GTP_WHAT_IS_BAND };
