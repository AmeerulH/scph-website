import type {
  GtpAbstractFormCopy,
  GtpSubmissionsEvalGroupResolved,
  GtpSubmissionsRichSectionResolved,
  GtpWorkshopFormCopy,
} from "./gtp-submissions-form-defaults";

function s(v: string | null | undefined, d: string): string {
  const t = v?.trim();
  return t || d;
}

function mergeStrList(
  cms: string[] | null | undefined,
  d: string[],
): string[] {
  if (!cms?.length) return d;
  const out = cms.map((x) => x?.trim()).filter(Boolean) as string[];
  return out.length ? out : d;
}

function n(cms: number | null | undefined, d: number): number {
  return typeof cms === "number" && Number.isFinite(cms) && cms > 0 ? cms : d;
}

type SanityRichSectionRaw = {
  title?: string | null;
  intro?: string | null;
  bullets?: string[] | null;
  footer?: string | null;
};

function mergeRichSections(
  cms: SanityRichSectionRaw[] | null | undefined,
  defs: GtpSubmissionsRichSectionResolved[],
): GtpSubmissionsRichSectionResolved[] {
  if (!cms?.length) return defs;
  const merged = defs.map((def, i) => {
    const row = cms[i];
    if (!row) return def;
    return {
      title: s(row.title, def.title),
      intro: s(row.intro, def.intro),
      footer: s(row.footer, def.footer),
      bullets: mergeStrList(row.bullets, def.bullets),
    };
  });
  const extra = cms.slice(defs.length).flatMap((row) => {
    const title = row.title?.trim();
    if (!title) return [];
    return [
      {
        title,
        intro: row.intro?.trim() ?? "",
        footer: row.footer?.trim() ?? "",
        bullets: mergeStrList(row.bullets, []),
      },
    ];
  });
  return [...merged, ...extra];
}

type SanityEvalGroupRaw = {
  title?: string | null;
  items?: string[] | null;
};

function mergeEvalGroups(
  cms: SanityEvalGroupRaw[] | null | undefined,
  defs: GtpSubmissionsEvalGroupResolved[],
): GtpSubmissionsEvalGroupResolved[] {
  if (!cms?.length) return defs;
  const merged = defs.map((def, i) => {
    const row = cms[i];
    if (!row) return def;
    return {
      title: s(row.title, def.title),
      items: mergeStrList(row.items, def.items),
    };
  });
  const extra = cms.slice(defs.length).flatMap((row) => {
    const title = row.title?.trim();
    if (!title) return [];
    return [
      {
        title,
        items: mergeStrList(row.items, []),
      },
    ];
  });
  return [...merged, ...extra];
}

export type SanityAbstractFormRaw = {
  headerTitle?: string | null;
  headerSubtitle?: string | null;
  introParagraph1?: string | null;
  introParagraph2?: string | null;
  guidelinesTitle?: string | null;
  guidelinesBullets?: string[] | null;
  importantDatesTitle?: string | null;
  importantDatesBullets?: string[] | null;
  contactLead?: string | null;
  contactEmail?: string | null;
  contactMailtoSubject?: string | null;
  contactSubjectEmphasis?: string | null;
  presentingAuthorNote?: string | null;
  sectionPresenterDetails?: string | null;
  sectionSubmissionDetails?: string | null;
  labelEmail?: string | null;
  labelFullName?: string | null;
  labelInstitution?: string | null;
  labelDesignation?: string | null;
  designationPlaceholder?: string | null;
  labelCountry?: string | null;
  labelEarlyCareerQuestion?: string | null;
  earlyCareerYesLabel?: string | null;
  earlyCareerNoLabel?: string | null;
  labelPrimaryTheme?: string | null;
  labelPresentationPreference?: string | null;
  presentationOralLabel?: string | null;
  presentationPosterLabel?: string | null;
  labelAbstractTitle?: string | null;
  placeholderAbstractTitle?: string | null;
  abstractTitleMaxWords?: number | null;
  labelAbstract?: string | null;
  helperAbstract?: string | null;
  placeholderAbstract?: string | null;
  abstractBodyMaxWords?: number | null;
  labelAuthorList?: string | null;
  placeholderAuthorList?: string | null;
  wordCountLimitReachedSuffix?: string | null;
  submitButtonIdle?: string | null;
  submitButtonSubmitting?: string | null;
  overlaySubmittingLabel?: string | null;
  successSnackbarMessage?: string | null;
  fieldGenericPlaceholder?: string | null;
} | null;

