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
