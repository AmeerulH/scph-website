import {defineField, defineType} from 'sanity'

export const gtp2026FaqGroupType = defineType({
  name: 'gtp2026FaqGroup',
  title: 'GTP 2026 FAQ tab',
  type: 'document',
  fields: [
    defineField({
      name: 'order',
      title: 'Tab order',
      type: 'number',
      initialValue: 0,
    }),
    defineField({
      name: 'title',
      title: 'Tab label',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'items',
      title: 'Questions (accordions)',
      type: 'array',
      of: [{type: 'gtp2026FaqAccordionItem'}],
    }),
  ],
  preview: {
    select: {title: 'title', order: 'order', items: 'items'},
    prepare({title, order, items}) {
      const n = Array.isArray(items) ? items.length : 0
      return {
        title: title ?? 'FAQ tab',
        subtitle: [n ? `${n} question(s)` : 'No questions yet', order != null ? `Tab order ${order}` : null]
          .filter(Boolean)
          .join(' · '),
      }
    },
  },
  orderings: [
    {
      title: 'Order',
      name: 'orderAsc',
      by: [{field: 'order', direction: 'asc'}],
    },
  ],
})
