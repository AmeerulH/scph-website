import {defineField, defineType} from 'sanity'

/** Visible copy for /events/gtp-2026/register (links target get-involved#contact in code). */
export const gtp2026RegisterPageType = defineType({
  name: 'gtp2026RegisterPage',
  title: 'GTP 2026 Register page',
  type: 'document',
  fields: [
    defineField({
      name: 'internalTitle',
      title: 'Internal title',
      type: 'string',
      initialValue: 'Register',
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
      name: 'sectionTitle',
      title: 'Registration band — title',
      type: 'string',
    }),
    defineField({
      name: 'sectionSubtitle',
      title: 'Registration band — subtitle',
      type: 'string',
    }),
    defineField({
      name: 'bodyLead',
      title: 'Body — first paragraph',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'bodyHighlight',
      title: 'Body — emphasis line',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'bodyMore',
      title: 'Body — closing paragraph',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'primaryCtaLabel',
      title: 'Primary button label',
      type: 'string',
    }),
    defineField({
      name: 'secondaryCtaLabel',
      title: 'Secondary button label',
      type: 'string',
    }),
  ],
  preview: {
    select: {t: 'internalTitle'},
    prepare({t}) {
      return {title: t ?? 'GTP 2026 Register'}
    },
  },
})
