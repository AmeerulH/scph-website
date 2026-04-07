import {defineField, defineType} from 'sanity'

export const programmeWorkshopType = defineType({
  name: 'programmeWorkshop',
  title: 'Workshop / research slot',
  type: 'object',
  fields: [
    defineField({
      name: 'number',
      title: 'Number',
      type: 'string',
      description: 'Display number (e.g. session or workshop index).',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'objective',
      title: 'Objective',
      type: 'text',
      rows: 4,
      description: 'Optional. Shown for this parallel slot on the programme page.',
    }),
  ],
  preview: {
    select: {title: 'title', number: 'number'},
    prepare({title, number}) {
      return {title: `${number ? `${number}. ` : ''}${title ?? ''}`}
    },
  },
})
