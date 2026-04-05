import { client } from "./client";
import type { SectionBlock } from "./section-block-types";

// ─── Get involved ────────────────────────────────────────────────────────────

export type GtpGetInvolvedResolvedCopy = {
  heroTitle: string;
  heroLede: string;
  contact: {
    sectionTitle: string;
    sectionSubtitle: string;
    intro: string;
    orgName: string;
    orgAddress: string;
    conferenceDates: string;
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

const DEFAULT_GET_INVOLVED: GtpGetInvolvedResolvedCopy = {
  heroTitle: "Get Involved",
  heroLede: "Connect with us. Partner with us. Collaborate for change.",
  contact: {
    sectionTitle: "Get in Touch",
    sectionSubtitle: "Contact Us",
    intro:
      "Have questions about the Global Tipping Points Conference 2026? Want to learn more about registration, submissions, or partnership opportunities? We'd love to hear from you.",
    orgName: "Sunway Centre for Planetary Health",
    orgAddress: "Sunway University, Kuala Lumpur, Malaysia",
    conferenceDates: "Conference: 12–15 October 2026",
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

type SanityGetInvolvedRaw = {
  heroTitle?: string | null;
  heroLede?: string | null;
  contactSectionTitle?: string | null;
  contactSectionSubtitle?: string | null;
  contactIntro?: string | null;
  contactOrgName?: string | null;
  contactOrgAddress?: string | null;
  contactConferenceDates?: string | null;
  partnershipSectionTitle?: string | null;
  partnershipSectionSubtitle?: string | null;
  partnershipLead?: string | null;
  partnershipHighlight?: string | null;
  partnershipBody?: string | null;
  partnershipCtaLabel?: string | null;
};

const getInvolvedQuery = `*[_type == "gtp2026GetInvolvedPage"][0]{
  heroTitle,
  heroLede,
  contactSectionTitle,
  contactSectionSubtitle,
  contactIntro,
  contactOrgName,
  contactOrgAddress,
  contactConferenceDates,
  partnershipSectionTitle,
  partnershipSectionSubtitle,
  partnershipLead,
  partnershipHighlight,
  partnershipBody,
  partnershipCtaLabel
}`;

export async function getGtp2026GetInvolvedPage(): Promise<SanityGetInvolvedRaw | null> {
  return client.fetch(getInvolvedQuery);
}

export function mergeGtpGetInvolvedCopy(
  cms: SanityGetInvolvedRaw | null,
): GtpGetInvolvedResolvedCopy {
  const d = DEFAULT_GET_INVOLVED;
  if (!cms) return d;
  return {
    heroTitle: cms.heroTitle?.trim() || d.heroTitle,
    heroLede: cms.heroLede?.trim() || d.heroLede,
    contact: {
      sectionTitle:
        cms.contactSectionTitle?.trim() || d.contact.sectionTitle,
      sectionSubtitle:
        cms.contactSectionSubtitle?.trim() || d.contact.sectionSubtitle,
      intro: cms.contactIntro?.trim() || d.contact.intro,
      orgName: cms.contactOrgName?.trim() || d.contact.orgName,
      orgAddress: cms.contactOrgAddress?.trim() || d.contact.orgAddress,
      conferenceDates:
        cms.contactConferenceDates?.trim() || d.contact.conferenceDates,
    },
    partnership: {
      sectionTitle:
        cms.partnershipSectionTitle?.trim() || d.partnership.sectionTitle,
      sectionSubtitle:
        cms.partnershipSectionSubtitle?.trim() || d.partnership.sectionSubtitle,
      lead: cms.partnershipLead?.trim() || d.partnership.lead,
      highlight:
        cms.partnershipHighlight?.trim() || d.partnership.highlight,
      body: cms.partnershipBody?.trim() || d.partnership.body,
      ctaLabel:
        cms.partnershipCtaLabel?.trim() || d.partnership.ctaLabel,
    },
  };
}

// ─── Register ─────────────────────────────────────────────────────────────────

export type GtpRegisterResolvedCopy = {
  heroTitle: string;
  heroLede: string;
  sectionTitle: string;
  sectionSubtitle: string;
  bodyLead: string;
  bodyHighlight: string;
  bodyMore: string;
  primaryCtaLabel: string;
  secondaryCtaLabel: string;
};

const DEFAULT_REGISTER: GtpRegisterResolvedCopy = {
  heroTitle: "Register Now",
  heroLede: "12–15 October 2026 · Kuala Lumpur, Malaysia",
  sectionTitle: "Join the Conference",
  sectionSubtitle: "Registration",
  bodyLead:
    "Registration for the Global Tipping Points Conference 2026 will open soon.",
  bodyHighlight: "Early bird rates will be available for a limited time.",
  bodyMore:
    "Sign up below to be notified when registration opens, or get in touch if you have questions about group bookings, scholarships, or partnership opportunities.",
  primaryCtaLabel: "Notify Me When Registration Opens",
  secondaryCtaLabel: "Contact Us",
};

type SanityRegisterRaw = {
  heroTitle?: string | null;
  heroLede?: string | null;
  sectionTitle?: string | null;
  sectionSubtitle?: string | null;
  bodyLead?: string | null;
  bodyHighlight?: string | null;
  bodyMore?: string | null;
  primaryCtaLabel?: string | null;
  secondaryCtaLabel?: string | null;
};

const registerQuery = `*[_type == "gtp2026RegisterPage"][0]{
  heroTitle,
  heroLede,
  sectionTitle,
  sectionSubtitle,
  bodyLead,
  bodyHighlight,
  bodyMore,
  primaryCtaLabel,
  secondaryCtaLabel
}`;

export async function getGtp2026RegisterPage(): Promise<SanityRegisterRaw | null> {
  return client.fetch(registerQuery);
}

export function mergeGtpRegisterCopy(
  cms: SanityRegisterRaw | null,
): GtpRegisterResolvedCopy {
  const d = DEFAULT_REGISTER;
  if (!cms) return d;
  return {
    heroTitle: cms.heroTitle?.trim() || d.heroTitle,
    heroLede: cms.heroLede?.trim() || d.heroLede,
    sectionTitle: cms.sectionTitle?.trim() || d.sectionTitle,
    sectionSubtitle: cms.sectionSubtitle?.trim() || d.sectionSubtitle,
    bodyLead: cms.bodyLead?.trim() || d.bodyLead,
    bodyHighlight: cms.bodyHighlight?.trim() || d.bodyHighlight,
    bodyMore: cms.bodyMore?.trim() || d.bodyMore,
    primaryCtaLabel: cms.primaryCtaLabel?.trim() || d.primaryCtaLabel,
    secondaryCtaLabel: cms.secondaryCtaLabel?.trim() || d.secondaryCtaLabel,
  };
}

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
  pillars: [GtpSubmissionsPillarCopy, GtpSubmissionsPillarCopy, GtpSubmissionsPillarCopy];
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

const DEFAULT_SUBMISSIONS: GtpSubmissionsResolvedCopy = {
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
};

type SanitySubmissionsRaw = {
  heroTitle?: string | null;
  heroLede?: string | null;
  heroTitleSize?: string | null;
  pillarsIntroBold?: string | null;
  pillarsIntro?: string | null;
  pillarsOutro?: string | null;
  pillarsLinkLabel?: string | null;
  pillarsLinkUrl?: string | null;
  pillars?: { title?: string | null; body?: string | null }[] | null;
  themesSectionTitle?: string | null;
  themesIntro?: string | null;
  themes?: { title?: string | null; body?: string | null }[] | null;
  ctaTitle?: string | null;
  ctaSubtitle?: string | null;
  abstractTabLabel?: string | null;
  abstractDeadline?: string | null;
  workshopTabLabel?: string | null;
  workshopDeadline?: string | null;
  abstractFormIntro?: string | null;
  workshopFormIntro?: string | null;
  backToTopLabel?: string | null;
};

const submissionsQuery = `*[_type == "gtp2026SubmissionsPage"][0]{
  heroTitle,
  heroLede,
  heroTitleSize,
  pillarsIntroBold,
  pillarsIntro,
  pillarsOutro,
  pillarsLinkLabel,
  pillarsLinkUrl,
  pillars[]{ title, body },
  themesSectionTitle,
  themesIntro,
  themes[]{ title, body },
  ctaTitle,
  ctaSubtitle,
  abstractTabLabel,
  abstractDeadline,
  workshopTabLabel,
  workshopDeadline,
  abstractFormIntro,
  workshopFormIntro,
  backToTopLabel
}`;

export async function getGtp2026SubmissionsPage(): Promise<SanitySubmissionsRaw | null> {
  return client.fetch(submissionsQuery);
}

function textPairOrDefault<T extends { title: string; body: string }>(
  cms: { title?: string | null; body?: string | null } | undefined,
  fallback: T,
): T {
  const title = cms?.title?.trim();
  const body = cms?.body?.trim();
  if (title && body) return { title, body } as T;
  return fallback;
}

export function mergeGtpSubmissionsCopy(
  cms: SanitySubmissionsRaw | null,
): GtpSubmissionsResolvedCopy {
  const d = DEFAULT_SUBMISSIONS;
  if (!cms) return d;

  const pillarsRaw = cms.pillars ?? [];
  const pillars: GtpSubmissionsResolvedCopy["pillars"] = [
    textPairOrDefault(pillarsRaw[0], d.pillars[0]),
    textPairOrDefault(pillarsRaw[1], d.pillars[1]),
    textPairOrDefault(pillarsRaw[2], d.pillars[2]),
  ];

  const themesRaw = cms.themes ?? [];
  const themes = d.themes.map((def, i) =>
    textPairOrDefault(themesRaw[i], def),
  ) as GtpSubmissionsResolvedCopy["themes"];

  const heroTitleSize =
    cms.heroTitleSize === "default" || cms.heroTitleSize === "compact"
      ? cms.heroTitleSize
      : d.heroTitleSize;

  return {
    heroTitle: cms.heroTitle?.trim() || d.heroTitle,
    heroLede: cms.heroLede?.trim() || d.heroLede,
    heroTitleSize,
    pillarsIntroBold: cms.pillarsIntroBold?.trim() || d.pillarsIntroBold,
    pillarsIntro: cms.pillarsIntro?.trim() || d.pillarsIntro,
    pillarsOutro: cms.pillarsOutro?.trim() || d.pillarsOutro,
    pillarsLinkLabel: cms.pillarsLinkLabel?.trim() || d.pillarsLinkLabel,
    pillarsLinkUrl: cms.pillarsLinkUrl?.trim() || d.pillarsLinkUrl,
    pillars,
    themesSectionTitle: cms.themesSectionTitle?.trim() || d.themesSectionTitle,
    themesIntro: cms.themesIntro?.trim() || d.themesIntro,
    themes,
    ctaTitle: cms.ctaTitle?.trim() || d.ctaTitle,
    ctaSubtitle: cms.ctaSubtitle?.trim() || d.ctaSubtitle,
    abstractTabLabel: cms.abstractTabLabel?.trim() || d.abstractTabLabel,
    abstractDeadline: cms.abstractDeadline?.trim() || d.abstractDeadline,
    workshopTabLabel: cms.workshopTabLabel?.trim() || d.workshopTabLabel,
    workshopDeadline: cms.workshopDeadline?.trim() || d.workshopDeadline,
    abstractFormIntro: cms.abstractFormIntro?.trim() || d.abstractFormIntro,
    workshopFormIntro: cms.workshopFormIntro?.trim() || d.workshopFormIntro,
    backToTopLabel: cms.backToTopLabel?.trim() || d.backToTopLabel,
  };
}

// ─── Media & Biz forum (sections + placeholder) ──────────────────────────────

export type GtpMarketingSectionPageData = {
  pageTitle?: string | null;
  heroLede?: string | null;
  placeholderDescription?: string | null;
  sections: SectionBlock[] | null;
};

const mediaPageQuery = `*[_type == "gtp2026MediaPage"][0]{
  pageTitle,
  heroLede,
  placeholderDescription,
  sections
}`;

const bizForumPageQuery = `*[_type == "gtp2026BizForumPage"][0]{
  pageTitle,
  heroLede,
  placeholderDescription,
  sections
}`;

export async function getGtp2026MediaPage(): Promise<GtpMarketingSectionPageData | null> {
  return client.fetch(mediaPageQuery);
}

export async function getGtp2026BizForumPage(): Promise<GtpMarketingSectionPageData | null> {
  return client.fetch(bizForumPageQuery);
}
