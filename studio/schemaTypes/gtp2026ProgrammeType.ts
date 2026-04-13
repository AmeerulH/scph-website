import {defineField, defineType} from 'sanity'

export const gtp2026ProgrammeType = defineType({
  name: 'gtp2026Programme',
  title: 'GTP 2026 Programme',
  type: 'document',
  description:
    'Conference agenda for the programme page. Prefer a single document with fixed id gtp2026Programme so the website query stays stable (create in Studio with Custom ID, or import).',
  fields: [
    defineField({
      name: 'internalTitle',
      title: 'Internal title',
      type: 'string',
      description: 'For editors only (not shown on the public site).',
      initialValue: 'GTP 2026 programme',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'sessionModalHostedSectionTitle',
      title: 'Session modal — “Hosted by” heading',
      description: 'Shown above the host block when a visitor opens a session from the programme.',
      type: 'string',
      initialValue: 'Hosted By',
    }),
    defineField({
      name: 'sessionModalHostedLogo',
      title: 'Session modal — host logo',
      description: 'Square or compact logo. If empty, the site shows a text placeholder.',
      type: 'image',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          type: 'string',
          title: 'Alt text',
          description: 'Describe the logo for screen readers.',
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
      name: 'sessionModalHostedName',
      title: 'Session modal — host name',
      type: 'string',
      initialValue: 'Sunway Centre for Planetary Health',
    }),
    defineField({
      name: 'sessionModalHostedSubtitle',
      title: 'Session modal — host subtitle / location',
      type: 'string',
      initialValue: 'Sunway University, Kuala Lumpur',
    }),
    defineField({
      name: 'days',
      title: 'Days / tabs',
      type: 'array',
      of: [{type: 'programmeDay'}],
      validation: (rule) =>
        rule.required().min(1).custom((days) => {
          if (!Array.isArray(days) || days.length === 0) return true
          const tabIds = days
            .map((d) =>
              d &&
              typeof d === 'object' &&
              'tabId' in d &&
              typeof (d as {tabId?: unknown}).tabId === 'string'
                ? (d as {tabId: string}).tabId
                : undefined,
            )
            .filter((id): id is string => Boolean(id))
          const unique = new Set(tabIds)
          if (unique.size !== tabIds.length) {
            return 'Each tab (Pre-Conference, Day 1, …) can only appear once'
          }
          return true
        }),
    }),
  ],
  preview: {
    select: {title: 'internalTitle'},
    prepare({title}) {
      return {title: title ?? 'GTP 2026 Programme'}
    },
  },
})
