/**
 * Default in-form copy for GTP submissions (abstract + workshop).
 * Merged with Sanity `abstractForm` / `workshopForm` on `gtp2026SubmissionsPage`.
 */

export type GtpSubmissionsRichSectionResolved = {
  title: string;
  intro: string;
  footer: string;
  bullets: string[];
};

export type GtpSubmissionsEvalGroupResolved = {
  title: string;
  items: string[];
};

export type GtpAbstractFormCopy = {
  headerTitle: string;
  headerSubtitle: string;
  introParagraph1: string;
  introParagraph2: string;
  guidelinesTitle: string;
  guidelinesBullets: string[];
  importantDatesTitle: string;
  importantDatesBullets: string[];
  contactLead: string;
  contactEmail: string;
  contactMailtoSubject: string;
  contactSubjectEmphasis: string;
  presentingAuthorNote: string;
  sectionPresenterDetails: string;
  sectionSubmissionDetails: string;
  labelEmail: string;
  labelFullName: string;
  labelInstitution: string;
  labelDesignation: string;
  designationPlaceholder: string;
  labelCountry: string;
  labelEarlyCareerQuestion: string;
  earlyCareerYesLabel: string;
  earlyCareerNoLabel: string;
  labelPrimaryTheme: string;
  labelPresentationPreference: string;
  presentationOralLabel: string;
  presentationPosterLabel: string;
  labelAbstractTitle: string;
  placeholderAbstractTitle: string;
  abstractTitleMaxWords: number;
  labelAbstract: string;
  helperAbstract: string;
  placeholderAbstract: string;
  abstractBodyMaxWords: number;
  labelAuthorList: string;
  placeholderAuthorList: string;
  wordCountLimitReachedSuffix: string;
  submitButtonIdle: string;
  submitButtonSubmitting: string;
  overlaySubmittingLabel: string;
  successSnackbarMessage: string;
  fieldGenericPlaceholder: string;
};

export type GtpWorkshopFormCopy = {
  headerTitle: string;
  headerSubtitle: string;
  introParagraph1: string;
  introParagraph2: string;
  introParagraph3: string;
  pillarsThemesCalloutTitle: string;
  requirementsPanelTitle: string;
  requirementsSections: GtpSubmissionsRichSectionResolved[];
  evaluationCriteriaTitle: string;
  evaluationGroups: GtpSubmissionsEvalGroupResolved[];
  importantDatesTitle: string;
  importantDatesBullets: string[];
  contactLead: string;
  contactEmail: string;
  contactMailtoSubject: string;
  contactSubjectEmphasis: string;
  registrationFeeNote: string;
  sectionConvenerDetails: string;
  sectionSessionOverview: string;
  sectionSessionOutline: string;
  sectionResourceRequirements: string;
  sectionDeclaration: string;
  labelEmail: string;
  labelFullName: string;
  labelInstitution: string;
  labelDesignation: string;
  designationPlaceholder: string;
  labelCountry: string;
  labelProposedSessionTitle: string;
  placeholderSessionTitle: string;
  sessionTitleMaxWords: number;
  labelPrimaryPillar: string;
  primaryPillarOptions: string[];
  labelPrimaryThematicArea: string;
  labelSecondaryThemes: string;
  secondaryThemesHint: string;
  secondaryThemesPrimaryBadge: string;
  secondaryThemesMaxSelectedNote: string;
  labelSessionObjectives: string;
  placeholderSessionObjectives: string;
  labelExpectedOutcomes: string;
  helperExpectedOutcomes: string;
  labelSessionDetails: string;
  helperSessionDetails: string;
  labelSpeakerList: string;
  helperSpeakerList: string;
  labelResourceRequirements: string;
  helperResourceRequirements: string;
  labelFinancialResources: string;
  financialOptionYes: string;
  financialOptionNo: string;
  financialOptionUncertain: string;
  labelDiversityStatement: string;
  placeholderDiversityStatement: string;
  labelConflictOfInterest: string;
  conflictIntro: string;
  conflictOptionNoConflicts: string;
  conflictOptionHasConflicts: string;
  labelConflictDetails: string;
  placeholderConflictDetails: string;
  submitButtonIdle: string;
  submitButtonSubmitting: string;
  overlaySubmittingLabel: string;
  successSnackbarMessage: string;
  fieldGenericPlaceholder: string;
  wordCountLimitReachedSuffix: string;
};

