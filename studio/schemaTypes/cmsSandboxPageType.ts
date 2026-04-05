import {defineField, defineType} from 'sanity'
import {sectionBlockMembers} from './objects'

/**
 * Optional document for editors to compose and preview section blocks in Studio.
 * Wire a dev-only Next route later if you want on-site preview; Stage 0 is Studio-only.
 */
export const cmsSandboxPageType = defineType({
  name: 'cmsSandboxPage',
  title: 'CMS sandbox (sections)',
  type: 'document',
  fields: [
    defineField({
      name: 'internalTitle',
      title: 'Internal title',
      type: 'string',
      description: 'For Studio list only.',
      initialValue: 'Section blocks sandbox',
    }),
    defineField({
      name: 'sections',
      title: 'Sections',
      type: 'array',
      of: [...sectionBlockMembers],
    }),
  ],
  preview: {
    select: {title: 'internalTitle'},
    prepare({title}) {
      return {title: title ?? 'CMS sandbox'}
    },
  },
})
