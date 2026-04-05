import {cmsSandboxPageType} from './cmsSandboxPageType'
import {gtp2026AboutPageType} from './gtp2026AboutPageType'
import {gtp2026BizForumPageType} from './gtp2026BizForumPageType'
import {gtp2026GetInvolvedPageType} from './gtp2026GetInvolvedPageType'
import {gtp2026MediaPageType} from './gtp2026MediaPageType'
import {gtp2026RegisterPageType} from './gtp2026RegisterPageType'
import {gtp2026SubmissionsPageType} from './gtp2026SubmissionsPageType'
import {
  gtp2026SubmissionsPillarSlotType,
  gtp2026SubmissionsThemeSlotType,
} from './gtp2026SubmissionsSlotTypes'
import {gtp2026CommitteeMemberType} from './gtp2026CommitteeMemberType'
import {gtp2026FaqItemType} from './gtp2026FaqItemType'
import {gtp2026HighlightSessionSlotType} from './gtp2026HighlightSessionSlotType'
import {gtp2026HighlightSpeakerType} from './gtp2026HighlightSpeakerType'
import {gtp2026ProgrammeType} from './gtp2026ProgrammeType'
import {scphHomePageType} from './scphHomePageType'
import {scphMeetTheTeamPageType} from './scphMeetTheTeamPageType'
import {scphSectionPageTypes} from './scphSectionsPageTypes'
import {sectionObjectTypes} from './objects'
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
  gtp2026FaqItemType,
  gtp2026AboutPageType,
  gtp2026SubmissionsPillarSlotType,
  gtp2026SubmissionsThemeSlotType,
  gtp2026SubmissionsPageType,
  gtp2026GetInvolvedPageType,
  gtp2026RegisterPageType,
  gtp2026MediaPageType,
  gtp2026BizForumPageType,
  teamMemberType,
  ...sectionObjectTypes,
  cmsSandboxPageType,
  scphHomePageType,
  scphMeetTheTeamPageType,
  ...scphSectionPageTypes,
]
