import {defineField, defineType} from 'sanity'
import {ProgrammeRoleOptionsInput} from '../components/programme-role-options-input'

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
      components: {input: ProgrammeRoleOptionsInput},
      options: {
        list: [
          {title: 'Speaker', value: 'speaker'},
          {title: 'Facilitator', value: 'facilitator'},
        ],
      },
      description:
        'Tick Speaker, Facilitator, or both. Untick all roles to hide the generic role label while keeping the person visible. A written label such as Moderator in Role in this session still appears. Older entries without a Roles selection keep their existing labels.',
    }),
    defineField({
      name: 'sessionRole',
      title: 'Role in this session',
      type: 'string',
      description:
        'Optional written label such as Moderator or Panelist. To show no role line, clear this field and untick all Roles, then publish Programme.',
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
