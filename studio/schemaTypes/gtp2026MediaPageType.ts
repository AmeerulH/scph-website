import {defineField, defineType} from 'sanity'
import {sectionBlockMembers} from './objects'

/** When `sections` has visible blocks, replaces the placeholder on /events/gtp-2026/media. */
export const gtp2026MediaPageType = defineType({
  name: 'gtp2026MediaPage',
  title: 'GTP 2026 Media page',
  type: 'document',
  fields: [
    defineField({
      name: 'internalTitle',
      title: 'Internal title',
      type: 'string',
      initialValue: 'Media',
    }),
    defineField({
      name: 'pageTitle',
      title: 'Title (placeholder mode)',
      type: 'string',
      initialValue: 'Media',
    }),
    defineField({
      name: 'heroLede',
      title: 'Hero lede (when sections are shown)',
      type: 'text',
      rows: 2,
      description: 'Optional line under the hero title when the full page is shown.',
    }),
    defineField({
      name: 'placeholderDescription',
      title: 'Coming soon description',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'sections',
      title: 'Page sections',
      type: 'array',
      of: [...sectionBlockMembers],
      description:
        'When this list has visible blocks, the site shows hero + sections instead of the placeholder.',
    }),
  ],
  preview: {
    select: {t: 'internalTitle'},
    prepare({t}) {
      return {title: t ?? 'GTP 2026 Media'}
    },
  },
})
