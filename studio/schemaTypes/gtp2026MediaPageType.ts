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

const synthesisMap = defineArrayMember({
  name: 'gtpMediaSynthesisMap',
  title: 'Synthesis map',
  type: 'object',
  fields: [
    defineField({
      name: 'day',
      title: 'Day',
      type: 'string',
      options: {
        layout: 'radio',
        list: [
          {title: 'Day 1 (12 Oct)', value: '1'},
          {title: 'Day 2 (13 Oct)', value: '2'},
          {title: 'Day 3 (14 Oct)', value: '3'},
          {title: 'Day 4 (15 Oct)', value: '4'},
          {title: 'Final synthesis', value: 'final'},
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Plenary title',
      type: 'string',
      description: 'Use the plenary name as it appears on the map.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'timeLabel',
      title: 'Time (optional)',
      type: 'string',
      description: 'e.g. 9:00 to 10:30.',
    }),
    defineField({
      name: 'image',
      title: 'Map image',
      type: 'image',
      description:
        'PNG, landscape 16:9, at least 2400 px wide so the small text stays readable. Not a PDF. The image is always shown whole and never cropped.',
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt text',
          type: 'string',
          description: 'Short, e.g. "Visual map of the plenary The Power of Nature".',
          validation: (rule) => rule.required(),
        }),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'summary',
      title: 'Summary',
      type: 'text',
      rows: 3,
      description:
        '1 to 3 sentences on what this plenary map shows or concluded. Shown under the map as the text version of its content.',
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {title: 'title', day: 'day', media: 'image'},
    prepare({title, day, media}) {
      return {title, subtitle: day === 'final' ? 'Final synthesis' : `Day ${day}`, media}
    },
  },
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
    {name: 'synthesis', title: 'Visual Synthesis'},
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
      name: 'synthesisTitle',
      title: 'Page title',
      type: 'string',
      initialValue: 'Visual Synthesis',
      group: 'synthesis',
    }),
    defineField({
      name: 'synthesisIntro',
      title: 'Intro',
      type: 'text',
      rows: 5,
      description:
        'Leave empty to use the standard wording, which switches to past tense automatically after the conference (15 Oct 2026). Filling this in overrides it and stops the automatic switch. Separate paragraphs with a blank line.',
      group: 'synthesis',
    }),
    defineField({
      name: 'synthesisLiveNote',
      title: 'Live note',
      type: 'text',
      rows: 2,
      description:
        'Small line under the intro, e.g. that new syntheses are posted through the days. Leave empty for the standard note, which disappears after the conference.',
      group: 'synthesis',
    }),
    defineField({
      name: 'synthesisCreditLine',
      title: 'Credit line',
      type: 'text',
      rows: 3,
      description:
        'Required credit for Bigger Picture and the contributor; it always appears under the intro. The contributor name and "Bigger Picture" inside it are formatted and linked automatically.',
      group: 'synthesis',
    }),
    defineField({
      name: 'synthesisContributor',
      title: 'Contributor',
      type: 'object',
      group: 'synthesis',
      fields: [
        defineField({name: 'name', title: 'Name', type: 'string'}),
        defineField({name: 'role', title: 'Role line', type: 'string'}),
        defineField({
          name: 'headshot',
          title: 'Headshot',
          type: 'image',
          description: 'Shown whole, never cropped. Portrait or square, at least 800 px wide.',
          fields: [altField],
        }),
        defineField({
          name: 'bio',
          title: 'Bio',
          type: 'text',
          rows: 8,
          description: 'Separate paragraphs with a blank line.',
        }),
        defineField({
          name: 'links',
          title: 'Links',
          type: 'array',
          of: [
            defineArrayMember({
              type: 'object',
              name: 'gtpMediaSynthesisLink',
              fields: [
                defineField({name: 'label', title: 'Label', type: 'string', validation: (rule) => rule.required()}),
                defineField({
                  name: 'url',
                  title: 'URL',
                  type: 'url',
                  validation: (rule) => rule.required().uri({scheme: ['https']}),
                }),
              ],
              preview: {select: {title: 'label', subtitle: 'url'}},
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'synthesisMaps',
      title: 'Maps',
      type: 'array',
      of: [synthesisMap],
      description:
        'Add each plenary map under its day, with no limit. Within a day they appear in this order. Use "Final synthesis" for the overall map.',
      group: 'synthesis',
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