export const DEFAULT_ABSTRACT_FORM_COPY: GtpAbstractFormCopy = {
  headerTitle: "Global Tipping Points Conference 2026",
  headerSubtitle: "Call for Abstracts Submission Form",
  introParagraph1:
    "Building on the transformative insights of the Global Tipping Points Report 2025, this conference accelerates scientific understanding of critical thresholds that will determine our collective future. GTP 2026 focuses on Understanding the Shift, Igniting Imagination, and Accelerating Action across planetary boundaries.",
  introParagraph2:
    "We invite submissions advancing scientific understanding across Earth System Science, Technology and AI, Governance, Finance and Business, Faith and Culture, Communications, Nature-based Solutions, and Health. Topics focusing on Asian contexts where solutions are emerging at scale are particularly encouraged.",
  guidelinesTitle: "Submission Guidelines",
  guidelinesBullets: [
    "Abstract title: Maximum 25 words",
    "Abstract length: Maximum 300 words — not including title, author list and affiliation",
    "Submission limit: Every author can submit only two abstracts as the presenting author, but can participate in several abstracts as a co-author",
  ],
  importantDatesTitle: "Important Dates",
  importantDatesBullets: [
    "Submission deadline: 15th May 2026, 23:59 (GMT+8)",
    "Decision notification: 15th June 2026",
  ],
  contactLead: "For enquiries, contact",
  contactEmail: "scph_gtpc2026@sunway.edu.my",
  contactMailtoSubject: "Abstract Submission Inquiry",
  contactSubjectEmphasis: "Abstract Submission Inquiry",
  presentingAuthorNote:
    "This form must be completed by the presenting author (oral/poster).",
  sectionPresenterDetails: "Presenter Details",
  sectionSubmissionDetails: "Submission Details",
  labelEmail: "Email",
  labelFullName: "Title and Full Name (First Name, Last Name)",
  labelInstitution: "Institution",
  labelDesignation: "Designation",
  designationPlaceholder: "If studying, indicate Student",
  labelCountry: "Country",
  labelEarlyCareerQuestion:
    "Are you an early career researcher? (Within 5 years of completing a PhD)",
  earlyCareerYesLabel: "Yes",
  earlyCareerNoLabel: "No",
  labelPrimaryTheme: "Primary Theme (select one)",
  labelPresentationPreference:
    "Presentation preference (subject to committee approval)",
  presentationOralLabel: "Oral",
  presentationPosterLabel: "Poster",
  labelAbstractTitle: "Abstract title",
  placeholderAbstractTitle: "Your abstract title",
  abstractTitleMaxWords: 25,
  labelAbstract: "Abstract",
  helperAbstract: "Not including title, author list and affiliation",
  placeholderAbstract: "Write your abstract here…",
  abstractBodyMaxWords: 300,
  labelAuthorList: "Author list and affiliation",
  placeholderAuthorList:
    "e.g. John Doe (Sunway University, Malaysia), Jane Doe (University of Oxford, UK)",
  wordCountLimitReachedSuffix: " — limit reached",
  submitButtonIdle: "Submit Abstract",
  submitButtonSubmitting: "Submitting…",
  overlaySubmittingLabel: "Submitting abstract",
  successSnackbarMessage:
    "Abstract submitted successfully! We will be in touch by 15th June 2026.",
  fieldGenericPlaceholder: "Your answer",
};

