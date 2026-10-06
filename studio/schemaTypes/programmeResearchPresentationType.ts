import {defineField, defineType} from 'sanity'

export const programmeResearchPresentationType = defineType({
  name: 'programmeResearchPresentation',
  title: 'Research presentation',
  type: 'object',
  fields: [
    defineField({name: 'presenterName', title: 'Presenter', type: 'string', validation: (rule) => rule.required()}),
    defineField({name: 'presentationTitle', title: 'Presentation title', type: 'text', rows: 3, validation: (rule) => rule.required()}),
  ],
  preview: {select: {title: 'presentationTitle', subtitle: 'presenterName'}},
})
