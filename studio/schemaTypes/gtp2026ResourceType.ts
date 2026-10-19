import {defineArrayMember, defineField, defineType} from 'sanity'

export const gtp2026ResourceType = defineType({
  name: 'gtp2026Resource', title: 'GTP 2026 Resource', type: 'document',
  fields: [
    defineField({name: 'title', title: 'Title', type: 'string', validation: rule => rule.required()}),
    defineField({name: 'description', title: 'Description', type: 'text', rows: 3}),
    defineField({name: 'order', title: 'Display order', type: 'number', initialValue: 100, description: 'Lowest first. The first resource is featured.', validation: rule => rule.integer().min(0)}),
    defineField({name: 'cover', title: 'Cover', type: 'image', description: 'Optional. Shown whole, without cropping.', fields: [
      defineField({name: 'alt', title: 'Image description', type: 'string', validation: rule => rule.required()}),
    ]}),
    defineField({name: 'credit', title: 'Cover / contributor credit', type: 'string'}),
    defineField({name: 'downloads', title: 'Downloads', type: 'array', description: 'Leave a file empty to show Coming soon. Each file becomes available independently after publishing.',
      of: [defineArrayMember({name: 'gtpResourceDownload', title: 'PDF download', type: 'object', fields: [
        defineField({name: 'label', title: 'Download label', type: 'string', validation: rule => rule.required()}),
        defineField({name: 'file', title: 'PDF', type: 'file', options: {accept: 'application/pdf'}, validation: rule => rule.custom(async (value, context) => {
          if (!value?.asset?._ref) return true
          const asset = await context.getClient({apiVersion: '2024-01-01'}).fetch<{mimeType?: string}>('*[_id == $id][0]{mimeType}', {id: value.asset._ref})
          return asset?.mimeType === 'application/pdf' || 'Upload a PDF file.'
        })}),
      ], preview: {select: {title: 'label'}}})], validation: rule => rule.min(1),
    }),
  ],
  orderings: [{title: 'Display order', name: 'displayOrder', by: [{field: 'order', direction: 'asc'}, {field: 'title', direction: 'asc'}]}],
  preview: {select: {title: 'title', media: 'cover'}},
})
