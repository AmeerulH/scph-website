import {defineField, defineType} from 'sanity'

/** Simple text section (no Portable Text yet — Stage 0 scaffolding). */
export const sectionRichTextType = defineType({
  name: 'sectionRichText',
  title: 'Rich text (simple)',
  type: 'object',
  fields: [
    defineField({
      name: 'enabled',
      title: 'Visible on site',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'eyebrow',
      title: 'Eyebrow',
      type: 'string',
    }),
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'text',
      rows: 8,
    }),
  ],
  preview: {
    select: {heading: 'heading', enabled: 'enabled'},
    prepare({heading, enabled}) {
      return {
        title: heading || 'Rich text',
        subtitle: enabled === false ? 'Hidden' : undefined,
      }
    },
  },
})
