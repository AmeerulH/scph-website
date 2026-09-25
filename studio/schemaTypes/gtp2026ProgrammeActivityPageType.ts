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
          {title: 'Film Screening', value: 'film-screening'},
          {title: 'Sensorial Station', value: 'sensorial-station'},
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({name: 'internalTitle', title: 'Internal title', type: 'string'}),
    defineField({name: 'pageTitle', title: 'Page title', type: 'string', validation: (rule) => rule.required()}),
    defineField({
      name: 'heroImage',
      title: 'Hero banner image',
      description: 'Optional. Use a landscape image at least 2400 × 1200 px. It will be cropped responsively behind the page title.',
      type: 'image',
    }),
    defineField({name: 'heroLede', title: 'Hero lede', type: 'text', rows: 3}),
    defineField({
      name: 'intro',
      title: 'Description',
      type: 'text',
      rows: 8,
      description:
        'For the breakfast, film screening, and sensorial station, this is the text beside the poster. Text already saved on an older activity row is shown after it. For Action Workshops, it sits above the workshop list.',
    }),
    defineField({
      name: 'showcasePoster',
      title: 'Poster',
      type: 'image',
      description:
        'Portrait poster shown on the left on desktop, and above the description on a phone. Use the full artwork; it will not be cropped.',
      options: {hotspot: true},
      hidden: ({document}) => document?.slug === 'action-workshops',
      fields: [
        defineField({
          name: 'alt',
          title: 'Poster alt text',
          type: 'string',
          description: 'Describe the poster for screen readers.',
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
    defineField({
      name: 'registrationUrl',
      title: 'Registration URL',
      type: 'url',
      description:
        'External registration link. The button uses this when Registration status is Open.',
    }),
    defineField({
      name: 'entries',
      title: 'Activities',
      type: 'array',
      of: [activityEntry],
      hidden: ({document}) => document?.slug !== 'action-workshops',
    }),
  ],
  preview: {
    select: {title: 'pageTitle', subtitle: 'slug'},
    prepare({title, subtitle}) {
      return {title: title ?? 'GTP programme activity', subtitle}
    },
  },
})
