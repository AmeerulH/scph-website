import {defineField, defineType} from 'sanity'

/**
 * CMS-editable copy for the /events/gtp-2026/speakers hero section.
 * Speaker cards are controlled via gtp2026HighlightSpeaker documents.
 */
export const gtp2026SpeakersPageType = defineType({
  name: 'gtp2026SpeakersPage',
  title: 'GTP 2026 Speakers page',
  type: 'document',
  fields: [
    defineField({
      name: 'internalTitle',
      title: 'Internal title',
      type: 'string',
      initialValue: 'Speakers page',
    }),
    defineField({
      name: 'heroLabel',
      title: 'Hero — eyebrow label',
      type: 'string',
      description: 'Small uppercase label above the heading. e.g. "Global Tipping Points 2026"',
    }),
    defineField({
      name: 'heroHeading',
      title: 'Hero — heading',
      type: 'string',
      description: 'Main heading. e.g. "Our Speakers"',
    }),
    defineField({
      name: 'heroDescription',
      title: 'Hero — description',
      type: 'text',
      rows: 4,
      description: 'Paragraph beneath the heading.',
    }),
    defineField({
      name: 'heroDateLocation',
      title: 'Hero — date & location line',
      type: 'string',
      description: 'e.g. "12–15 October 2026 · Kuala Lumpur, Malaysia"',
    }),
  ],
  preview: {
    select: {title: 'internalTitle'},
    prepare({title}) {
      return {title: title ?? 'Speakers page'}
    },
  },
})
