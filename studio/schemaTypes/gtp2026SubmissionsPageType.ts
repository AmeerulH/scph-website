import {defineField, defineType} from 'sanity'

/**
 * Marketing copy for /events/gtp-2026/submissions. Form fields and validation stay in React.
 */
export const gtp2026SubmissionsPageType = defineType({
  name: 'gtp2026SubmissionsPage',
  title: 'GTP 2026 Submissions page',
  type: 'document',
  fields: [
    defineField({
      name: 'internalTitle',
      title: 'Internal title',
      type: 'string',
      initialValue: 'Submissions',
    }),
    defineField({
      name: 'heroTitle',
      title: 'Hero title',
      type: 'string',
    }),
    defineField({
      name: 'heroLede',
      title: 'Hero lede',
      type: 'string',
    }),
    defineField({
      name: 'heroTitleSize',
      title: 'Hero title size',
      type: 'string',
      options: {
        list: [
          {title: 'Default', value: 'default'},
          {title: 'Compact (long titles)', value: 'compact'},
        ],
        layout: 'radio',
      },
      initialValue: 'compact',
    }),
    defineField({
      name: 'pillarsIntroBold',
      title: 'Pillars — bold intro paragraph',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'pillarsIntro',
      title: 'Pillars — second paragraph',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'pillarsOutro',
      title: 'Pillars — closing paragraph (above download link)',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'pillarsLinkLabel',
      title: 'Pillars — download link label',
      type: 'string',
    }),
    defineField({
      name: 'pillarsLinkUrl',
      title: 'Pillars — download link URL',
      type: 'url',
    }),
    defineField({
      name: 'pillars',
      title: 'Three pillars (order fixed on site)',
      type: 'array',
      of: [{type: 'gtp2026SubmissionsPillarSlot'}],
      validation: (rule) => rule.max(3),
    }),
    defineField({
      name: 'themesSectionTitle',
      title: 'Themes section — title',
      type: 'string',
    }),
    defineField({
      name: 'themesIntro',
      title: 'Themes section — intro',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'themes',
      title: 'Eight themes (order fixed on site)',
      type: 'array',
      of: [{type: 'gtp2026SubmissionsThemeSlot'}],
      validation: (rule) => rule.max(8),
    }),
    defineField({
      name: 'ctaTitle',
      title: 'Forms band — heading',
      type: 'string',
    }),
    defineField({
      name: 'ctaSubtitle',
      title: 'Forms band — subtitle',
      type: 'string',
    }),
    defineField({
      name: 'abstractTabLabel',
      title: 'Abstract tab label',
      type: 'string',
    }),
    defineField({
      name: 'abstractDeadline',
      title: 'Abstract deadline line',
      type: 'string',
    }),
    defineField({
      name: 'workshopTabLabel',
      title: 'Workshop tab label',
      type: 'string',
    }),
    defineField({
      name: 'workshopDeadline',
      title: 'Workshop deadline line',
      type: 'string',
    }),
    defineField({
      name: 'abstractFormIntro',
      title: 'Abstract form — intro under deadline',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'workshopFormIntro',
      title: 'Workshop form — intro under deadline',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'backToTopLabel',
      title: 'Back to top button label',
      type: 'string',
    }),
  ],
  preview: {
    select: {t: 'internalTitle'},
    prepare({t}) {
      return {title: t ?? 'GTP 2026 Submissions'}
    },
  },
})
