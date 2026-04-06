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

export type {
  GtpAbstractFormCopy,
  GtpSubmissionsEvalGroupResolved,
  GtpSubmissionsRichSectionResolved,
  GtpWorkshopFormCopy,
} from "./gtp-submissions-form-defaults";

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

export const DEFAULT_GET_INVOLVED: GtpGetInvolvedResolvedCopy = {
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

export const DEFAULT_REGISTER: GtpRegisterResolvedCopy = {
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
