import {defineField, defineType} from 'sanity'

export const footerNavLinkType = defineType({
  name: 'footerNavLink',
  title: 'Footer link',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'href',
      type: 'string',
      title: 'URL or path',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'openInNewTab',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  preview: {
    select: {title: 'label', subtitle: 'href'},
    prepare({title, subtitle}) {
      return {title: title ?? 'Link', subtitle}
    },
  },
})

export const footerLinkColumnType = defineType({
  name: 'footerLinkColumn',
  title: 'Footer link column',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'links',
      type: 'array',
      of: [{type: 'footerNavLink'}],
    }),
  ],
  preview: {
    select: {title: 'title', links: 'links'},
    prepare({title, links}) {
      const n = Array.isArray(links) ? links.length : 0
      return {title: title ?? 'Column', subtitle: `${n} link(s)`}
    },
  },
})

const SOCIAL_ICON_KEYS = [
  {title: 'Facebook', value: 'fb'},
  {title: 'Instagram', value: 'ig'},
  {title: 'LinkedIn', value: 'li'},
  {title: 'TikTok', value: 'tt'},
  {title: 'X / Twitter', value: 'x'},
  {title: 'YouTube', value: 'yt'},
] as const

export const footerSocialLinkType = defineType({
  name: 'footerSocialLink',
  title: 'Footer social link',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      type: 'string',
      title: 'Accessible label',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'href',
      type: 'string',
      title: 'URL or path',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'iconKey',
      type: 'string',
      title: 'Icon',
      options: {
        list: [...SOCIAL_ICON_KEYS],
        layout: 'dropdown',
      },
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {title: 'label', iconKey: 'iconKey'},
    prepare({title, iconKey}) {
      return {title: title ?? 'Social', subtitle: iconKey ?? undefined}
    },
  },
})

export const gtpFooterImportantDateType = defineType({
  name: 'gtpFooterImportantDate',
  title: 'Important date',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'dateText',
      type: 'string',
      title: 'Date',
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {title: 'label', date: 'dateText'},
    prepare({title, date}) {
      return {title: title ?? 'Date', subtitle: date}
    },
  },
})

export const gtpFooterContactRowType = defineType({
  name: 'gtpFooterContactRow',
  title: 'Contact row',
  type: 'object',
  fields: [
    defineField({
      name: 'rowType',
      type: 'string',
      title: 'Row type',
      options: {
        list: [
          {title: 'Email (mail icon, mailto link)', value: 'email'},
          {title: 'Site / plain (globe icon, no link)', value: 'sitePlain'},
          {title: 'External link (globe + opens in new tab)', value: 'externalLink'},
        ],
        layout: 'radio',
      },
      initialValue: 'sitePlain',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'text',
      type: 'string',
      title: 'Text',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'url',
      type: 'url',
      title: 'URL',
      description: 'Required for External link.',
      hidden: ({parent}) => parent?.rowType !== 'externalLink',
      validation: (rule) =>
        rule.custom((url, context) => {
          const parent = context.parent as {rowType?: string} | undefined
          if (parent?.rowType === 'externalLink' && !url) {
            return 'URL is required for external links'
          }
          return true
        }),
    }),
  ],
  preview: {
    select: {rowType: 'rowType', text: 'text'},
    prepare({rowType, text}) {
      return {title: text ?? 'Row', subtitle: rowType}
    },
  },
})