export type SanityWorkshopFormRaw = {
  headerTitle?: string | null;
  headerSubtitle?: string | null;
  introParagraph1?: string | null;
  introParagraph2?: string | null;
  introParagraph3?: string | null;
  pillarsThemesCalloutTitle?: string | null;
  requirementsPanelTitle?: string | null;
  requirementsSections?: SanityRichSectionRaw[] | null;
  evaluationCriteriaTitle?: string | null;
  evaluationGroups?: SanityEvalGroupRaw[] | null;
  importantDatesTitle?: string | null;
  importantDatesBullets?: string[] | null;
  contactLead?: string | null;
  contactEmail?: string | null;
  contactMailtoSubject?: string | null;
  contactSubjectEmphasis?: string | null;
  registrationFeeNote?: string | null;
  sectionConvenerDetails?: string | null;
  sectionSessionOverview?: string | null;
  sectionSessionOutline?: string | null;
  sectionResourceRequirements?: string | null;
  sectionDeclaration?: string | null;
  labelEmail?: string | null;
  labelFullName?: string | null;
  labelInstitution?: string | null;
  labelDesignation?: string | null;
  designationPlaceholder?: string | null;
  labelCountry?: string | null;
  labelProposedSessionTitle?: string | null;
  placeholderSessionTitle?: string | null;
  sessionTitleMaxWords?: number | null;
  labelPrimaryPillar?: string | null;
  primaryPillarOptions?: string[] | null;
  labelPrimaryThematicArea?: string | null;
  labelSecondaryThemes?: string | null;
  secondaryThemesHint?: string | null;
  secondaryThemesPrimaryBadge?: string | null;
  secondaryThemesMaxSelectedNote?: string | null;
  labelSessionObjectives?: string | null;
  placeholderSessionObjectives?: string | null;
  labelExpectedOutcomes?: string | null;
  helperExpectedOutcomes?: string | null;
  labelSessionDetails?: string | null;
  helperSessionDetails?: string | null;
  labelSpeakerList?: string | null;
  helperSpeakerList?: string | null;
  labelResourceRequirements?: string | null;
  helperResourceRequirements?: string | null;
  labelFinancialResources?: string | null;
  financialOptionYes?: string | null;
  financialOptionNo?: string | null;
  financialOptionUncertain?: string | null;
  labelDiversityStatement?: string | null;
  placeholderDiversityStatement?: string | null;
  labelConflictOfInterest?: string | null;
  conflictIntro?: string | null;
  conflictOptionNoConflicts?: string | null;
  conflictOptionHasConflicts?: string | null;
  labelConflictDetails?: string | null;
  placeholderConflictDetails?: string | null;
  submitButtonIdle?: string | null;
  submitButtonSubmitting?: string | null;
  overlaySubmittingLabel?: string | null;
  successSnackbarMessage?: string | null;
  fieldGenericPlaceholder?: string | null;
  wordCountLimitReachedSuffix?: string | null;
} | null;