const DEFAULT_WORKSHOP_REQUIREMENTS: GtpSubmissionsRichSectionResolved[] = [
  {
    title: "Session Format",
    intro: "",
    footer: "",
    bullets: [
      "Duration: 1.5 hours",
      "Structure: Clear objectives, engaging format and defined outcomes",
      "Target Audience: Decision-makers, investors, cultural leaders and researchers",
      "Engagement: Interactive elements to build confidence and courage to act",
    ],
  },
  {
    title: "Content Focus",
    intro: "",
    footer: "",
    bullets: [
      "Asian Context: Sessions demonstrating relevance to Asia and emerging economies will be given preference",
      "Rapid Progress: Evidence of potential for systemic change and acceleration",
      "Cross-Disciplinary: Integration of scientific understanding with cultural and ethical dimensions",
      "Decision-Maker Focus: Language and structure designed for leaders who must act under uncertainty",
    ],
  },
  {
    title: "Expected Outcomes",
    intro:
      "Session conveners are expected to produce a short written summary of their session, for which a template will be provided in advance. Sessions should aim and report on tangible outcomes or identify:",
    footer:
      "Note that sessions that satisfy this criteria could possibly inform the Global Tipping Points Report 2027. Lead conveners may be contacted for a follow-up discussion post conference.",
    bullets: [
      "Policy levers, investment signals, or narrative shifts",
      "Case studies or evidence-based approaches",
      "Actionable recommendations for intergovernmental processes, including UNFCCC COP31",
    ],
  },
];

const DEFAULT_WORKSHOP_EVALUATION: GtpSubmissionsEvalGroupResolved[] = [
  {
    title: "Strategic Alignment",
    items: [
      "Connection to GTP Report 2025 findings",
      "Alignment with the three-pillar approach",
      "Potential to accelerate positive tipping points",
    ],
  },
  {
    title: "Impact Potential",
    items: [
      "Potential to inform policy decisions and investment signals",
      "Capacity to generate narrative shifts",
      "Scalability, especially across Asia and emerging economies",
    ],
  },
  {
    title: "Design Quality",
    items: [
      "Engagement strategies for decision-makers",
      "Balance between scientific rigour and accessibility",
      "Innovation in format and delivery",
    ],
  },
  {
    title: "Representation and Diversity",
    items: [
      "Geographical diversity, especially Asian representation",
      "Disciplinary and sectoral diversity",
      "Gender and career stage balance",
    ],
  },
  {
    title: "Practical Feasibility",
    items: [
      "Resource requirements and venue suitability",
      "Convener availability and commitment",
      "Compliance with conference timeline",
    ],
  },
];

