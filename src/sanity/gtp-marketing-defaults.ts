/**
 * Plain defaults for GTP marketing pages (no Sanity client).
 * Used by merge helpers in gtp-stage2.ts and by seed scripts under scripts/.
 */

import type {
  GtpAbstractFormCopy,
  GtpWorkshopFormCopy,
} from "./gtp-submissions-form-defaults";
import {
  DEFAULT_ABSTRACT_FORM_COPY,
  DEFAULT_WORKSHOP_FORM_COPY,
} from "./gtp-submissions-form-defaults";
import { footerSocialIconSrc } from "@/lib/footer-social-icons";

export type {
  GtpAbstractFormCopy,
  GtpSubmissionsEvalGroupResolved,
  GtpSubmissionsRichSectionResolved,
  GtpWorkshopFormCopy,
} from "./gtp-submissions-form-defaults";

export type GtpGetInvolvedSocialLink = {
  label: string;
  href: string;
  iconSrc: string;
};

export type GtpGetInvolvedResolvedCopy = {
  heroTitle: string;
  heroLede: string;
  contact: {
    sectionTitle: string;
    sectionSubtitle: string;
    intro: string;
    /** Shown after the FAQ link when FAQ is enabled. */
    introSuffix: string;
    faqLinkLabel: string;
    faqHref: string;
    orgName: string;
    orgAddress: string;
    conferenceDates: string;
    addressLabel: string;
    addressBody: string;
    hoursLabel: string;
    hoursBody: string;
    phoneLabel: string;
    phoneDisplay: string;
    /** When set, phone display is wrapped in a tel: link. */
    phoneTel: string;
    emailLabel: string;
    email: string;
    socialHeading: string;
    socialLinks: GtpGetInvolvedSocialLink[];
    mapEmbedUrl: string | null;
    mapIframeTitle: string;
  };
  partnership: {
    sectionTitle: string;
    sectionSubtitle: string;
    lead: string;
    highlight: string;
    body: string;
    ctaLabel: string;
  };
};

const GET_INVOLVED_DEFAULT_SOCIAL_KEYS = [
  { label: "Facebook", href: "https://www.facebook.com/SunwayCPH", key: "fb" },
  { label: "Instagram", href: "https://www.instagram.com/sunwaycph/", key: "ig" },
  {
    label: "LinkedIn",
    href: "https://my.linkedin.com/showcase/sunway-centre-for-planetary-health/",
    key: "li",
  },
  {
    label: "TikTok",
    href: "https://www.tiktok.com/@sunwaycph?is_from_webapp=1&sender_device=pc",
    key: "tt",
  },
  { label: "X / Twitter", href: "https://x.com/SunwayCPH", key: "x" },
  {
    label: "YouTube",
    href: "https://www.youtube.com/@sunwaycentreforplanetaryhe8898",
    key: "yt",
  },
] as const;

/** Google Maps → Share → Embed a map (Sunway University). */
export const GTP_GET_INVOLVED_DEFAULT_MAP_EMBED_URL =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3984.102666846611!2d101.60384099999999!3d3.0672267!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31cc4c8f5d98b46d%3A0xed55e2cca5c2d394!2sSunway%20University!5e0!3m2!1sen!2smy!4v1776067749588!5m2!1sen!2smy";

