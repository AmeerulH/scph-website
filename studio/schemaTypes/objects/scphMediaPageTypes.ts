import {defineField, defineType} from 'sanity'

export const scphMediaArticleItemType = defineType({
  name: 'scphMediaArticleItem',
  title: 'Article',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'tag',
      title: 'Tag / category',
      type: 'string',
      description: 'Shown as a badge on the card.',
    }),
    defineField({
      name: 'href',
      title: 'Link URL',
      type: 'url',
      description:
        'Where “Read article” goes. Leave empty to use the page’s “View all articles” URL.',
      validation: (rule) =>
        rule.uri({allowRelative: true, scheme: ['http', 'https', 'mailto', 'tel']}),
    }),
    defineField({
      name: 'body',
      title: 'Body / summary',
      type: 'text',
      rows: 6,
      description: 'Text shown on the card (e.g. deck or short summary).',
    }),
  ],
  preview: {
    select: {title: 'title', tag: 'tag'},
    prepare({title, tag}) {
      return {
        title: title || 'Article',
        subtitle: tag || undefined,
      }
    },
  },
})

export const scphMediaPageObjectTypes = [scphMediaArticleItemType]
