import {defineField, defineType} from 'sanity'

/** One row in the home hero “Highlighted events” strip (supports multiple). */
export const scphHomeHighlightedEventType = defineType({
  name: 'scphHomeHighlightedEvent',
  title: 'Highlighted event',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      description: 'e.g. “Upcoming · 2026”',
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtitle',
      type: 'string',
      description: 'e.g. location',
    }),
    defineField({
      name: 'teaser',
      title: 'Teaser',
      type: 'text',
      rows: 3,
      description: 'Optional short line under the subtitle.',
    }),
    defineField({
      name: 'href',
      title: 'Link URL or path',
      type: 'string',
      description: 'Internal path (e.g. /events) or full https URL.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'openInNewTab',
      title: 'Open in new tab',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  preview: {
    select: {title: 'title', label: 'label'},
    prepare({title, label}) {
      return {title: title || 'Event', subtitle: label}
    },
  },
})
