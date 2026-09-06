import {defineArrayMember, defineField, defineType} from 'sanity'

const activityEntry = defineArrayMember({
  name: 'gtpProgrammeActivityEntry',
  title: 'Activity entry',
  type: 'object',
  fields: [
    defineField({name: 'title', title: 'Title', type: 'string', validation: (rule) => rule.required()}),
    defineField({name: 'dateLabel', title: 'Date label', type: 'string'}),
    defineField({name: 'description', title: 'Description', type: 'text', rows: 5}),
    defineField({
      name: 'poster',
      title: 'Poster',
      type: 'image',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: 'Poster alt text',
          type: 'string',
          validation: (rule) =>
            rule.custom((alt, context) => {
              const parent = context.parent as {asset?: {_ref?: string}} | undefined
              return parent?.asset?._ref && !alt?.trim()
                ? 'Alt text is required when a poster is set'
                : true
            }),
        }),
      ],
    }),
  ],
  preview: {select: {title: 'title', subtitle: 'dateLabel'}},
})

export const gtp2026ProgrammeActivityPageType = defineType({
  name: 'gtp2026ProgrammeActivityPage',
  title: 'GTP 2026 Programme activity page',
  type: 'document',
  fields: [
    defineField({
      name: 'slug',
      title: 'Page',
      type: 'string',
      options: {
        list: [
          {title: 'Action Workshops', value: 'action-workshops'},
          {title: 'AI Thinkers Networking Breakfast', value: 'ai-thinkers-networking-breakfast'},
          {title: 'Excursion Trips', value: 'excursion-trips'},
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({name: 'internalTitle', title: 'Internal title', type: 'string'}),
    defineField({name: 'pageTitle', title: 'Page title', type: 'string', validation: (rule) => rule.required()}),
    defineField({name: 'heroLede', title: 'Hero lede', type: 'text', rows: 3}),
    defineField({name: 'intro', title: 'Introduction', type: 'text', rows: 8}),
    defineField({
      name: 'registrationStatus',
      title: 'Registration status',
      type: 'string',
      initialValue: 'comingSoon',
      options: {
        list: [
          {title: 'Open', value: 'open'},
          {title: 'Coming soon', value: 'comingSoon'},
          {title: 'Closed', value: 'closed'},
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({name: 'registrationLabel', title: 'Registration button label', type: 'string'}),
    defineField({name: 'registrationUrl', title: 'Registration URL', type: 'url'}),
    defineField({name: 'entries', title: 'Activities', type: 'array', of: [activityEntry]}),
  ],
  preview: {
    select: {title: 'pageTitle', subtitle: 'slug'},
    prepare({title, subtitle}) {
      return {title: title ?? 'GTP programme activity', subtitle}
    },
  },
})
