import {cmsSandboxPageType} from './cmsSandboxPageType'
import {gtpAboutPageBandObjectTypes} from './objects/gtpAboutPageBands'
import {gtpAboutWhatIsBandType} from './objects/gtpAboutWhatIsBandType'
import {gtp2026AboutPageType} from './gtp2026AboutPageType'
import {gtp2026BizForumPageType} from './gtp2026BizForumPageType'
import {gtp2026GetInvolvedPageType} from './gtp2026GetInvolvedPageType'
import {gtp2026MediaPageType} from './gtp2026MediaPageType'
import {gtp2026SubmissionsPageType} from './gtp2026SubmissionsPageType'
import {
  gtp2026AbstractFormCopyType,
  gtp2026SubmissionsEvalCriterionGroupType,
  gtp2026SubmissionsRichSectionType,
  gtp2026WorkshopFormCopyType,
} from './gtp2026SubmissionsFormCopyTypes'
import {
  gtp2026SubmissionsPillarSlotType,
  gtp2026SubmissionsThemeSlotType,
} from './gtp2026SubmissionsSlotTypes'
import {gtp2026CommitteeMemberType} from './gtp2026CommitteeMemberType'
import {gtp2026FaqAccordionItemType} from './gtp2026FaqAccordionItemType'
import {gtp2026FaqGroupType} from './gtp2026FaqGroupType'
import {gtp2026HighlightSessionSlotType} from './gtp2026HighlightSessionSlotType'
import {gtp2026HighlightSpeakerType} from './gtp2026HighlightSpeakerType'
import {gtp2026ProgrammeType} from './gtp2026ProgrammeType'
import {scphHomePageType} from './scphHomePageType'
import {scphMeetTheTeamPageType} from './scphMeetTheTeamPageType'
import {scphSectionPageTypes} from './scphSectionsPageTypes'
import {
  scphHomeObjectTypes,
  sectionObjectTypes,
  scphPageBandObjectTypes,
  scphMediaPageObjectTypes,
} from './objects'
import {programmeDayType} from './programmeDayType'
import {programmeSessionType} from './programmeSessionType'
import {programmeSpeakerType} from './programmeSpeakerType'
import {programmeWorkshopType} from './programmeWorkshopType'
import {teamMemberType} from './teamMemberType'

export const schemaTypes = [
  programmeSpeakerType,
  programmeWorkshopType,
  programmeSessionType,
  programmeDayType,
  gtp2026ProgrammeType,
  gtp2026HighlightSessionSlotType,
  gtp2026HighlightSpeakerType,
  gtp2026CommitteeMemberType,
  gtp2026FaqAccordionItemType,
  gtp2026FaqGroupType,
  ...gtpAboutPageBandObjectTypes,
  gtpAboutWhatIsBandType,
  gtp2026AboutPageType,
  gtp2026SubmissionsPillarSlotType,
  gtp2026SubmissionsThemeSlotType,
  gtp2026SubmissionsRichSectionType,
  gtp2026SubmissionsEvalCriterionGroupType,
  gtp2026AbstractFormCopyType,
  gtp2026WorkshopFormCopyType,
  gtp2026SubmissionsPageType,
  gtp2026GetInvolvedPageType,
  gtp2026MediaPageType,
  gtp2026BizForumPageType,
  teamMemberType,
  ...sectionObjectTypes,
  ...scphHomeObjectTypes,
  ...scphPageBandObjectTypes,
  ...scphMediaPageObjectTypes,
  cmsSandboxPageType,
  scphHomePageType,
  scphMeetTheTeamPageType,
  ...scphSectionPageTypes,
]
