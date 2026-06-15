import {defineField, defineType} from 'sanity'

/**
 * Full speaker roster for /events/gtp-2026/speakers.
 * Separate from gtp2026HighlightSpeaker (About page highlights).
 */
export const gtp2026SpeakerType = defineType({
  name: 'gtp2026Speaker',
  title: 'GTP 2026 Speaker',
  type: 'document',
  fields: [
    defineField({
      name: 'order',
      title: 'Sort order',
      type: 'number',
      description: 'Lower numbers appear first in the grid.',
      initialValue: 0,
    }),
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({name: 'role', title: 'Role', type: 'string', initialValue: ''}),
    defineField({
      name: 'organisation',
      title: 'Organisation',
      type: 'string',
      initialValue: '',
    }),
    defineField({name: 'bio', title: 'Bio', type: 'text', rows: 6}),
    defineField({
      name: 'session',
      title: 'Primary session title',
      type: 'string',
    }),
    defineField({
      name: 'sessionDate',
      title: 'Primary session date / time',
      type: 'string',
    }),
    defineField({
      name: 'sessions',
      title: 'Additional sessions (modal)',
      type: 'array',
      of: [{type: 'gtp2026HighlightSessionSlot'}],
    }),
    defineField({
      name: 'image',
      title: 'Photo',
      type: 'image',
      options: {hotspot: true},
    }),
    defineField({
      name: 'photoClassName',
      title: 'Photo CSS classes',
      type: 'string',
      description:
        'Tailwind classes for Next/Image object-fit/position (e.g. object-cover object-[50%_38%]).',
    }),
    defineField({
      name: 'photoUnoptimized',
      title: 'Unoptimized image',
      type: 'boolean',
      description: 'On for small assets where the image optimizer should not run.',
      initialValue: false,
    }),
  ],
  preview: {
    select: {title: 'name', media: 'image', order: 'order'},
    prepare({title, media, order}) {
      return {
        title: title ?? 'Speaker',
        subtitle: order != null ? `Order ${order}` : undefined,
        media,
      }
    },
  },
  orderings: [
    {
      title: 'Sort order',
      name: 'orderAsc',
      by: [{field: 'order', direction: 'asc'}],
    },
  ],
})
