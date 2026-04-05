import {defineField, defineType} from 'sanity'

export const gtp2026CommitteeMemberType = defineType({
  name: 'gtp2026CommitteeMember',
  title: 'GTP 2026 committee member',
  type: 'document',
  fields: [
    defineField({
      name: 'order',
      title: 'Sort order',
      type: 'number',
      initialValue: 0,
    }),
    defineField({
      name: 'committeeGroup',
      title: 'Group',
      type: 'string',
      options: {
        list: [
          {title: 'Co-Chair (top section)', value: 'cochair'},
          {title: 'Planning committee', value: 'planning'},
          {title: 'Programme committee', value: 'programme'},
        ],
        layout: 'radio',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({name: 'role', title: 'Role', type: 'string'}),
    defineField({
      name: 'organisation',
      title: 'Organisation',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'designation',
      title: 'Designation (co-chairs)',
      type: 'text',
      rows: 4,
      description:
        'Longer line-broken title for co-chairs. If set, used instead of organisation in the co-chair section.',
    }),
    defineField({
      name: 'isPlaceholder',
      title: 'TBC placeholder card',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'image',
      title: 'Photo',
      type: 'image',
      options: {hotspot: true},
    }),
    defineField({
      name: 'imageObjectClass',
      title: 'Image object position (Tailwind)',
      type: 'string',
      description: 'e.g. object-[50%_38%]',
    }),
    defineField({
      name: 'imageScaleClass',
      title: 'Image scale (co-chairs)',
      type: 'string',
      description: 'e.g. scale-[1.48] origin-[50%_6%]',
    }),
  ],
  preview: {
    select: {
      title: 'name',
      group: 'committeeGroup',
      media: 'image',
      order: 'order',
    },
    prepare({title, group, media, order}) {
      return {
        title: title ?? 'Member',
        subtitle: [group, order != null ? `#${order}` : null].filter(Boolean).join(' · '),
        media,
      }
    },
  },
  orderings: [
    {
      title: 'Order',
      name: 'orderAsc',
      by: [{field: 'order', direction: 'asc'}],
    },
  ],
})
