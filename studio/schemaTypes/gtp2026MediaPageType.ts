import {defineArrayMember, defineField, defineType} from 'sanity'
import {sectionBlockMembers} from './objects'

const altField = defineField({
  name: 'alt',
  title: 'Alt text',
  type: 'string',
  description: 'Describe the image for screen readers.',
})

const photoAlbum = defineArrayMember({
  name: 'gtpMediaPhotoAlbum',
  title: 'Photo album',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Album title',
      type: 'string',
      description: 'e.g. Day 1, Special Events, Action Workshops.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'dateLabel',
      title: 'Date label',
      type: 'string',
      description: 'Optional, e.g. 13 October 2026.',
    }),
    defineField({
      name: 'photos',
      title: 'Photos',
      type: 'array',
      description:
        'Drag several images in at once. The first photo is shown large. Around 9 photos per album works best; link the rest via "More photos" below.',
      options: {layout: 'grid'},
      of: [
        defineArrayMember({
          type: 'image',
          options: {hotspot: true},
          fields: [
            altField,
            defineField({name: 'caption', title: 'Caption', type: 'string'}),
          ],
        }),
      ],
    }),
    defineField({
      name: 'driveLinks',
      title: '"More photos" links (Google Drive)',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'gtpMediaDriveLink',
          fields: [
            defineField({
              name: 'label',
              title: 'Button label',
              type: 'string',
              initialValue: 'For more photos: click here',
            }),
            defineField({
              name: 'url',
              title: 'Google Drive URL',
              type: 'url',
              validation: (rule) => rule.uri({scheme: ['https']}),
            }),
          ],
          preview: {select: {title: 'label', subtitle: 'url'}},
        }),
      ],
    }),
  ],
  preview: {
    select: {title: 'title', subtitle: 'dateLabel', media: 'photos.0'},
  },
})

const podcastEpisode = defineArrayMember({
  name: 'gtpMediaPodcastEpisode',
  title: 'Podcast episode',
  type: 'object',
  fields: [
    defineField({name: 'title', title: 'Title', type: 'string', validation: (rule) => rule.required()}),
    defineField({name: 'topic', title: 'Topic label', type: 'string', description: 'Small label above the title.'}),
    defineField({name: 'publishedAt', title: 'Published date', type: 'date'}),
    defineField({name: 'duration', title: 'Duration', type: 'string', description: 'e.g. 42 min'}),
    defineField({
      name: 'thumbnail',
      title: 'Thumbnail',
      type: 'image',
      options: {hotspot: true},
      fields: [altField],
    }),
    defineField({name: 'spotifyUrl', title: 'Spotify URL', type: 'url'}),
    defineField({name: 'youtubeUrl', title: 'YouTube URL', type: 'url'}),
    defineField({name: 'appleUrl', title: 'Apple Podcasts URL', type: 'url'}),
  ],
  preview: {select: {title: 'title', subtitle: 'topic', media: 'thumbnail'}},
})

const videoItem = defineArrayMember({
  name: 'gtpMediaVideo',
  title: 'Video',
  type: 'object',
  fields: [
    defineField({name: 'title', title: 'Title', type: 'string', validation: (rule) => rule.required()}),
    defineField({name: 'topic', title: 'Topic label', type: 'string', description: 'Small label above the title.'}),
    defineField({
      name: 'youtubeUrl',
      title: 'YouTube URL',
      type: 'url',
      description: 'Any youtube.com/watch, youtu.be or /embed link.',
      validation: (rule) => rule.required(),
    }),
    defineField({name: 'description', title: 'Description', type: 'text', rows: 3}),
    defineField({name: 'duration', title: 'Duration', type: 'string', description: 'e.g. 4:12'}),
    defineField({
      name: 'thumbnail',
      title: 'Thumbnail override',
      type: 'image',
      options: {hotspot: true},
      description: 'Optional. The YouTube thumbnail is used automatically when empty.',
      fields: [altField],
    }),
  ],
  preview: {select: {title: 'title', subtitle: 'topic', media: 'thumbnail'}},
})

