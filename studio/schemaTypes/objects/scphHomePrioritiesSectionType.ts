import {defineField, defineType} from 'sanity'

/** A single priority card within the Three Key Priorities section. Icons are assigned by position in code. */
export const scphHomePriorityCardType = defineType({
  name: 'scphHomePriorityCard',
  title: 'Priority card',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 4,
    }),
  ],
  preview: {
    select: {title: 'title'},
    prepare({title}: {title?: string}) {
      return {title: title || 'Priority card'}
    },
  },
})

/** Three Key Priorities section on the SCPH home page. */
export const scphHomePrioritiesSectionType = defineType({
  name: 'scphHomePrioritiesSection',
  title: 'Priority areas section',
  type: 'object',
  fields: [
    defineField({
      name: 'enabled',
      title: 'Visible on site',
      type: 'boolean',
      description: 'Toggle to show or hide the Priority Areas section.',
      initialValue: true,
    }),
    defineField({
      name: 'sectionTitle',
      title: 'Section title',
      type: 'string',
      initialValue: 'Three Key Priorities',
    }),
    defineField({
      name: 'sectionSubtitle',
      title: 'Section subtitle',
      type: 'string',
      initialValue: 'Our Focus Areas',
    }),
    defineField({
      name: 'linkHref',
      title: 'Card link (all cards)',
      type: 'string',
      description: 'Internal path or URL that all priority cards link to.',
      initialValue: '/programmes',
    }),
    defineField({
      name: 'cards',
      title: 'Priority cards',
      type: 'array',
      of: [{type: 'scphHomePriorityCard'}],
      description:
        'Up to 3 cards. Icons are fixed by position: 1 → Healthy Cities, 2 → Decarbonisation, 3 → Education Revolution.',
      validation: (rule) => rule.max(3),
    }),
  ],
  preview: {
    select: {title: 'sectionTitle', enabled: 'enabled'},
    prepare({title, enabled}: {title?: string; enabled?: boolean}) {
      return {
        title: title || 'Priority areas section',
        subtitle: enabled === false ? 'Hidden' : undefined,
      }
    },
  },
})
