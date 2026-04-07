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
      name: 'objective',
      title: 'Objective',
      type: 'text',
      rows: 5,
      description:
        'Shown on the public programme page. Use “TBC” if not final. For parallel slots, you can also set Objective on each workshop row.',
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
      description:
        'Used for default venue wording when Venue line is empty (evening vs daytime defaults on the site).',
    }),
    defineField({
      name: 'venueType',
      title: 'Venue type',
      type: 'string',
      description:
        'For editors and planning. The public site shows Venue line when set; otherwise it uses defaults from Evening session.',
      options: {
        list: [
          {title: 'Main venue (campus / plenary)', value: 'main'},
          {title: 'Evening / off-site', value: 'evening_offsite'},
          {title: 'Online', value: 'online'},
          {title: 'Breakout / parallel room', value: 'breakout'},
          {title: 'Multiple rooms / TBC', value: 'multiple'},
          {title: 'Venue TBC', value: 'tbc'},
          {title: 'Other', value: 'other'},
        ],
        layout: 'dropdown',
      },
    }),
    defineField({
      name: 'venueLine',
      title: 'Venue line (public)',
      type: 'string',
      description:
        'Exact text next to the map pin on the programme cards and in the session modal (e.g. “Sunway University, Kuala Lumpur” or “Venue TBC — Sunway, Malaysia”). Leave empty to use site defaults.',
    }),
    defineField({
      name: 'formatLabel',
      title: 'Format label (public)',
      type: 'string',
      description:
        'Shown after “Format:” in the session modal (e.g. “Public Session”). Leave empty to use the default for this session type.',
    }),
  ],
  preview: {
    select: {title: 'title', time: 'time', type: 'type', venueLine: 'venueLine'},
    prepare({title, time, type, venueLine}) {
      return {
        title: title ?? 'Session',
        subtitle: [time, type, venueLine].filter(Boolean).join(' · '),
      }
    },
  },
})
