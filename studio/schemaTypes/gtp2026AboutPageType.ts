import {defineField, defineType} from 'sanity'
import {sectionBlockMembers} from './objects'

/**
 * Optional CMS bands on GTP About (below hero stack, before “What are Global Tipping Points”).
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
      name: 'sections',
      title: 'Sections',
      type: 'array',
      of: [...sectionBlockMembers],
      description:
        'Shown directly under the hero carousel. Rest of the page stays in code until migrated.',
    }),
  ],
  preview: {
    select: {t: 'internalTitle'},
    prepare({t}) {
      return {title: t ?? 'GTP 2026 About page'}
    },
  },
})