export const DEFAULT_GET_INVOLVED: GtpGetInvolvedResolvedCopy = {
  heroTitle: "Get Involved",
  heroLede: "Connect with us. Partner with us. Collaborate for change.",
  contact: {
    sectionTitle: "Get in Touch",
    sectionSubtitle: "Contact Us",
    intro:
      "Have questions about the Global Tipping Points Conference 2026? Want to learn more about registration, submissions, or partnership opportunities? We'd love to hear from you.",
    introSuffix:
      " for topics such as registration and submissions, or use the form below or the contact details opposite.",
    faqLinkLabel: "Read the FAQ",
    faqHref: "/events/gtp-2026/faq",
    orgName: "Sunway Centre for Planetary Health",
    orgAddress:
      "Sunway Centre for Planetary Health Graduate Centre, Sunway University, Jalan Universiti, Bandar Sunway, 47500 Petaling Jaya, Selangor, Malaysia",
    conferenceDates: "Conference: 12–15 October 2026",
    addressLabel: "Address",
    addressBody:
      "Sunway Centre for Planetary Health Graduate Centre, Sunway University, Jalan Universiti, Bandar Sunway, 47500 Petaling Jaya, Selangor, Malaysia",
    hoursLabel: "Operating hours",
    hoursBody: "Monday – Friday\n9am – 5pm (GMT+8)",
    phoneLabel: "Call us",
    phoneDisplay: "+60 3-7491 8622 ext. 7674",
    phoneTel: "+60374918622",
    emailLabel: "Email us",
    email: "scph_gtpc2026@sunway.edu.my",
    socialHeading: "Social",
    socialLinks: GET_INVOLVED_DEFAULT_SOCIAL_KEYS.map(({ label, href, key }) => ({
      label,
      href,
      iconSrc: footerSocialIconSrc(key),
    })),
    mapEmbedUrl: GTP_GET_INVOLVED_DEFAULT_MAP_EMBED_URL,
    mapIframeTitle: "Sunway University on Google Maps",
  },
  partnership: {
    sectionTitle: "Partner with Us",
    sectionSubtitle: "Partnership",
    lead: "The Global Tipping Points Conference 2026 brings together science, finance, culture and policy from across Asia and the world.",
    highlight:
      "We welcome organisations that share our commitment to positive tipping points and planetary health.",
    body: "Partnership opportunities include sponsorship, co-hosting sessions, exhibition space, and visibility in our communications.",
    ctaLabel: "Inquire about Partnership",
  },
};

// ─── Submissions ─────────────────────────────────────────────────────────────

export type GtpSubmissionsPillarCopy = { title: string; body: string };
export type GtpSubmissionsThemeCopy = { title: string; body: string };

export type GtpSubmissionsResolvedCopy = {
  heroTitle: string;
  heroLede: string;
  heroTitleSize: "default" | "compact";
  pillarsIntroBold: string;
  pillarsIntro: string;
  pillarsOutro: string;
  pillarsLinkLabel: string;
  pillarsLinkUrl: string;
  pillars: [
    GtpSubmissionsPillarCopy,
    GtpSubmissionsPillarCopy,
    GtpSubmissionsPillarCopy,
  ];
  themesSectionTitle: string;
  themesIntro: string;
  themes: [
    GtpSubmissionsThemeCopy,
    GtpSubmissionsThemeCopy,
    GtpSubmissionsThemeCopy,
    GtpSubmissionsThemeCopy,
    GtpSubmissionsThemeCopy,
    GtpSubmissionsThemeCopy,
    GtpSubmissionsThemeCopy,
    GtpSubmissionsThemeCopy,
  ];
  ctaTitle: string;
  ctaSubtitle: string;
  abstractTabLabel: string;
  abstractDeadline: string;
  workshopTabLabel: string;
  workshopDeadline: string;
  abstractFormIntro: string;
  workshopFormIntro: string;
  backToTopLabel: string;
  abstractForm: GtpAbstractFormCopy;
  workshopForm: GtpWorkshopFormCopy;
};

const DEFAULT_SUBMISSION_PILLARS: [
  GtpSubmissionsPillarCopy,
  GtpSubmissionsPillarCopy,
  GtpSubmissionsPillarCopy,
] = [
  {
    title: "Understanding the Shift",
    body: "Clarifying what is changing in the world today, including climate and nature risks, as well as social and economic pressures that affect health, food security and stability.",
  },
  {
    title: "Igniting Imagination",
    body: "Exploring how culture, faith, creativity and moral leadership help people, communities and institutions transition into reformation.",
  },
  {
    title: "Accelerating Action",
    body: "Identifying what policies, investments and partnerships can reinforce each other and create lasting momentum.",
  },
];

