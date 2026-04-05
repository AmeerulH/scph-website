import {sectionCtaLinkType} from './sectionCtaLinkType'
import {sectionProseCtaType} from './sectionProseCtaType'
import {sectionRichTextType} from './sectionRichTextType'
import {sectionStatsRowType} from './sectionStatsRowType'
import {sectionStatItemType} from './sectionStatItemType'

/**
 * Object types used inside page `sections[]` arrays.
 * Order: leaf objects first, then parents that reference them.
 */
export const sectionObjectTypes = [
  sectionStatItemType,
  sectionCtaLinkType,
  sectionStatsRowType,
  sectionRichTextType,
  sectionProseCtaType,
]

/** For `of: [...]` on a sections field */
export const sectionBlockMembers = [
  {type: 'sectionStatsRow'},
  {type: 'sectionRichText'},
  {type: 'sectionProseCta'},
] as const