/** GTP 2026 /media: hero, photo albums, podcast and video sections. */
export const gtp2026MediaPageType = defineType({
  name: 'gtp2026MediaPage',
  title: 'GTP 2026 Media page',
  type: 'document',
  groups: [
    {name: 'hero', title: 'Hero', default: true},
    {name: 'photos', title: 'Photo gallery'},
    {name: 'podcasts', title: 'Podcasts'},
    {name: 'videos', title: 'Videos'},
    {name: 'legacy', title: 'Legacy'},
  ],
  fields: [
    defineField({
      name: 'internalTitle',
      title: 'Internal title',
      type: 'string',
      initialValue: 'Media',
      group: 'hero',
    }),
    defineField({name: 'pageTitle', title: 'Page title', type: 'string', initialValue: 'Media', group: 'hero'}),
    defineField({
      name: 'heroLede',
      title: 'Hero lede',
      type: 'text',
      rows: 3,
      description: 'Short line under the page title.',
      group: 'hero',
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero image',
      type: 'image',
      options: {hotspot: true},
      description: 'Landscape, at least 2400 x 1200 px. Falls back to a GTP photo when empty.',
      fields: [altField],
      group: 'hero',
    }),

    defineField({name: 'photosTitle', title: 'Section title', type: 'string', initialValue: 'Photo Gallery', group: 'photos'}),
    defineField({
      name: 'photosIntro',
      title: 'Intro',
      type: 'text',
      rows: 5,
      description: 'Separate paragraphs with a blank line.',
      group: 'photos',
    }),
    defineField({
      name: 'photoAlbums',
      title: 'Albums',
      type: 'array',
      of: [photoAlbum],
      description: 'Empty albums show preview photos from GTP 2025 until real photos are uploaded.',
      group: 'photos',
    }),

    defineField({name: 'podcastsTitle', title: 'Section title', type: 'string', initialValue: 'Podcasts', group: 'podcasts'}),
    defineField({name: 'podcastsIntro', title: 'Intro', type: 'text', rows: 5, group: 'podcasts'}),
    defineField({
      name: 'podcastCover',
      title: 'Podcast cover art',
      type: 'image',
      options: {hotspot: true},
      description: 'Square artwork, at least 1200 x 1200 px.',
      fields: [altField],
      group: 'podcasts',
    }),
    defineField({name: 'spotifyUrl', title: 'Spotify URL', type: 'url', group: 'podcasts'}),
    defineField({name: 'podcastYoutubeUrl', title: 'YouTube URL', type: 'url', group: 'podcasts'}),
    defineField({name: 'appleUrl', title: 'Apple Podcasts URL', type: 'url', group: 'podcasts'}),
    defineField({
      name: 'podcastEpisodes',
      title: 'Episodes',
      type: 'array',
      of: [podcastEpisode],
      description: 'Newest first.',
      group: 'podcasts',
    }),

    defineField({name: 'videosTitle', title: 'Section title', type: 'string', initialValue: 'Videos', group: 'videos'}),
    defineField({name: 'videosIntro', title: 'Intro', type: 'text', rows: 5, group: 'videos'}),
    defineField({name: 'youtubeChannelUrl', title: 'YouTube channel URL', type: 'url', group: 'videos'}),
    defineField({
      name: 'videos',
      title: 'Videos',
      type: 'array',
      of: [videoItem],
      description: 'The first video is the featured player.',
      group: 'videos',
    }),

    defineField({
      name: 'placeholderDescription',
      title: 'Coming soon description (legacy)',
      type: 'text',
      rows: 4,
      hidden: true,
      group: 'legacy',
    }),
    defineField({
      name: 'sections',
      title: 'Page sections (legacy)',
      type: 'array',
      of: [...sectionBlockMembers],
      hidden: true,
      group: 'legacy',
    }),
  ],
  preview: {
    select: {t: 'internalTitle'},
    prepare({t}) {
      return {title: t ?? 'GTP 2026 Media'}
    },
  },
})
