import {defineField, defineType} from 'sanity'

export const sectionStatsRowType = defineType({
  name: 'sectionStatsRow',
  title: 'Stats row',
  type: 'object',
  fields: [
    defineField({
      name: 'enabled',
      title: 'Visible on site',
      type: 'boolean',
      description: 'Turn off to hide this section without deleting it.',
      initialValue: true,
    }),
    defineField({
      name: 'variant',
      title: 'Visual style',
      type: 'string',
      options: {
        list: [
          {title: 'Blue band (home)', value: 'blue-band'},
          {title: 'Light green (research)', value: 'light-green'},
        ],
        layout: 'radio',
      },
      initialValue: 'blue-band',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'items',
      title: 'Stats',
      type: 'array',
      of: [{type: 'sectionStatItem'}],
      validation: (rule) => rule.required().min(1).max(8),
    }),
  ],
  preview: {
    select: {variant: 'variant', items: 'items', enabled: 'enabled'},
    prepare({variant, items, enabled}) {
      const n = Array.isArray(items) ? items.length : 0
      return {
        title: `Stats row (${variant ?? '?'})`,
        subtitle: `${enabled === false ? 'Hidden · ' : ''}${n} item(s)`,
      }
    },
  },
})
