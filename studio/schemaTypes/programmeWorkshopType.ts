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