export function mergeAbstractFormCopy(
  cms: SanityAbstractFormRaw,
  d: GtpAbstractFormCopy,
): GtpAbstractFormCopy {
  if (!cms) return d;
  return {
    headerTitle: s(cms.headerTitle, d.headerTitle),
    headerSubtitle: s(cms.headerSubtitle, d.headerSubtitle),
    introParagraph1: s(cms.introParagraph1, d.introParagraph1),
    introParagraph2: s(cms.introParagraph2, d.introParagraph2),
    guidelinesTitle: s(cms.guidelinesTitle, d.guidelinesTitle),
    guidelinesBullets: mergeStrList(cms.guidelinesBullets, d.guidelinesBullets),
    importantDatesTitle: s(cms.importantDatesTitle, d.importantDatesTitle),
    importantDatesBullets: mergeStrList(
      cms.importantDatesBullets,
      d.importantDatesBullets,
    ),
    contactLead: s(cms.contactLead, d.contactLead),
    contactEmail: s(cms.contactEmail, d.contactEmail),
    contactMailtoSubject: s(cms.contactMailtoSubject, d.contactMailtoSubject),
    contactSubjectEmphasis: s(
      cms.contactSubjectEmphasis,
      d.contactSubjectEmphasis,
    ),
    presentingAuthorNote: s(cms.presentingAuthorNote, d.presentingAuthorNote),
    sectionPresenterDetails: s(
      cms.sectionPresenterDetails,
      d.sectionPresenterDetails,
    ),
    sectionSubmissionDetails: s(
      cms.sectionSubmissionDetails,
      d.sectionSubmissionDetails,
    ),
    labelEmail: s(cms.labelEmail, d.labelEmail),
    labelFullName: s(cms.labelFullName, d.labelFullName),
    labelInstitution: s(cms.labelInstitution, d.labelInstitution),
    labelDesignation: s(cms.labelDesignation, d.labelDesignation),
    designationPlaceholder: s(
      cms.designationPlaceholder,
      d.designationPlaceholder,
    ),
    labelCountry: s(cms.labelCountry, d.labelCountry),
    labelEarlyCareerQuestion: s(
      cms.labelEarlyCareerQuestion,
      d.labelEarlyCareerQuestion,
    ),
    earlyCareerYesLabel: s(cms.earlyCareerYesLabel, d.earlyCareerYesLabel),
    earlyCareerNoLabel: s(cms.earlyCareerNoLabel, d.earlyCareerNoLabel),
    labelPrimaryTheme: s(cms.labelPrimaryTheme, d.labelPrimaryTheme),
    labelPresentationPreference: s(
      cms.labelPresentationPreference,
      d.labelPresentationPreference,
    ),
    presentationOralLabel: s(
      cms.presentationOralLabel,
      d.presentationOralLabel,
    ),
    presentationPosterLabel: s(
      cms.presentationPosterLabel,
      d.presentationPosterLabel,
    ),
    labelAbstractTitle: s(cms.labelAbstractTitle, d.labelAbstractTitle),
    placeholderAbstractTitle: s(
      cms.placeholderAbstractTitle,
      d.placeholderAbstractTitle,
    ),
    abstractTitleMaxWords: n(cms.abstractTitleMaxWords, d.abstractTitleMaxWords),
    labelAbstract: s(cms.labelAbstract, d.labelAbstract),
    helperAbstract: s(cms.helperAbstract, d.helperAbstract),
    placeholderAbstract: s(cms.placeholderAbstract, d.placeholderAbstract),
    abstractBodyMaxWords: n(cms.abstractBodyMaxWords, d.abstractBodyMaxWords),
    labelAuthorList: s(cms.labelAuthorList, d.labelAuthorList),
    placeholderAuthorList: s(
      cms.placeholderAuthorList,
      d.placeholderAuthorList,
    ),
    wordCountLimitReachedSuffix: s(
      cms.wordCountLimitReachedSuffix,
      d.wordCountLimitReachedSuffix,
    ),
    submitButtonIdle: s(cms.submitButtonIdle, d.submitButtonIdle),
    submitButtonSubmitting: s(
      cms.submitButtonSubmitting,
      d.submitButtonSubmitting,
    ),
    overlaySubmittingLabel: s(
      cms.overlaySubmittingLabel,
      d.overlaySubmittingLabel,
    ),
    successSnackbarMessage: s(
      cms.successSnackbarMessage,
      d.successSnackbarMessage,
    ),
    fieldGenericPlaceholder: s(
      cms.fieldGenericPlaceholder,
      d.fieldGenericPlaceholder,
    ),
  };
}

