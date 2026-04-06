import {defineField, defineType} from 'sanity'
import {sectionBlockMembers} from './objects'

/**
 * Full GTP About page copy (hero through sponsors). Programme carousel still uses `gtp2026Programme`.
 */
export const gtp2026AboutPageType = defineType({
  name: 'gtp2026AboutPage',
  title: 'GTP 2026 About page',
  type: 'document',
  fields: [
    defineField({
      name: 'internalTitle',
      title: 'Internal title',
      type: 'string',
      initialValue: 'GTP About',
    }),
    defineField({
      name: 'heroBand',
      title: 'Hero (headline & CTAs)',
      type: 'gtpAboutHeroBand',
      options: {collapsible: true, collapsed: true},
    }),
    defineField({
      name: 'sections',
      title: 'Extra sections (under hero)',
      type: 'array',
      of: [...sectionBlockMembers],
      description:
        'Optional SCPH-style blocks directly under the hero carousel.',
    }),
    defineField({
      name: 'whatIsBand',
      title: '“What are Global Tipping Points”',
      type: 'gtpAboutWhatIsBand',
      options: {collapsible: true, collapsed: false},
    }),
    defineField({
      name: 'whyMattersBand',
      title: '“Why this meeting matters” (dark band)',
      type: 'gtpAboutWhyMattersBand',
      options: {collapsible: true, collapsed: true},
    }),
    defineField({
      name: 'themesBand',
      title: 'Conference themes',
      type: 'gtpAboutThemesBand',
      options: {collapsible: true, collapsed: true},
    }),
    defineField({
      name: 'speakersChrome',
      title: 'Speaker highlights (titles)',
      type: 'gtpAboutSpeakersChrome',
      options: {collapsible: true, collapsed: true},
    }),
    defineField({
      name: 'quotesBand',
      title: 'Co-chair quotes',
      type: 'gtpAboutQuotesBand',
      options: {collapsible: true, collapsed: true},
    }),
    defineField({
      name: 'galleryBand',
      title: 'Gallery',
      type: 'gtpAboutGalleryBand',
      options: {collapsible: true, collapsed: true},
    }),
    defineField({
      name: 'eventInquiryBand',
      title: 'Event inquiry',
      type: 'gtpAboutEventInquiryBand',
      options: {collapsible: true, collapsed: true},
    }),
    defineField({
      name: 'sponsorsBand',
      title: 'Sponsors & partners',
      type: 'gtpAboutSponsorsBand',
      options: {collapsible: true, collapsed: true},
    }),
  ],
  preview: {
    select: {t: 'internalTitle'},
    prepare({t}) {
      return {title: t ?? 'GTP 2026 About page'}
    },
  },
})
