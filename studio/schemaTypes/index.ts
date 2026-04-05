import {cmsSandboxPageType} from './cmsSandboxPageType'
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
  teamMemberType,
  ...sectionObjectTypes,
  cmsSandboxPageType,
  scphHomePageType,
  scphMeetTheTeamPageType,
  ...scphSectionPageTypes,
]