export function mergeWorkshopFormCopy(
  cms: SanityWorkshopFormRaw,
  d: GtpWorkshopFormCopy,
): GtpWorkshopFormCopy {
  if (!cms) return d;
  return {
    headerTitle: s(cms.headerTitle, d.headerTitle),
    headerSubtitle: s(cms.headerSubtitle, d.headerSubtitle),
    introParagraph1: s(cms.introParagraph1, d.introParagraph1),
    introParagraph2: s(cms.introParagraph2, d.introParagraph2),
    introParagraph3: s(cms.introParagraph3, d.introParagraph3),
    pillarsThemesCalloutTitle: s(
      cms.pillarsThemesCalloutTitle,
      d.pillarsThemesCalloutTitle,
    ),
    requirementsPanelTitle: s(
      cms.requirementsPanelTitle,
      d.requirementsPanelTitle,
    ),
    requirementsSections: mergeRichSections(
      cms.requirementsSections,
      d.requirementsSections,
    ),
    evaluationCriteriaTitle: s(
      cms.evaluationCriteriaTitle,
      d.evaluationCriteriaTitle,
    ),
    evaluationGroups: mergeEvalGroups(
      cms.evaluationGroups,
      d.evaluationGroups,
    ),
    importantDatesTitle: s(cms.importantDatesTitle, d.importantDatesTitle),
    importantDatesBullets: mergeStrList(
      cms.importantDatesBullets,
      d.importantDatesBullets,
    ),
    contactLead: s(cms.contactLead, d.contactLead),
    contactEmail: s(cms.contactEmail, d.contactEmail),
    contactMailtoSubject: s(cms.contactMailtoSubject, d.contactMailtoSubject),
    contactSubjectEmphasis: s(
      cms.contactSubjectEmphasis,
      d.contactSubjectEmphasis,
    ),
    registrationFeeNote: s(cms.registrationFeeNote, d.registrationFeeNote),
    sectionConvenerDetails: s(
      cms.sectionConvenerDetails,
      d.sectionConvenerDetails,
    ),
    sectionSessionOverview: s(
      cms.sectionSessionOverview,
      d.sectionSessionOverview,
    ),
    sectionSessionOutline: s(
      cms.sectionSessionOutline,
      d.sectionSessionOutline,
    ),
    sectionResourceRequirements: s(
      cms.sectionResourceRequirements,
      d.sectionResourceRequirements,
    ),
    sectionDeclaration: s(cms.sectionDeclaration, d.sectionDeclaration),
    labelEmail: s(cms.labelEmail, d.labelEmail),
    labelFullName: s(cms.labelFullName, d.labelFullName),
    labelInstitution: s(cms.labelInstitution, d.labelInstitution),
    labelDesignation: s(cms.labelDesignation, d.labelDesignation),
    designationPlaceholder: s(
      cms.designationPlaceholder,
      d.designationPlaceholder,
    ),
    labelCountry: s(cms.labelCountry, d.labelCountry),
    labelProposedSessionTitle: s(
      cms.labelProposedSessionTitle,
      d.labelProposedSessionTitle,
    ),
    placeholderSessionTitle: s(
      cms.placeholderSessionTitle,
      d.placeholderSessionTitle,
    ),
    sessionTitleMaxWords: n(cms.sessionTitleMaxWords, d.sessionTitleMaxWords),
    labelPrimaryPillar: s(cms.labelPrimaryPillar, d.labelPrimaryPillar),
    primaryPillarOptions: mergeStrList(
      cms.primaryPillarOptions,
      d.primaryPillarOptions,
    ),
    labelPrimaryThematicArea: s(
      cms.labelPrimaryThematicArea,
      d.labelPrimaryThematicArea,
    ),
    labelSecondaryThemes: s(cms.labelSecondaryThemes, d.labelSecondaryThemes),
    secondaryThemesHint: s(cms.secondaryThemesHint, d.secondaryThemesHint),
    secondaryThemesPrimaryBadge: s(
      cms.secondaryThemesPrimaryBadge,
      d.secondaryThemesPrimaryBadge,
    ),
    secondaryThemesMaxSelectedNote: s(
      cms.secondaryThemesMaxSelectedNote,
      d.secondaryThemesMaxSelectedNote,
    ),
    labelSessionObjectives: s(
      cms.labelSessionObjectives,
      d.labelSessionObjectives,
    ),
    placeholderSessionObjectives: s(
      cms.placeholderSessionObjectives,
      d.placeholderSessionObjectives,
    ),
    labelExpectedOutcomes: s(
      cms.labelExpectedOutcomes,
      d.labelExpectedOutcomes,
    ),
    helperExpectedOutcomes: s(
      cms.helperExpectedOutcomes,
      d.helperExpectedOutcomes,
    ),
    labelSessionDetails: s(cms.labelSessionDetails, d.labelSessionDetails),
    helperSessionDetails: s(cms.helperSessionDetails, d.helperSessionDetails),
    labelSpeakerList: s(cms.labelSpeakerList, d.labelSpeakerList),
    helperSpeakerList: s(cms.helperSpeakerList, d.helperSpeakerList),
    labelResourceRequirements: s(
      cms.labelResourceRequirements,
      d.labelResourceRequirements,
    ),
    helperResourceRequirements: s(
      cms.helperResourceRequirements,
      d.helperResourceRequirements,
    ),
    labelFinancialResources: s(
      cms.labelFinancialResources,
      d.labelFinancialResources,
    ),
    financialOptionYes: s(cms.financialOptionYes, d.financialOptionYes),
    financialOptionNo: s(cms.financialOptionNo, d.financialOptionNo),
    financialOptionUncertain: s(
      cms.financialOptionUncertain,
      d.financialOptionUncertain,
    ),
    labelDiversityStatement: s(
      cms.labelDiversityStatement,
      d.labelDiversityStatement,
    ),
    placeholderDiversityStatement: s(
      cms.placeholderDiversityStatement,
      d.placeholderDiversityStatement,
    ),
    labelConflictOfInterest: s(
      cms.labelConflictOfInterest,
      d.labelConflictOfInterest,
    ),
    conflictIntro: s(cms.conflictIntro, d.conflictIntro),
    conflictOptionNoConflicts: s(
      cms.conflictOptionNoConflicts,
      d.conflictOptionNoConflicts,
    ),
    conflictOptionHasConflicts: s(
      cms.conflictOptionHasConflicts,
      d.conflictOptionHasConflicts,
    ),
    labelConflictDetails: s(cms.labelConflictDetails, d.labelConflictDetails),
    placeholderConflictDetails: s(
      cms.placeholderConflictDetails,
      d.placeholderConflictDetails,
    ),
    submitButtonIdle: s(cms.submitButtonIdle, d.submitButtonIdle),
    submitButtonSubmitting: s(
      cms.submitButtonSubmitting,
      d.submitButtonSubmitting,
    ),
    overlaySubmittingLabel: s(
      cms.overlaySubmittingLabel,
      d.overlaySubmittingLabel,
    ),
    successSnackbarMessage: s(
      cms.successSnackbarMessage,
      d.successSnackbarMessage,
    ),
    fieldGenericPlaceholder: s(
      cms.fieldGenericPlaceholder,
      d.fieldGenericPlaceholder,
    ),
    wordCountLimitReachedSuffix: s(
      cms.wordCountLimitReachedSuffix,
      d.wordCountLimitReachedSuffix,
    ),
  };
}
