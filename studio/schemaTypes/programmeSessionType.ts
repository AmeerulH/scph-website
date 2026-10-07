import {defineField, defineType} from 'sanity'
import {programmeHostedByFields} from './programmeHostedByFields'

export const programmeSessionType = defineType({
  name: 'programmeSession',
  title: 'Session',
  type: 'object',
  fieldsets: [{name: 'hostedBy', title: 'Hosted by', options: {collapsible: false}}],
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
      name: 'closedEvent',
      title: 'Closed event',
      type: 'boolean',
      initialValue: false,
      description:
        'Invitation-only, still listed on the programme. The session keeps its type above (Plenary, Special event, and so on) and also appears when visitors filter by Closed Event.',
      hidden: ({parent}) => parent?.type === 'break',
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
      name: 'subpageButtonLabel',
      title: 'Subpage button text',
      type: 'string',
      description:
        'Text on this session’s button linking to the combined Action Workshops and Research Sessions page. For Special events, enter text to show a button on the card and popup; leave empty to hide it. The link uses the matching date’s shared registration section. Action Workshops and Research Sessions keep their default wording when empty. This changes the wording only, not registration availability. Publish Programme to update the website.',
      hidden: ({parent}) =>
        parent?.type !== 'concurrent' && parent?.type !== 'research' && parent?.type !== 'special',
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
      description:
        'Named speakers for this session. Tick Roles on each person when they are a speaker, a facilitator, or both. If empty, use Speaker count (TBC) below. Not shown for parallel sessions — add people on each workshop row instead.',
      hidden: ({parent}) =>
        parent?.type === 'concurrent' || parent?.type === 'research',
    }),
    defineField({
      name: 'facilitators',
      title: 'Facilitators',
      type: 'array',
      of: [{type: 'programmeSpeaker'}],
      description:
        'Older list, still shown under Facilitators on plenary and other session popups. The site also merges these people into action workshop popups. Prefer Roles on each person when someone is a speaker, a facilitator, or both.',
      hidden: ({parent}) =>
        parent?.type === 'break' ||
        parent?.type === 'concurrent' ||
        parent?.type === 'research',
    }),
    defineField({
      name: 'speakerCount',
      title: 'Speaker count (TBC)',
      type: 'number',
      description: 'Shown when speakers are not yet confirmed. Not used for parallel sessions — set speaker count on each individual workshop slot instead.',
      hidden: ({parent}) =>
        parent?.type === 'concurrent' || parent?.type === 'research',
    }),
    defineField({
      name: 'workshops',
      title: 'Workshops / parallel slots',
      type: 'array',
      of: [{type: 'programmeWorkshop'}],
      description:
        'Each Action Workshop is edited entirely here: title, Workshop poster, objective, room and people. The parent session/day supplies time/date. Publish Programme to update its card and popup. The activity page owns headings, partners and shared registration only. Research sessions use one slot per hall with Research presentations.',
    }),
    defineField({
      name: 'breakLabel',
      title: 'Break label',
      type: 'string',
      description: 'Optional override for break rows (e.g. Coffee Break).',
    }),
    defineField({
      name: 'workshopNote',
      title: 'Concurrent workshop notice',
      type: 'string',
      description:
        'When set, shows an inline badge on the break strip (e.g. "Action Workshops also run during this break"). Leave empty to hide.',
      hidden: ({parent}) => parent?.type !== 'break',
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
    ...programmeHostedByFields(({parent}) => parent?.type === 'break'),
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
    defineField({
      name: 'carouselBackgroundImage',
      title: "What's On carousel background",
      type: 'image',
      options: { hotspot: true },
      description:
        "Optional image for this session's card in the About/home What's On carousel. When set, replaces the default type-based colour gradient. Leave empty to use the colour scheme.",
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt text',
          type: 'string',
          description: 'Describe the image for accessibility.',
        }),
      ],
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
