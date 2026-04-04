import {defineField, defineType} from 'sanity'

export const teamMemberType = defineType({
  name: 'teamMember',
  title: 'Team Member',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Full Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'name'},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Primary Title',
      type: 'string',
      description: 'The main job title displayed on the team page.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'allTitles',
      title: 'All Titles',
      type: 'array',
      of: [{type: 'string'}],
      description: 'All titles held by this person (including the primary title).',
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      validation: (rule) => rule.email(),
    }),
    defineField({
      name: 'bio',
      title: 'Biography',
      type: 'text',
      rows: 6,
    }),
    defineField({
      name: 'image',
      title: 'Profile Photo',
      type: 'image',
      options: {hotspot: true},
    }),
    defineField({
      name: 'group',
      title: 'Team Group',
      type: 'string',
      options: {
        list: [
          {title: 'Leadership', value: 'leadership'},
          {title: 'Policy & Strategic Advocacy', value: 'policy-and-strategic-advocacy'},
          {title: 'Knowledge & Learning', value: 'knowledge-and-learning'},
          {title: 'Programmes', value: 'programmes'},
          {title: 'Communications', value: 'communications'},
          {title: 'Other Team Members', value: 'other'},
        ],
        layout: 'radio',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Controls display order within the group. Lower numbers appear first.',
      initialValue: 99,
    }),
    defineField({
      name: 'profileUrl',
      title: 'Profile URL',
      type: 'url',
      description: 'Link to the full staff profile on the Sunway University website.',
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'title',
      media: 'image',
    },
  },
})
