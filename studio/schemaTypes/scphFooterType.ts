import {defineField, defineType} from 'sanity'

export const scphFooterType = defineType({
  name: 'scphFooter',
  title: 'SCPH site footer',
  type: 'document',
  fields: [
    defineField({
      name: 'internalTitle',
      title: 'Internal title',
      type: 'string',
      description: 'Shown in the document list only.',
      initialValue: 'SCPH footer',
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline (under logo)',
      type: 'text',
      rows: 5,
    }),
    defineField({
      name: 'logo',
      title: 'Logo image',
      type: 'image',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          type: 'string',
          title: 'Alt text',
          validation: (rule) =>
            rule.custom((alt, context) => {
              const parent = context.parent as {asset?: {_ref?: string}} | undefined
              if (parent?.asset?._ref && !(typeof alt === 'string' && alt.trim())) {
                return 'Alt text is required when an image is set'
              }
              return true
            }),
        }),
      ],
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social links',
      type: 'array',
      of: [{type: 'footerSocialLink'}],
    }),
    defineField({
      name: 'columnQuickLinks',
      title: 'Quick Links column',
      type: 'footerLinkColumn',
    }),
    defineField({
      name: 'columnCommunity',
      title: 'Community column',
      type: 'footerLinkColumn',
    }),
    defineField({
      name: 'columnConferences',
      title: 'Conferences column',
      type: 'footerLinkColumn',
    }),
    defineField({
      name: 'contactEmail',
      title: 'Contact email',
      type: 'string',
    }),
    defineField({
      name: 'address',
      title: 'Address',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'phoneDisplay',
      title: 'Phone (display)',
      type: 'string',
    }),
    defineField({
      name: 'phoneTel',
      title: 'Phone tel: href',
      type: 'string',
      description: 'e.g. +60374918622',
    }),
    defineField({
      name: 'careerEmail',
      title: 'Career opportunities email',
      type: 'string',
    }),
    defineField({
      name: 'copyrightLine',
      title: 'Copyright line',
      type: 'string',
    }),
    defineField({
      name: 'partOfLabel',
      title: '“Part of” label',
      type: 'string',
      description: 'Text before the bottom logo (e.g. Part of).',
    }),
    defineField({
      name: 'bottomLogo',
      title: 'Bottom bar logo (e.g. Sunway University)',
      type: 'image',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          type: 'string',
          title: 'Alt text',
          validation: (rule) =>
            rule.custom((alt, context) => {
              const parent = context.parent as {asset?: {_ref?: string}} | undefined
              if (parent?.asset?._ref && !(typeof alt === 'string' && alt.trim())) {
                return 'Alt text is required when an image is set'
              }
              return true
            }),
        }),
      ],
    }),
  ],
  preview: {
    select: {title: 'internalTitle'},
    prepare({title}) {
      return {title: title ?? 'SCPH footer'}
    },
  },
})
