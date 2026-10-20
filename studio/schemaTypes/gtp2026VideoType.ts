import {defineArrayMember, defineField, defineType} from 'sanity'
import {parseYouTubeId} from '../../src/lib/youtube'

export const gtp2026VideoType = defineType({
  name: 'gtp2026Video', title: 'GTP 2026 Video', type: 'document',
  fields: [
    defineField({name: 'title', title: 'Title', type: 'string', validation: rule => rule.required()}),
    defineField({name: 'collection', title: 'Collection', type: 'string', options: {list: [
      {title: 'Daily Highlights', value: 'dailyHighlights'}, {title: 'Session Recordings', value: 'sessionRecordings'}, {title: 'GTP2026 Playlist', value: 'playlist'},
    ], layout: 'radio'}, validation: rule => rule.required()}),
    defineField({name: 'day', title: 'Conference day', type: 'string', options: {list: ['1', '2', '3', '4'].map(value => ({title: `Day ${value}`, value}))},
      validation: rule => rule.custom(async (value, context) => {
        const collection = context.document?.collection
        if (collection !== 'playlist' && !value) return 'Choose a conference day.'
        if (collection !== 'dailyHighlights' || !value) return true
        const id = context.document?._id.replace(/^drafts\./, '')
        const count = await context.getClient({apiVersion: '2024-01-01'}).fetch<number>(
          'count(*[_type == "gtp2026Video" && collection == "dailyHighlights" && day == $day && !(_id in [$id, $draftId]) && !(_id in path("versions.**"))])',
          {day: value, id, draftId: `drafts.${id}`})
        return count === 0 || 'A highlight already exists for this day. Edit that video instead.'
      })}),
    defineField({name: 'youtubeUrl', title: 'YouTube URL', type: 'url', description: 'Paste a video link, not an iframe or playlist. Leave highlights empty while editing is in progress.',
      validation: rule => rule.custom((value, context) => {
        if (!value) return context.document?.collection === 'dailyHighlights' || 'Add a YouTube video link.'
        return Boolean(parseYouTubeId(value)) || 'Use a valid YouTube watch, youtu.be, shorts, live or embed link.'
      })}),
    defineField({name: 'description', title: 'Description', type: 'text', rows: 3}),
    defineField({name: 'speakers', title: 'Speaker names', type: 'array', of: [defineArrayMember({type: 'string'})], options: {layout: 'tags'}}),
    defineField({name: 'topic', title: 'Topic label', type: 'string'}),
    defineField({name: 'duration', title: 'Duration', type: 'string', description: 'Optional, e.g. 4:12 or 1 hr 20 min.'}),
    defineField({name: 'credit', title: 'Contributor credit', type: 'string'}),
    defineField({name: 'order', title: 'Display order', type: 'number', initialValue: 100, validation: rule => rule.integer().min(0)}),
    defineField({name: 'thumbnail', title: 'Thumbnail override', type: 'image', description: 'Optional. Otherwise uses the YouTube thumbnail.', fields: [defineField({name: 'alt', title: 'Image description', type: 'string'})]}),
    defineField({name: 'legacyKey', title: 'Original Media video key', type: 'string', readOnly: true, hidden: ({value}) => !value}),
  ],
  orderings: [{title: 'Conference order', name: 'conferenceOrder', by: [{field: 'day', direction: 'asc'}, {field: 'order', direction: 'asc'}]}],
  preview: {select: {title: 'title', subtitle: 'collection', media: 'thumbnail'}},
})
