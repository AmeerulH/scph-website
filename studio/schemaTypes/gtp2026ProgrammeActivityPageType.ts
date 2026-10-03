import {defineArrayMember, defineField, defineType} from 'sanity'

const activityEntry = defineArrayMember({
  name: 'gtpProgrammeActivityEntry',
  title: 'Activity entry',
  type: 'object',
  fields: [
    defineField({name: 'title', title: 'Title', type: 'string', validation: (rule) => rule.required()}),
    defineField({name: 'dateLabel', title: 'Date label', type: 'string'}),
    defineField({
      name: 'sessionDate',
      title: 'Session date',
      type: 'date',
      description:
        'Artificial Intelligence Sessions only. Sets the order and the large date on the page. If a session runs on more than one day, pick the first day and describe the rest in Date label.',
      hidden: ({document}) => document?.slug === 'action-workshops',
    }),
    defineField({
      name: 'format',
      title: 'Format',
      type: 'string',
      description: 'Artificial Intelligence Sessions only. Short tag, for example Workshop or Networking Breakfast.',
      hidden: ({document}) => document?.slug === 'action-workshops',
    }),
    defineField({
      name: 'time',
      title: 'Time',
      type: 'string',
      description: 'Artificial Intelligence Sessions only. For example 8:00 AM to 9:00 AM. Leave empty until confirmed.',
      hidden: ({document}) => document?.slug === 'action-workshops',
    }),
    defineField({
      name: 'venue',
      title: 'Venue',
      type: 'string',
      description: 'Artificial Intelligence Sessions only. Leave empty until confirmed.',
      hidden: ({document}) => document?.slug === 'action-workshops',
    }),
    defineField({name: 'description', title: 'Description', type: 'text', rows: 5}),
    defineField({
      name: 'registrationUrl',
      title: 'Registration URL',
      type: 'url',
      description:
        'Artificial Intelligence Sessions only. External link for this session. The page-level Registration URL is only used while no session has its own link.',
      hidden: ({document}) => document?.slug === 'action-workshops',
    }),
    defineField({
      name: 'registrationLabel',
      title: 'Registration button label',
      type: 'string',
      description: 'Artificial Intelligence Sessions only. Shown on the button once a Registration URL is set, for example Register for this workshop.',
      hidden: ({document}) => document?.slug === 'action-workshops',
    }),
    defineField({
      name: 'registrationPendingLabel',
      title: 'Button text until the link is ready',
      type: 'string',
      description:
        'Artificial Intelligence Sessions only. While there is no Registration URL, the button is greyed out and shows this text. Leave empty for the default: Registration link coming soon. Add the URL to turn it into a working button.',
      hidden: ({document}) => document?.slug === 'action-workshops',
    }),
    defineField({
      name: 'poster',
      title: 'Poster',
      type: 'image',
      description: 'Portrait artwork (about 3:4) works best. It is shown in full and not cropped.',
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
  preview: {
    select: {title: 'title', dateLabel: 'dateLabel', sessionDate: 'sessionDate', media: 'poster'},
    prepare({title, dateLabel, sessionDate, media}) {
      return {title, subtitle: dateLabel || sessionDate, media}
    },
  },
})

const stationEntry = defineArrayMember({
  name: 'gtpProgrammeActivityStation',
  title: 'Station',
  type: 'object',
  fields: [
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      description: 'Short label, for example Sound or Touch. Numbering follows list order.',
    }),
    defineField({name: 'headline', title: 'Headline', type: 'string', validation: (rule) => rule.required()}),
    defineField({name: 'body', title: 'Body', type: 'text', rows: 5}),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {hotspot: true},
      description: 'Landscape or square, at least 1600 px wide. The station still shows if this is empty.',
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt text',
          type: 'string',
          description: 'Describe the image for screen readers.',
          validation: (rule) =>
            rule.custom((alt, context) => {
              const parent = context.parent as {asset?: {_ref?: string}} | undefined
              return parent?.asset?._ref && !alt?.trim()
                ? 'Alt text is required when an image is set'
                : true
            }),
        }),
      ],
    }),
    defineField({
      name: 'link',
      title: 'Link (optional)',
      type: 'object',
      fields: [
        defineField({name: 'label', title: 'Label', type: 'string'}),
        defineField({
          name: 'href',
          title: 'URL or path',
          type: 'string',
          description: 'Internal path (/events/gtp-2026/...) or full https:// URL.',
        }),
      ],
    }),
  ],
  preview: {select: {title: 'headline', subtitle: 'category', media: 'image'}},
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
          {title: 'Artificial Intelligence Sessions', value: 'ai-thinkers-networking-breakfast'},
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
        'For film screening and sensorial station, this is the text beside the poster. Sensorial stations are edited under Stations. For Action Workshops and Artificial Intelligence Sessions, it sits above the list of sessions.',
    }),
    defineField({
      name: 'showcasePoster',
      title: 'Poster',
      type: 'image',
      description:
        'Portrait poster shown on the left on desktop, and above the description on a phone. Use the full artwork; it will not be cropped. For Artificial Intelligence Sessions, upload posters on each session under Activities instead; this one is only a fallback for the first session.',
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
        'External registration link. The button uses this when Registration status is Open. For Artificial Intelligence Sessions it is only used while no session has its own link. Set Registration status to Closed to hide every Register button on that page.',
    }),
    defineField({
      name: 'entries',
      title: 'Activities',
      type: 'array',
      of: [activityEntry],
      description:
        'Action Workshops: poster rows for the workshop list. Artificial Intelligence Sessions: one row per session (breakfast, workshops), each with its own date, poster and registration link.',
      hidden: ({document}) =>
        document?.slug !== 'action-workshops' && document?.slug !== 'ai-thinkers-networking-breakfast',
    }),
    defineField({
      name: 'stationsTitle',
      title: 'Stations heading',
      type: 'string',
      initialValue: 'The stations',
      description: 'Sensorial Station only. Shown above the numbered station list.',
      hidden: ({document}) => document?.slug !== 'sensorial-station',
    }),
    defineField({
      name: 'stations',
      title: 'Stations',
      type: 'array',
      of: [stationEntry],
      description:
        'Sensorial Station only. Add one row per station. Drag to reorder. The page numbers them in this order, in the same layout as Sustainability commitments.',
      hidden: ({document}) => document?.slug !== 'sensorial-station',
    }),
  ],
  preview: {
    select: {title: 'pageTitle', subtitle: 'slug'},
    prepare({title, subtitle}) {
      return {title: title ?? 'GTP programme activity', subtitle}
    },
  },
})
