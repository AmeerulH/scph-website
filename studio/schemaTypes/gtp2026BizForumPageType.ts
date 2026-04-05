import {defineField, defineType} from 'sanity'
import {sectionBlockMembers} from './objects'

/** When `sections` has visible blocks, replaces the placeholder on /events/gtp-2026/biz-forum. */
export const gtp2026BizForumPageType = defineType({
  name: 'gtp2026BizForumPage',
  title: 'GTP 2026 Business forum page',
  type: 'document',
  fields: [
    defineField({
      name: 'internalTitle',
      title: 'Internal title',
      type: 'string',
      initialValue: 'Business forum',
    }),
    defineField({
      name: 'pageTitle',
      title: 'Title (placeholder mode)',
      type: 'string',
      initialValue: 'Biz Forum',
    }),
    defineField({
      name: 'heroLede',
      title: 'Hero lede (when sections are shown)',
      type: 'text',
      rows: 2,
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
      return {title: t ?? 'GTP 2026 Business forum'}
    },
  },
})
