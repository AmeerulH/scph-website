import {defineField, defineType} from 'sanity'
import {programmeHostedByFields} from './programmeHostedByFields'

export const programmeWorkshopType = defineType({
  name: 'programmeWorkshop',
  title: 'Workshop / research slot',
  type: 'object',
  fieldsets: [{name: 'hostedBy', title: 'Hosted by', options: {collapsible: false}}],
  fields: [
    defineField({
      name: 'number',
      title: 'Number',
      type: 'string',
      description: 'Display number (e.g. session or workshop index).',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'poster',
      title: 'Workshop poster',
      type: 'image',
      options: {hotspot: true},
      description: 'Action Workshops: the poster for this exact workshop. Title, details and artwork are edited together here. Date/time come from the parent day/session. Leave empty until correct artwork is ready; the website shows a title card.',
      fields: [defineField({
        name: 'alt', title: 'Alt text', type: 'string',
        validation: (rule) => rule.custom((alt, context) => {
          const parent = context.parent as {asset?: {_ref?: string}} | undefined
          return parent?.asset?._ref && !(typeof alt === 'string' && alt.trim())
            ? 'Alt text is required when a poster is set' : true
        }),
      })],
    }),
    defineField({
      name: 'objective',
      title: 'Objective',
      type: 'text',
      rows: 4,
      description: 'Optional. Shown for this parallel slot on the programme page.',
    }),
    defineField({
      name: 'speakers',
      title: 'Facilitators/Speakers',
      type: 'array',
      of: [{type: 'programmeSpeaker'}],
      description:
        'People for this workshop. Tick Roles on each person when they are a speaker, a facilitator, or both. If empty, use Speaker count (TBC) below.',
    }),
    defineField({
      name: 'facilitators',
      title: 'Facilitators (legacy)',
      type: 'array',
      of: [{type: 'programmeSpeaker'}],
      description:
        'Older list. The site still reads these people and merges them into Facilitators/Speakers. Add new people on Facilitators/Speakers and tick Roles instead.',
      hidden: ({parent}) =>
        !Array.isArray(parent?.facilitators) || parent.facilitators.length === 0,
    }),
    ...programmeHostedByFields(),
    defineField({
      name: 'venueLine',
      title: 'Room / hall (public)',
      type: 'string',
      description: 'Exact room or hall for this parallel slot. Takes precedence over the older Hosted by location. Leave empty to retain that location or the parent session venue.',
    }),
    defineField({
      name: 'presentations',
      title: 'Research presentations',
      type: 'array',
      of: [{type: 'programmeResearchPresentation'}],
      description: 'For a research session, use this slot as one hall and add presentations in schedule order. The parent session supplies the date/time. Leave empty for Action Workshops. Publish GTP 2026 Programme to update the public schedule.',
    }),
    defineField({
      name: 'speakerCount',
      title: 'Speaker count (TBC)',
      type: 'number',
      description: 'Shown when speakers are not yet confirmed.',
    }),
  ],
  preview: {
    select: {title: 'title', number: 'number'},
    prepare({title, number}) {
      return {title: `${number ? `${number}. ` : ''}${title ?? ''}`}
    },
  },
})
