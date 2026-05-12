import {scphHomeHeroType} from './scphHomeHeroType'
import {scphHomeHighlightedEventType} from './scphHomeHighlightedEventType'
import {scphHomePartnersBandType} from './scphHomePartnersBandType'
import {scphHomeAboutSectionType} from './scphHomeAboutSectionType'
import {
  scphHomePriorityCardType,
  scphHomePrioritiesSectionType,
} from './scphHomePrioritiesSectionType'
import {sectionCtaLinkType} from './sectionCtaLinkType'
import {sectionProseCtaType} from './sectionProseCtaType'
import {sectionRichTextType} from './sectionRichTextType'
import {sectionStatsRowType} from './sectionStatsRowType'
import {sectionStatItemType} from './sectionStatItemType'
import {scphPageBandObjectTypes} from './scphPageBandsTypes'
import {scphMediaPageObjectTypes} from './scphMediaPageTypes'

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

/** Embedded objects for `scphHomePage` hero + events strip + partners + body sections */
export const scphHomeObjectTypes = [
  scphHomeHeroType,
  scphHomeHighlightedEventType,
  scphHomePartnersBandType,
  scphHomeAboutSectionType,
  scphHomePriorityCardType,
  scphHomePrioritiesSectionType,
]

/** For `of: [...]` on a sections field */
export const sectionBlockMembers = [
  {type: 'sectionStatsRow'},
  {type: 'sectionRichText'},
  {type: 'sectionProseCta'},
] as const

/** About / research / network page band objects (register before `scph*Page` documents). */
export {scphPageBandObjectTypes}

/** Media page article cards (register before `scphMediaPage`). */
export {scphMediaPageObjectTypes}
