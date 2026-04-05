import {defineField, defineType} from 'sanity'

export const sectionProseCtaType = defineType({
  name: 'sectionProseCta',
  title: 'Prose + CTAs',
  type: 'object',
  fields: [
    defineField({
      name: 'enabled',
      title: 'Visible on site',
      type: 'boolean',
      initialValue: true,
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
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'text',
      rows: 10,
      description: 'Separate paragraphs with a blank line.',
    }),
    defineField({
      name: 'background',
      title: 'Section background',
      type: 'string',
      options: {
        list: [
          {title: 'Default', value: 'default'},
          {title: 'Muted', value: 'muted'},
        ],
        layout: 'radio',
      },
      initialValue: 'default',
    }),
    defineField({
      name: 'constrainProse',
      title: 'Constrain text width',
      type: 'boolean',
      description: 'Off matches the wide Roadmap paragraph layout on the home page.',
      initialValue: true,
    }),
    defineField({
      name: 'actionsInsideProse',
      title: 'Place buttons inside text column',
      type: 'boolean',
      description: 'On matches the NPHAP section layout.',
      initialValue: false,
    }),
    defineField({
      name: 'ctas',
      title: 'Call-to-action links',
      type: 'array',
      of: [{type: 'sectionCtaLink'}],
    }),
  ],
  preview: {
    select: {title: 'title', enabled: 'enabled'},
    prepare({title, enabled}) {
      return {
        title: title || 'Prose + CTAs',
        subtitle: enabled === false ? 'Hidden' : undefined,
      }
    },
  },
})
