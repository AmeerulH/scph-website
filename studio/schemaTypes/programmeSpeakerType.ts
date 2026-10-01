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
      name: 'roles',
      title: 'Roles',
      type: 'array',
      of: [{type: 'string'}],
      options: {
        list: [
          {title: 'Speaker', value: 'speaker'},
          {title: 'Facilitator', value: 'facilitator'},
        ],
      },
      description:
        'Optional. Tick Speaker, Facilitator, or both. Leave empty to keep the role implied by the list this person is in, or by Role in this session.',
    }),
    defineField({
      name: 'sessionRole',
      title: 'Role in this session',
      type: 'string',
      description:
        'Optional label such as Moderator or Panelist. Leave empty for a generic line. “Speaker” or “Facilitator” here is still read when Roles is empty.',
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