export const DEFAULT_WORKSHOP_FORM_COPY: GtpWorkshopFormCopy = {
  headerTitle: "Global Tipping Points Conference 2026",
  headerSubtitle: "Call for Action Workshops",
  introParagraph1:
    "Building on the transformative insights of the 2025 Global Tipping Points Report, GTP 2026 brings together leading scientists, policymakers, industry leaders, practitioners and cultural stakeholders to accelerate positive tipping points across planetary boundaries.",
  introParagraph2:
    "The world is approaching a set of unavoidable decisions that will shape lives, communities, economies and ecosystems for generations. Research on tipping points shows that when the right mix of leadership, investment and public confidence comes together, change can accelerate.",
  introParagraph3:
    "We are seeking innovative 1.5-hour action workshops that identify where progress can move fastest and how leaders can unlock momentum. This call is designed for those who want to be part of shaping the next chapter, not simply reacting to it.",
  pillarsThemesCalloutTitle:
    "Workshops should align with one of the three conference pillars and contribute to any of the eight thematic areas:",
  requirementsPanelTitle:
    "Action Workshop Requirements and Evaluation Criteria",
  requirementsSections: DEFAULT_WORKSHOP_REQUIREMENTS,
  evaluationCriteriaTitle: "Evaluation Criteria",
  evaluationGroups: DEFAULT_WORKSHOP_EVALUATION,
  importantDatesTitle: "Important Dates",
  importantDatesBullets: [
    "Submission deadline: 8th May 2026, 23:59 (GMT+8)",
    "Notification of acceptance: 5th June 2026",
  ],
  contactLead: "For inquiries, contact",
  contactEmail: "scph_gtpc2026@sunway.edu.my",
  contactMailtoSubject: "Action Workshop Inquiry - [Your Topic]",
  contactSubjectEmphasis: "Action Workshop Inquiry — [Your Topic]",
  registrationFeeNote:
    "Note: Registration fee will be waived for speakers/facilitators.",
  sectionConvenerDetails: "Convener Details",
  sectionSessionOverview: "Session Overview",
  sectionSessionOutline: "Session Outline",
  sectionResourceRequirements: "Resource Requirements",
  sectionDeclaration: "Declaration and Acknowledgement",
  labelEmail: "Email",
  labelFullName: "Title and Full Name (First Name, Last Name)",
  labelInstitution: "Institution / Organisation",
  labelDesignation: "Designation",
  designationPlaceholder: "If studying, indicate Student",
  labelCountry: "Country",
  labelProposedSessionTitle: "Proposed Session Title",
  placeholderSessionTitle: "Your session title",
  sessionTitleMaxWords: 10,
  labelPrimaryPillar: "Primary Conference Pillar (select one)",
  primaryPillarOptions: [
    "Understanding the Shift",
    "Igniting Imagination",
    "Accelerating Action",
    "Cross-pillar Integration",
  ],
  labelPrimaryThematicArea: "Primary Thematic Area (select one)",
  labelSecondaryThemes: "Secondary Thematic Area(s)",
  secondaryThemesHint: "(optional — select up to 2, must differ from primary)",
  secondaryThemesPrimaryBadge: "Primary",
  secondaryThemesMaxSelectedNote: "Maximum of 2 secondary themes selected.",
  labelSessionObjectives: "Session Objectives",
  placeholderSessionObjectives:
    "List specific, measurable objectives for your session…",
  labelExpectedOutcomes: "Expected Outcomes",
  helperExpectedOutcomes:
    "Include specific connection to Asian context (if any), evidence of acceleration potential, regional partnerships and scalability…",
  labelSessionDetails: "Session Details",
  helperSessionDetails: `Provide details covering:
1. Session Format — describe the structure and format
2. Session Overview — state brief agenda
3. Engagement Strategies — how will you ensure active participation?
4. Interactive Elements — any specific activities or tools used?`,
  labelSpeakerList:
    "Proposed Speaker / Facilitator / Moderator List (max 5 individuals)",
  helperSpeakerList: `Format:
1. Lead Facilitator: Professor John Doe (Sunway University, Malaysia)
2. Facilitator: Assoc. Prof. Jane Doe (Sunway Centre for Planetary Health, Malaysia)
3. …`,
  labelResourceRequirements:
    "Technical, Venue and Special Requirements",
  helperResourceRequirements: `Please describe:
• Technical needs (equipment, technology or technical support)
• Venue requirements (room setup or space needs)
• Special requirements (interpretation, accessibility, etc.)
• Any other related resource requirements`,
  labelFinancialResources:
    "Do you have the financial resources to fund costs associated with your workshop? (costs include speaker transport and accommodation; the conference host provides venue and basic AV)",
  financialOptionYes: "Yes",
  financialOptionNo: "No",
  financialOptionUncertain: "Uncertain",
  labelDiversityStatement: "Diversity Statement",
  placeholderDiversityStatement:
    "How does this session ensure diverse representation? (Consider geographical diversity, disciplinary and sectoral diversity, inclusion of cultural and ethical perspectives, gender and career stage balance)",
  labelConflictOfInterest: "Conflict of Interest",
  conflictIntro:
    "I declare that I have no conflicts of interest with other special session proposals or potential participants. Any known conflicts will be disclosed immediately.",
  conflictOptionNoConflicts: "Yes, I have no conflicts of interest",
  conflictOptionHasConflicts: "No, I have conflicts",
  labelConflictDetails: "Please specify your conflicts",
  placeholderConflictDetails:
    "Describe the nature of your conflicts of interest…",
  submitButtonIdle: "Submit Workshop Proposal",
  submitButtonSubmitting: "Submitting…",
  overlaySubmittingLabel: "Submitting workshop proposal",
  successSnackbarMessage:
    "Workshop proposal submitted successfully! We will be in touch by 6th June 2026.",
  fieldGenericPlaceholder: "Your answer",
  wordCountLimitReachedSuffix: " — limit reached",
};
