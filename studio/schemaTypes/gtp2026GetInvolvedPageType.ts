import {defineField, defineType} from 'sanity'

/**
 * Visible marketing copy for /events/gtp-2026/get-involved (form behaviour stays in code).
 */
export const gtp2026GetInvolvedPageType = defineType({
  name: 'gtp2026GetInvolvedPage',
  title: 'GTP 2026 Get involved page',
  type: 'document',
  fields: [
    defineField({
      name: 'internalTitle',
      title: 'Internal title',
      type: 'string',
      initialValue: 'Get involved',
    }),
    defineField({
      name: 'heroTitle',
      title: 'Hero title',
      type: 'string',
    }),
    defineField({
      name: 'heroLede',
      title: 'Hero lede',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'contactSectionTitle',
      title: 'Contact section — title',
      type: 'string',
    }),
    defineField({
      name: 'contactSectionSubtitle',
      title: 'Contact section — subtitle',
      type: 'string',
    }),
    defineField({
      name: 'contactIntro',
      title: 'Contact section — intro paragraph',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'contactOrgName',
      title: 'Contact — organisation name',
      type: 'string',
    }),
    defineField({
      name: 'contactOrgAddress',
      title: 'Contact — address line',
      type: 'string',
    }),
    defineField({
      name: 'contactConferenceDates',
      title: 'Contact — conference dates line',
      type: 'string',
    }),
    defineField({
      name: 'partnershipSectionTitle',
      title: 'Partnership section — title',
      type: 'string',
    }),
    defineField({
      name: 'partnershipSectionSubtitle',
      title: 'Partnership section — subtitle',
      type: 'string',
    }),
    defineField({
      name: 'partnershipLead',
      title: 'Partnership — lead paragraph',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'partnershipHighlight',
      title: 'Partnership — emphasis paragraph',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'partnershipBody',
      title: 'Partnership — supporting paragraph',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'partnershipCtaLabel',
      title: 'Partnership — button label',
      type: 'string',
    }),
  ],
  preview: {
    select: {t: 'internalTitle'},
    prepare({t}) {
      return {title: t ?? 'GTP 2026 Get involved'}
    },
  },
})
