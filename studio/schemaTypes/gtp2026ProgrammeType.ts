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
