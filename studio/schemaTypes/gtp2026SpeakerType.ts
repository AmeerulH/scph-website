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
      description: 'Lower numbers appear first on the Speakers page grid.',
      initialValue: 0,
    }),
    defineField({
      name: 'showOnAboutPage',
      title: 'Show on About / GTP home',
      type: 'boolean',
      description:
        'When on, this speaker appears in the curated grid on the GTP About page (and the SCPH home GTP speakers band). The Speakers page always shows the full roster.',
      initialValue: false,
    }),
    defineField({
      name: 'aboutSortOrder',
      title: 'About page sort order',
      type: 'number',
      description:
        'Lower numbers appear first on About / GTP home when “Show on About / GTP home” is on. Independent of Speakers page sort order.',
      hidden: ({parent}) => parent?.showOnAboutPage !== true,
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
    select: {
      title: 'name',
      media: 'image',
      order: 'order',
      showOnAboutPage: 'showOnAboutPage',
      aboutSortOrder: 'aboutSortOrder',
    },
    prepare({title, media, order, showOnAboutPage, aboutSortOrder}) {
      const bits = [
        order != null ? `Speakers #${order}` : null,
        showOnAboutPage
          ? `About${aboutSortOrder != null ? ` #${aboutSortOrder}` : ''}`
          : null,
      ].filter(Boolean)
      return {
        title: title ?? 'Speaker',
        subtitle: bits.length > 0 ? bits.join(' · ') : undefined,
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
