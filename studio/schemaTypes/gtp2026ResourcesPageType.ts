import {defineField, defineType} from 'sanity'

export const gtp2026ResourcesPageType = defineType({
  name: 'gtp2026ResourcesPage', title: 'GTP 2026 Resources page', type: 'document',
  fields: [
    defineField({name: 'title', title: 'Page title', type: 'string', initialValue: 'Resources'}),
    defineField({name: 'intro', title: 'Introduction', type: 'text', rows: 3}),
    defineField({name: 'emptyTitle', title: 'Empty collection heading', type: 'string'}),
    defineField({name: 'emptyMessage', title: 'Empty collection message', type: 'text', rows: 2}),
    defineField({name: 'pendingLabel', title: 'Label while a file is pending', type: 'string', initialValue: 'Coming soon'}),
  ], preview: {prepare: () => ({title: 'Resources page settings'})},
})
