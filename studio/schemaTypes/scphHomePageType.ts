import {defineField, defineType} from 'sanity'
import {sectionBlockMembers} from './objects'

/**
 * Stage 1: singleton-style home overrides. Create one document of this type in Studio.
 * The site uses the first (and should be only) `scphHomePage` document.
 */
export const scphHomePageType = defineType({
  name: 'scphHomePage',
  title: 'SCPH Home page',
  type: 'document',
  fields: [
    defineField({
      name: 'internalTitle',
      title: 'Internal title',
      type: 'string',
      description: 'Shown in the document list only.',
      initialValue: 'Home',
    }),
    defineField({
      name: 'statsRow',
      title: 'Stats row',
      type: 'sectionStatsRow',
      description:
        'Optional. Leave empty or disable to keep the built-in default stats on the live site.',
    }),
    defineField({
      name: 'introSections',
      title: 'Sections after stats',
      type: 'array',
      of: [...sectionBlockMembers],
      description:
        'Optional blocks between the stats row and the GTP promo (e.g. rich text or CTA sections).',
    }),
  ],
  preview: {
    select: {title: 'internalTitle'},
    prepare({title}) {
      return {title: title ?? 'SCPH Home page'}
    },
  },
})
