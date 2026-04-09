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
    defineField({
      name: 'image',
      title: 'Profile photo',
      type: 'image',
      options: {hotspot: true},
    }),
    defineField({
      name: 'sessionRole',
      title: 'Role in this session',
      type: 'string',
      description:
        'Optional. Shown on the programme (e.g. Moderator, Panelist, Facilitator). Leave empty for a generic speaker line.',
    }),
  ],
  preview: {
    select: {title: 'name', subtitle: 'designation', sessionRole: 'sessionRole', media: 'image'},
    prepare({title, subtitle, sessionRole, media}) {
      const role = typeof sessionRole === 'string' && sessionRole.trim() ? sessionRole.trim() : ''
      const parts = [role, subtitle].filter(Boolean) as string[]
      const sub = parts.length ? parts.join(' · ') : undefined
      return {title: title ?? 'Speaker', subtitle: sub, media}
    },
  },
})
