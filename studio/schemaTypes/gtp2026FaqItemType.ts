import {defineField, defineType} from 'sanity'

export const gtp2026FaqItemType = defineType({
  name: 'gtp2026FaqItem',
  title: 'GTP 2026 FAQ item',
  type: 'document',
  fields: [
    defineField({
      name: 'order',
      title: 'Sort order',
      type: 'number',
      initialValue: 0,
    }),
    defineField({
      name: 'question',
      title: 'Question',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'answer',
      title: 'Answer',
      type: 'text',
      rows: 8,
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {title: 'question', order: 'order'},
    prepare({title, order}) {
      return {
        title: title ?? 'FAQ',
        subtitle: order != null ? `Order ${order}` : undefined,
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
