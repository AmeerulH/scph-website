import {defineField, defineType} from 'sanity'

/**
 * Chrome around the Meet the Team roster (`teamMember` documents stay the source for people).
 */
export const scphMeetTheTeamPageType = defineType({
  name: 'scphMeetTheTeamPage',
  title: 'SCPH Meet the Team (section)',
  type: 'document',
  fields: [
    defineField({
      name: 'internalTitle',
      title: 'Internal title',
      type: 'string',
      initialValue: 'Meet the Team',
    }),
    defineField({
      name: 'sectionTitle',
      title: 'Section title',
      type: 'string',
      description: 'Large heading in SectionWrapper.',
      initialValue: 'Meet the Team',
    }),
    defineField({
      name: 'sectionSubtitle',
      title: 'Section subtitle',
      type: 'string',
      initialValue: 'Our Team',
    }),
    defineField({
      name: 'introBlurb',
      title: 'Intro (optional)',
      type: 'text',
      rows: 4,
      description: 'Short text above the team groups when set.',
    }),
    defineField({
      name: 'showGetInvolvedCta',
      title: 'Show “Get Involved” button',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  preview: {
    select: {t: 'internalTitle'},
    prepare({t}) {
      return {title: t ?? 'Meet the Team'}
    },
  },
})
