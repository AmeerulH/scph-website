import {defineField, defineType} from 'sanity'

export const programmeSessionType = defineType({
  name: 'programmeSession',
  title: 'Session',
  type: 'object',
  fields: [
    defineField({
      name: 'time',
      title: 'Time',
      type: 'string',
      description: 'e.g. 09:00 – 09:30',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'durationMins',
      title: 'Duration (minutes)',
      type: 'number',
    }),
    defineField({
      name: 'type',
      title: 'Session type',
      type: 'string',
      options: {
        list: [
          {title: 'Opening', value: 'opening'},
          {title: 'Plenary', value: 'plenary'},
          {title: 'Lightning talk', value: 'lightning'},
          {title: 'Fireside chat', value: 'fireside'},
          {title: 'Reconvening', value: 'reconvening'},
          {title: 'Action workshops', value: 'concurrent'},
          {title: 'Research sessions', value: 'research'},
          {title: 'Special event', value: 'special'},
          {title: 'Closing', value: 'closing'},
          {title: 'Break', value: 'break'},
        ],
        layout: 'dropdown',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Session title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'theme',
      title: 'Conference theme',
      type: 'string',
      description: 'Used for theme filters on the programme page.',
      options: {
        list: [
          {title: 'Understanding the Shift', value: 'shift'},
          {title: 'Igniting Imagination', value: 'imagination'},
          {title: 'Accelerating Action', value: 'action'},
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'speakers',
      title: 'Speakers',
      type: 'array',
      of: [{type: 'programmeSpeaker'}],
      description: 'Named speakers. If empty, use Speaker count (TBC) below.',
    }),
    defineField({
      name: 'speakerCount',
      title: 'Speaker count (TBC)',
      type: 'number',
      description: 'Shown when speakers are not yet confirmed.',
    }),
    defineField({
      name: 'workshops',
      title: 'Workshops / parallel slots',
      type: 'array',
      of: [{type: 'programmeWorkshop'}],
    }),
    defineField({
      name: 'breakLabel',
      title: 'Break label',
      type: 'string',
      description: 'Optional override for break rows (e.g. Coffee Break).',
    }),
    defineField({
      name: 'breakIcon',
      title: 'Break icon',
      type: 'string',
      options: {
        list: [
          {title: 'Coffee', value: 'coffee'},
          {title: 'Lunch', value: 'lunch'},
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'isEvening',
      title: 'Evening session',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  preview: {
    select: {title: 'title', time: 'time', type: 'type'},
    prepare({title, time, type}) {
      return {
        title: title ?? 'Session',
        subtitle: [time, type].filter(Boolean).join(' · '),
      }
    },
  },
})
