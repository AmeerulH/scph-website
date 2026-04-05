import {defineField, defineType} from 'sanity'

export const sectionCtaLinkType = defineType({
  name: 'sectionCtaLink',
  title: 'CTA link',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'href',
      title: 'URL or path',
      type: 'string',
      description: 'Internal path (e.g. /network) or full https URL.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'openInNewTab',
      title: 'Open in new tab',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  preview: {
    select: {label: 'label', href: 'href'},
    prepare({label, href}) {
      return {title: label ?? 'Link', subtitle: href}
    },
  },
})
