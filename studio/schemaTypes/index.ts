import {cmsSandboxPageType} from './cmsSandboxPageType'
import {gtp2026AboutPageType} from './gtp2026AboutPageType'
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
  teamMemberType,
  ...sectionObjectTypes,
  cmsSandboxPageType,
  scphHomePageType,
  scphMeetTheTeamPageType,
  ...scphSectionPageTypes,
]
