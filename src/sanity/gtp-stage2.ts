import { client } from "./client";
import { footerSocialIconSrc } from "@/lib/footer-social-icons";
import { sanitizeGoogleMapsEmbedUrl } from "@/lib/google-maps-embed";
import {
  DEFAULT_GET_INVOLVED,
  DEFAULT_SUBMISSIONS,
  type GtpGetInvolvedResolvedCopy,
  type GtpGetInvolvedSocialLink,
  type GtpSubmissionsPillarCopy,
  type GtpSubmissionsResolvedCopy,
  type GtpSubmissionsThemeCopy,
} from "./gtp-marketing-defaults";
import {
  mergeAbstractFormCopy,
  mergeWorkshopFormCopy,
  type SanityAbstractFormRaw,
  type SanityWorkshopFormRaw,
} from "./gtp-submissions-form-merge";
import type { SectionBlock } from "./section-block-types";

export type {
  GtpGetInvolvedResolvedCopy,
  GtpGetInvolvedSocialLink,
  GtpSubmissionsPillarCopy,
  GtpSubmissionsResolvedCopy,
  GtpSubmissionsThemeCopy,
};

// ─── Get involved ────────────────────────────────────────────────────────────

type SanityGetInvolvedRaw = {
  heroTitle?: string | null;
  heroLede?: string | null;
  contactSectionTitle?: string | null;
  contactSectionSubtitle?: string | null;
  contactIntro?: string | null;
  contactIntroSuffix?: string | null;
  contactFaqLinkLabel?: string | null;
  contactFaqHref?: string | null;
  contactOrgName?: string | null;
  contactOrgAddress?: string | null;
  contactConferenceDates?: string | null;
  contactInfoAddressLabel?: string | null;
  contactInfoAddress?: string | null;
  contactInfoHoursLabel?: string | null;
  contactInfoHours?: string | null;
  contactInfoPhoneLabel?: string | null;
  contactInfoPhone?: string | null;
  contactInfoPhoneTel?: string | null;
  contactInfoEmailLabel?: string | null;
  contactInfoEmail?: string | null;
  contactInfoSocialHeading?: string | null;
  contactInfoSocialLinks?: {
    label?: string | null;
    href?: string | null;
    iconKey?: string | null;
  }[] | null;
  contactMapEmbedUrl?: string | null;
  contactMapTitle?: string | null;
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
  contactIntroSuffix,
  contactFaqLinkLabel,
  contactFaqHref,
  contactOrgName,
  contactOrgAddress,
  contactConferenceDates,
  contactInfoAddressLabel,
  contactInfoAddress,
  contactInfoHoursLabel,
  contactInfoHours,
  contactInfoPhoneLabel,
  contactInfoPhone,
  contactInfoPhoneTel,
  contactInfoEmailLabel,
  contactInfoEmail,
  contactInfoSocialHeading,
  contactInfoSocialLinks[]{ label, href, iconKey },
  contactMapEmbedUrl,
  contactMapTitle,
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

function nonEmpty(s: string | null | undefined): string | undefined {
  const t = typeof s === "string" ? s.trim() : "";
  return t ? t : undefined;
}

/** Strip legacy “For more information, contact us at …” lines from Studio copy. */
function stripForMoreInformationContactSentence(s: string): string {
  const without = s
    .replace(
      /\n\s*For more information,?\s*contact us at\s+[^\n]+/gi,
      "",
    )
    .replace(
      /\s*For more information,?\s*contact us at\s+[^\n.]+(?:\.[^\s]*)?\.?/gi,
      "",
    );
  return without.replace(/\s{2,}/g, " ").trim();
}

function normalizeGetInvolvedSocialLinks(
  raw: SanityGetInvolvedRaw["contactInfoSocialLinks"],
  fallback: GtpGetInvolvedSocialLink[],
): GtpGetInvolvedSocialLink[] {
  if (!Array.isArray(raw)) return [...fallback];
  const out: GtpGetInvolvedSocialLink[] = [];
  for (const item of raw) {
    if (!item || typeof item !== "object") continue;
    const label = nonEmpty(item.label);
    const href = nonEmpty(item.href);
    const iconKey = nonEmpty(item.iconKey);
    if (!label || !href || !iconKey) continue;
    out.push({
      label,
      href,
      iconSrc: footerSocialIconSrc(iconKey),
    });
  }
  return out.length > 0 ? out : [...fallback];
}

export function mergeGtpGetInvolvedCopy(
  cms: SanityGetInvolvedRaw | null,
): GtpGetInvolvedResolvedCopy {
  const d = DEFAULT_GET_INVOLVED;
  if (!cms) return d;

  const faqLabel = nonEmpty(cms.contactFaqLinkLabel);
  const faqHref = nonEmpty(cms.contactFaqHref);
  const faqEnabled = Boolean(faqLabel && faqHref);

  const introSuffixFromCms = nonEmpty(cms.contactIntroSuffix);
  const introSuffixRaw =
    introSuffixFromCms ??
    (faqEnabled ? d.contact.introSuffix : "");
  const introSuffix = stripForMoreInformationContactSentence(introSuffixRaw);

  const addressBody =
    nonEmpty(cms.contactInfoAddress) ??
    nonEmpty(cms.contactOrgAddress) ??
    d.contact.addressBody;

  const phoneTelExplicit =
    cms.contactInfoPhoneTel !== undefined && cms.contactInfoPhoneTel !== null
      ? String(cms.contactInfoPhoneTel).trim()
      : undefined;
  const phoneTel =
    phoneTelExplicit !== undefined ? phoneTelExplicit : d.contact.phoneTel;

  return {
    heroTitle: cms.heroTitle?.trim() || d.heroTitle,
    heroLede: cms.heroLede?.trim() || d.heroLede,
    contact: {
      sectionTitle:
        cms.contactSectionTitle?.trim() || d.contact.sectionTitle,
      sectionSubtitle:
        cms.contactSectionSubtitle?.trim() || d.contact.sectionSubtitle,
      intro: stripForMoreInformationContactSentence(
        cms.contactIntro?.trim() || d.contact.intro,
      ),
      introSuffix,
      faqLinkLabel: faqEnabled ? faqLabel! : "",
      faqHref: faqEnabled ? faqHref! : "",
      orgName: cms.contactOrgName?.trim() || d.contact.orgName,
      orgAddress: cms.contactOrgAddress?.trim() || d.contact.orgAddress,
      conferenceDates:
        cms.contactConferenceDates?.trim() || d.contact.conferenceDates,
      addressLabel:
        nonEmpty(cms.contactInfoAddressLabel) ?? d.contact.addressLabel,
      addressBody,
      hoursLabel: nonEmpty(cms.contactInfoHoursLabel) ?? d.contact.hoursLabel,
      hoursBody: nonEmpty(cms.contactInfoHours) ?? d.contact.hoursBody,
      phoneLabel: nonEmpty(cms.contactInfoPhoneLabel) ?? d.contact.phoneLabel,
      phoneDisplay: nonEmpty(cms.contactInfoPhone) ?? d.contact.phoneDisplay,
      phoneTel,
      emailLabel: nonEmpty(cms.contactInfoEmailLabel) ?? d.contact.emailLabel,
      email: nonEmpty(cms.contactInfoEmail) ?? d.contact.email,
      socialHeading:
        nonEmpty(cms.contactInfoSocialHeading) ?? d.contact.socialHeading,
      socialLinks: normalizeGetInvolvedSocialLinks(
        cms.contactInfoSocialLinks,
        d.contact.socialLinks,
      ),
      mapEmbedUrl:
        sanitizeGoogleMapsEmbedUrl(cms.contactMapEmbedUrl ?? null) ??
        d.contact.mapEmbedUrl,
      mapIframeTitle:
        nonEmpty(cms.contactMapTitle) ?? d.contact.mapIframeTitle,
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

// ─── Submissions ─────────────────────────────────────────────────────────────

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
  abstractForm?: SanityAbstractFormRaw;
  workshopForm?: SanityWorkshopFormRaw;
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
  backToTopLabel,
  abstractForm {
    headerTitle,
    headerSubtitle,
    introParagraph1,
    introParagraph2,
    guidelinesTitle,
    guidelinesBullets,
    importantDatesTitle,
    importantDatesBullets,
    contactLead,
    contactEmail,
    contactMailtoSubject,
    contactSubjectEmphasis,
    presentingAuthorNote,
    sectionPresenterDetails,
    sectionSubmissionDetails,
    labelEmail,
    labelFullName,
    labelInstitution,
    labelDesignation,
    designationPlaceholder,
    labelCountry,
    labelEarlyCareerQuestion,
    earlyCareerYesLabel,
    earlyCareerNoLabel,
    labelPrimaryTheme,
    labelPresentationPreference,
    presentationOralLabel,
    presentationPosterLabel,
    labelAbstractTitle,
    placeholderAbstractTitle,
    abstractTitleMaxWords,
    labelAbstract,
    helperAbstract,
    placeholderAbstract,
    abstractBodyMaxWords,
    labelAuthorList,
    placeholderAuthorList,
    wordCountLimitReachedSuffix,
    submitButtonIdle,
    submitButtonSubmitting,
    overlaySubmittingLabel,
    successSnackbarMessage,
    fieldGenericPlaceholder
  },
  workshopForm {
    headerTitle,
    headerSubtitle,
    introParagraph1,
    introParagraph2,
    introParagraph3,
    pillarsThemesCalloutTitle,
    requirementsPanelTitle,
    requirementsSections[]{ title, intro, bullets, footer },
    evaluationCriteriaTitle,
    evaluationGroups[]{ title, items },
    importantDatesTitle,
    importantDatesBullets,
    contactLead,
    contactEmail,
    contactMailtoSubject,
    contactSubjectEmphasis,
    registrationFeeNote,
    sectionConvenerDetails,
    sectionSessionOverview,
    sectionSessionOutline,
    sectionResourceRequirements,
    sectionDeclaration,
    labelEmail,
    labelFullName,
    labelInstitution,
    labelDesignation,
    designationPlaceholder,
    labelCountry,
    labelProposedSessionTitle,
    placeholderSessionTitle,
    sessionTitleMaxWords,
    labelPrimaryPillar,
    primaryPillarOptions,
    labelPrimaryThematicArea,
    labelSecondaryThemes,
    secondaryThemesHint,
    secondaryThemesPrimaryBadge,
    secondaryThemesMaxSelectedNote,
    labelSessionObjectives,
    placeholderSessionObjectives,
    labelExpectedOutcomes,
    helperExpectedOutcomes,
    labelSessionDetails,
    helperSessionDetails,
    labelSpeakerList,
    helperSpeakerList,
    labelResourceRequirements,
    helperResourceRequirements,
    labelFinancialResources,
    financialOptionYes,
    financialOptionNo,
    financialOptionUncertain,
    labelDiversityStatement,
    placeholderDiversityStatement,
    labelConflictOfInterest,
    conflictIntro,
    conflictOptionNoConflicts,
    conflictOptionHasConflicts,
    labelConflictDetails,
    placeholderConflictDetails,
    submitButtonIdle,
    submitButtonSubmitting,
    overlaySubmittingLabel,
    successSnackbarMessage,
    fieldGenericPlaceholder,
    wordCountLimitReachedSuffix
  }
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
    abstractForm: mergeAbstractFormCopy(
      cms.abstractForm ?? null,
      d.abstractForm,
    ),
    workshopForm: mergeWorkshopFormCopy(
      cms.workshopForm ?? null,
      d.workshopForm,
    ),
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
