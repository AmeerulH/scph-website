import {defineField, defineType} from 'sanity'

export const gtp2026SubmissionsPillarSlotType = defineType({
  name: 'gtp2026SubmissionsPillarSlot',
  title: 'Submissions pillar',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'text',
      rows: 5,
      validation: (rule) => rule.required(),
    }),
  ],
})

export const gtp2026SubmissionsThemeSlotType = defineType({
  name: 'gtp2026SubmissionsThemeSlot',
  title: 'Submissions theme',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'text',
      rows: 4,
      validation: (rule) => rule.required(),
    }),
  ],
})
