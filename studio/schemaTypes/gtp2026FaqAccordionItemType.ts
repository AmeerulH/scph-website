import {defineField, defineType} from 'sanity'

/** Embedded Q&A row inside a `gtp2026FaqGroup` (tab) document. */
export const gtp2026FaqAccordionItemType = defineType({
  name: 'gtp2026FaqAccordionItem',
  title: 'FAQ item',
  type: 'object',
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
        title: title ?? 'Item',
        subtitle: order != null ? `Order ${order}` : undefined,
      }
    },
  },
})
