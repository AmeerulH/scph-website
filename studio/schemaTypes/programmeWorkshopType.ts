import {defineField, defineType} from 'sanity'

export const programmeWorkshopType = defineType({
  name: 'programmeWorkshop',
  title: 'Workshop / research slot',
  type: 'object',
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
      title: 'Speakers',
      type: 'array',
      of: [{type: 'programmeSpeaker'}],
      description:
        'Named speakers for this parallel slot. Shown under Speakers in the workshop popup. If empty, use Speaker count (TBC) below.',
    }),
    defineField({
      name: 'facilitators',
      title: 'Facilitators',
      type: 'array',
      of: [{type: 'programmeSpeaker'}],
      description:
        'Shown under Facilitators in the workshop popup, separate from Speakers. Leave empty to show “To be confirmed”. People whose role is already “Facilitator” in Speakers also appear here.',
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
