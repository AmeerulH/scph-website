import {defineField, defineType} from 'sanity'

export const programmeResearchPresentationType = defineType({
  name: 'programmeResearchPresentation',
  title: 'Research presentation',
  type: 'object',
  fields: [
    defineField({name: 'presenterName', title: 'Presenter', type: 'string', validation: (rule) => rule.required()}),
    defineField({
      name: 'presenterImage', title: 'Presenter profile photo', type: 'image', options: {hotspot: true},
      description: 'Optional photo shown beside this presenter on the Research Sessions schedule. Publish Programme after uploading. Existing one-paper-per-slot records use the Profile photo on that slot’s Facilitators/Speakers entry.',
    }),
    defineField({name: 'presentationTitle', title: 'Presentation title', type: 'text', rows: 3, validation: (rule) => rule.required()}),
  ],
  preview: {select: {title: 'presentationTitle', subtitle: 'presenterName', media: 'presenterImage'}},
})
