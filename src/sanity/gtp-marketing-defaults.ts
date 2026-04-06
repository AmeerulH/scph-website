/**
 * Plain defaults for GTP marketing pages (no Sanity client).
 * Used by merge helpers in gtp-stage2.ts and by seed scripts under scripts/.
 */

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