const DEFAULT_SUBMISSION_THEMES: [
  GtpSubmissionsThemeCopy,
  GtpSubmissionsThemeCopy,
  GtpSubmissionsThemeCopy,
  GtpSubmissionsThemeCopy,
  GtpSubmissionsThemeCopy,
  GtpSubmissionsThemeCopy,
  GtpSubmissionsThemeCopy,
  GtpSubmissionsThemeCopy,
] = [
  {
    title: "Earth System Science",
    body: "Cutting-edge research on planetary boundaries, climate feedback loops, ecosystem thresholds, and earth system modelling.",
  },
  {
    title: "Technology and AI",
    body: "Innovative applications of artificial intelligence, machine learning, and emerging technologies for monitoring and responding to global tipping points.",
  },
  {
    title: "Governance",
    body: "Scientific analysis of governance frameworks, institutional capacity, and policy mechanisms for managing systemic risks and cross-border environmental challenges.",
  },
  {
    title: "Finance and Business",
    body: "Advances in sustainable finance, risk assessment methodologies, and business models that align with planetary boundaries.",
  },
  {
    title: "Faith and Culture",
    body: "Scientific studies examining the intersection of cultural values, spiritual traditions, and environmental stewardship.",
  },
  {
    title: "Communications",
    body: "Innovative approaches to science communication, public engagement, and behavioural change strategies for disseminating information about tipping points.",
  },
  {
    title: "Nature-based Solutions",
    body: "Scientific advances in ecosystem restoration, biodiversity conservation, and natural climate solutions addressing earth system tipping points.",
  },
  {
    title: "Health",
    body: "Research on the health impacts of environmental tipping points, health-centred approaches to climate action, and the co-benefits of planetary health interventions.",
  },
];

export const DEFAULT_SUBMISSIONS: GtpSubmissionsResolvedCopy = {
  heroTitle: "Call for Abstract and Action Workshop Proposal Submissions",
  heroLede:
    "Submit scalable solutions across the conference's critical domains",
  heroTitleSize: "compact",
  pillarsIntroBold:
    "We invite researchers and practitioners to submit abstracts for oral and poster presentations, and contribute to the programme agenda by proposing to convene action workshops.",
  pillarsIntro:
    "GTP 2026 is organised around three pillars that shape the programme and submissions.",
  pillarsOutro:
    "As research demonstrates that systems can shift rapidly when leadership, investment, and public confidence converge, GTP 2026 focuses on these three pillars.",
  pillarsLinkLabel: "Download the Global Tipping Points Report 2025",
  pillarsLinkUrl: "https://global-tipping-points.org/download/1418/",
  pillars: DEFAULT_SUBMISSION_PILLARS,
  themesSectionTitle: "8 Critical Domains",
  themesIntro:
    "We especially encourage submissions highlighting scalable solutions emerging from Asia across the conference's eight critical domains:",
  themes: DEFAULT_SUBMISSION_THEMES,
  ctaTitle: "Ready to Submit?",
  ctaSubtitle: "Select a submission type below and complete the form.",
  abstractTabLabel: "Abstract Submission",
  abstractDeadline: "15 May 2026, 23:59 (GMT+8)",
  workshopTabLabel: "Action Workshop Proposal Submission",
  workshopDeadline: "8 May 2026, 23:59 (GMT+8)",
  abstractFormIntro:
    "Complete all required fields. The presenting author must submit this form.",
  workshopFormIntro:
    "Complete all required fields. The proposed session lead should submit this form.",
  backToTopLabel: "Back to top",
  abstractForm: DEFAULT_ABSTRACT_FORM_COPY,
  workshopForm: DEFAULT_WORKSHOP_FORM_COPY,
};
