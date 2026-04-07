import {defineField, defineType} from 'sanity'

/** Editable copy for the first “What are Global Tipping Points” band on GTP About. */
export const gtpAboutWhatIsBandType = defineType({
  name: 'gtpAboutWhatIsBand',
  title: 'What are Global Tipping Points (band)',
  type: 'object',
  fields: [
    defineField({
      name: 'enabled',
      title: 'Visible on site',
      type: 'boolean',
      initialValue: true,
      description:
        'When off, this section is hidden on the public About page (same idea as SCPH section blocks).',
    }),
    defineField({
      name: 'eyebrow',
      title: 'Eyebrow / subtitle',
      type: 'string',
      initialValue: 'New Reality',
    }),
    defineField({
      name: 'title',
      title: 'Heading',
      type: 'string',
    }),
    defineField({
      name: 'body',
      title: 'Body (two paragraphs)',
      type: 'text',
      rows: 10,
      description: 'Separate the two main paragraphs with a blank line.',
    }),
    defineField({
      name: 'quote',
      title: 'Pull quote',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'learnMoreIntro',
      title: '“Learn more” line (before the link)',
      type: 'string',
    }),
    defineField({
      name: 'learnMoreLinkLabel',
      title: 'Learn more link label',
      type: 'string',
    }),
    defineField({
      name: 'learnMoreLinkUrl',
      title: 'Learn more link URL',
      type: 'url',
    }),
    defineField({
      name: 'reportCover',
      title: 'Report cover image',
      type: 'image',
      options: {hotspot: true},
      description: 'Optional. If empty, the site uses the default report cover asset.',
    }),
    defineField({
      name: 'downloadButtonLabel',
      title: 'Download button label',
      type: 'string',
    }),
    defineField({
      name: 'downloadButtonUrl',
      title: 'Download button URL',
      type: 'url',
    }),
  ],
})
