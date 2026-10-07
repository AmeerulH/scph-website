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

const knowledgePartner = defineArrayMember({
  name: 'gtpActionWorkshopKnowledgePartner',
  title: 'Knowledge partner',
  type: 'object',
  fields: [
    defineField({
      name: 'name',
      title: 'Partner name',
      type: 'string',
      description: 'Shown to screen readers, and used as the logo alt text when Logo alt text is empty.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      description:
        'Transparent PNG or SVG works best. Every logo is fitted into the same size box, so a wide wordmark and a square seal take the same slot.',
      validation: (rule) => rule.required(),
      fields: [
        defineField({
          name: 'alt',
          title: 'Logo alt text',
          type: 'string',
          description: 'Optional. Leave empty to use the partner name.',
        }),
      ],
    }),
    defineField({
      name: 'url',
      title: 'Website',
      type: 'string',
      description: 'Optional. A full https:// link, or an internal path such as /events/gtp-2026/about.',
      validation: (rule) =>
        rule.custom((value) => {
          if (!value?.trim()) return true
          const href = value.trim()
          if (href.startsWith('/') && !href.startsWith('//')) return true
          if (/^https?:\/\//i.test(href)) return true
          return 'Use a full https:// link or an internal path starting with /'
        }),
    }),
  ],
  preview: {
    select: {title: 'name', media: 'logo'},
    prepare({title, media}) {
      return {title: title || 'Knowledge partner', media}
    },
  },
})

const knowledgePartnerDay = defineArrayMember({
  name: 'gtpActionWorkshopKnowledgePartnerDay',
  title: 'Workshop day',
  type: 'object',
  fields: [
    defineField({
      name: 'dateLabel',
      title: 'Date label',
      type: 'string',
      description:
        'Match the workshop day heading, for example 13 October 2026 or 14 October 2026. The logos sit under that day.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'label',
      title: 'Row label',
      type: 'string',
      initialValue: 'Knowledge partners',
      description: 'Small heading above the logos. Leave empty for “Knowledge partners”.',
    }),
    defineField({
      name: 'partners',
      title: 'Logos',
      type: 'array',
      of: [knowledgePartner],
      description:
        'One horizontal row under this day’s workshop cards. Add as many as you need. When they do not fit, the row scrolls on its own. There are no arrows.',
    }),
  ],
  preview: {
    select: {title: 'dateLabel', firstPartner: 'partners.0.name'},
    prepare({title, firstPartner}) {
      return {
        title: title || 'Workshop day',
        subtitle: firstPartner ? `Logos, starting with ${firstPartner}` : 'No logos yet',
      }
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
    defineField({
      name: 'body',
      title: 'Body',
      type: 'text',
      rows: 8,
      description:
        'Press Enter twice to start the next paragraph. A single line break stays in the same paragraph. HTML tags are not needed.',
    }),
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
      name: 'combinedIntro', title: 'Combined page introduction', type: 'text', rows: 3,
      hidden: ({document}) => document?.slug !== 'action-workshops',
      description: 'Introduction above the dates on Action Workshops and Research Sessions. Explain that the activities run simultaneously. Publish this document to update the page.',
    }),
    defineField({
      name: 'actionWorkshopsTitle', title: 'Action Workshops heading', type: 'string',
      hidden: ({document}) => document?.slug !== 'action-workshops',
      description: 'Heading above the workshop description/cards within each date. Defaults to Action Workshops.',
    }),
    defineField({
      name: 'researchSessionsTitle', title: 'Research Sessions heading', type: 'string',
      hidden: ({document}) => document?.slug !== 'action-workshops',
      description: 'Heading above the research schedule within each date. Defaults to Research Sessions.',
    }),
    defineField({
      name: 'researchSessionsIntro', title: 'Research Sessions description', type: 'text', rows: 4,
      hidden: ({document}) => document?.slug !== 'action-workshops',
      description: 'Approved introduction to the research schedule. Presenter/title rows are edited under research sessions in GTP 2026 Programme, not Activities here.',
    }),
    defineField({
      name: 'intro',
      title: 'Description',
      type: 'text',
      rows: 8,
      description:
        'For film screening and sensorial station, this is the text beside the poster. Sensorial stations are edited under Stations. For Action Workshops, this is the description under the workshop heading within each date. For Artificial Intelligence Sessions, it sits above the list of sessions.',
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
      hidden: ({document}) => document?.slug === 'sensorial-station',
      options: {
        list: [
          {title: 'Open', value: 'open'},
          {title: 'Coming soon', value: 'comingSoon'},
          {title: 'Closed', value: 'closed'},
        ],
      },
      validation: (rule) =>
        rule.custom((value, context) =>
          context.document?.slug === 'sensorial-station' || value
            ? true
            : 'Registration status is required',
        ),
    }),
    defineField({
      name: 'registrationLabel',
      title: 'Registration button label',
      type: 'string',
      hidden: ({document}) => document?.slug === 'sensorial-station',
    }),
    defineField({
      name: 'registrationUrl',
      title: 'Registration URL',
      type: 'url',
      description:
        'External registration link. Action Workshops and Research Sessions share this form after attendee-email eligibility verification; the server environment URL is a legacy fallback. Open also requires participant-sheet configuration. For Artificial Intelligence Sessions it is only used while no session has its own link. Closed disables registration on this page.',
      hidden: ({document}) => document?.slug === 'sensorial-station',
    }),
    defineField({
      name: 'scentRegistrationUrl',
      title: 'Scent Station registration URL',
      type: 'url',
      description:
        'Sensorial Station only. Leave empty while awaiting the organiser’s form. Paste the HTTPS link and publish to enable the Scent button. This is independent of the Taste link and page-level registration status.',
      validation: (rule) => rule.uri({scheme: ['https']}),
      hidden: ({document}) => document?.slug !== 'sensorial-station',
    }),
    defineField({
      name: 'tasteRegistrationUrl',
      title: 'Taste Station registration URL',
      type: 'url',
      description:
        'Sensorial Station only. Leave empty while awaiting the organiser’s form. Paste the HTTPS link and publish to enable the Taste button. Remove a link and publish to return that button to Registration opening soon.',
      validation: (rule) => rule.uri({scheme: ['https']}),
      hidden: ({document}) => document?.slug !== 'sensorial-station',
    }),
    defineField({
      name: 'entries',
      title: 'Activities',
      type: 'array',
      of: [activityEntry],
      description:
        'Artificial Intelligence Sessions: one row per session, with its own date, poster and registration link. Legacy Action Workshop rows are retained for recovery only. Edit active workshop titles, posters, objectives, rooms and people in GTP 2026 Programme → day → Action Workshops → Workshops / parallel slots.',
      hidden: ({document}) => document?.slug !== 'ai-thinkers-networking-breakfast',
    }),
    defineField({
      name: 'knowledgePartnerDays',
      title: 'Knowledge partner logos',
      type: 'array',
      of: [knowledgePartnerDay],
      description:
        'Action Workshops only. Add one row per workshop day. Logos render in a single even line under that day’s cards and auto-scroll when the line is wider than the page.',
      hidden: ({document}) => document?.slug !== 'action-workshops',
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
