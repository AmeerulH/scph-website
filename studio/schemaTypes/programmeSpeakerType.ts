import {defineField, defineType} from 'sanity'

export const programmeSpeakerType = defineType({
  name: 'programmeSpeaker',
  title: 'Speaker',
  type: 'object',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'designation',
      title: 'Designation / affiliation',
      type: 'string',
    }),
  ],
  preview: {
    select: {title: 'name', subtitle: 'designation'},
    prepare({title, subtitle}) {
      return {title: title ?? 'Speaker', subtitle}
    },
  },
})
