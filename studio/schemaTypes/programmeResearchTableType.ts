import {defineField, defineType} from 'sanity'

export const programmeResearchTableType = defineType({
  name: 'programmeResearchTable',
  title: 'Research table heading and venue',
  type: 'object',
  fields: [
    defineField({
      name: 'sourceVenue', title: 'Match room / hall', type: 'string',
      description: 'Match the Room / hall (public) on the papers or parallel slot, e.g. Hall 1. This selects an existing table; it does not add papers or change their assignments.',
      validation: (rule) => rule.required().custom((value) =>
        typeof value === 'string' && !value.trim() ? 'Enter the room / hall to match' : true),
    }),
    defineField({
      name: 'title', title: 'Table heading', type: 'string',
      description: 'Public session name for this table. Leave empty to keep Session 1, Session 2, etc.',
    }),
    defineField({
      name: 'venueLabel', title: 'Public venue text', type: 'string',
      description: 'Optional text beside the map pin for this table. Leave empty to show the matched room / hall. Changing this label keeps the existing paper assignments.',
    }),
  ],
  preview: {
    select: {title: 'title', sourceVenue: 'sourceVenue', venueLabel: 'venueLabel'},
    prepare({title, sourceVenue, venueLabel}) {
      return {title: title || sourceVenue || 'Research table', subtitle: [sourceVenue, venueLabel].filter(Boolean).join(' · ')}
    },
  },
})
