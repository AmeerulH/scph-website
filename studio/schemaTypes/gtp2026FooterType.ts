import {defineField, defineType} from 'sanity'

export const gtp2026FooterType = defineType({
  name: 'gtp2026Footer',
  title: 'GTP 2026 site footer',
  type: 'document',
  fields: [
    defineField({
      name: 'internalTitle',
      title: 'Internal title',
      type: 'string',
      initialValue: 'GTP 2026 footer',
    }),
    defineField({
      name: 'bannerLogosImage',
      title: 'Main banner / partner logos strip',
      description:
        'Wide image above the footer columns. If empty, the built-in SVG on the site is used.',
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
      name: 'quickLinks',
      title: 'Quick links',
      type: 'array',
      of: [{type: 'footerNavLink'}],
    }),
    defineField({
      name: 'importantDates',
      title: 'Important dates',
      type: 'array',
      of: [{type: 'gtpFooterImportantDate'}],
    }),
    defineField({
      name: 'contactRows',
      title: 'Contact rows',
      type: 'array',
      of: [{type: 'gtpFooterContactRow'}],
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social links',
      type: 'array',
      of: [{type: 'footerSocialLink'}],
    }),
    defineField({
      name: 'copyrightLine',
      title: 'Copyright line',
      type: 'string',
    }),
    defineField({
      name: 'hostedByPrefix',
      title: 'Hosted by prefix',
      type: 'string',
      description: 'Text before the hosted-by link (e.g. Hosted by).',
    }),
    defineField({
      name: 'hostedByLabel',
      title: 'Hosted by link label',
      type: 'string',
    }),
    defineField({
      name: 'hostedByUrl',
      title: 'Hosted by URL',
      type: 'url',
    }),
  ],
  preview: {
    select: {title: 'internalTitle'},
    prepare({title}) {
      return {title: title ?? 'GTP 2026 footer'}
    },
  },
})
