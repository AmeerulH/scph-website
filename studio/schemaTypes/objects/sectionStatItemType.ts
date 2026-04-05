import {defineField, defineType} from 'sanity'

export const sectionStatItemType = defineType({
  name: 'sectionStatItem',
  title: 'Stat',
  type: 'object',
  fields: [
    defineField({
      name: 'value',
      title: 'Value',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {value: 'value', label: 'label'},
    prepare({value, label}) {
      return {title: `${value ?? ''} — ${label ?? ''}`}
    },
  },
})
