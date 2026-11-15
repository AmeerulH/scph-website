import {defineArrayMember, defineField, defineType} from 'sanity'

const imageAlt = defineField({
  name: 'alt',
  title: 'Alt text',
  type: 'string',
  description: 'Describe the image for screen readers.',
})

const commitment = defineArrayMember({
  name: 'gtpSustainabilityCommitment',
  title: 'Commitment',
  type: 'object',
  fields: [
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      description: 'Short label, e.g. Sustainable Materials. Numbering follows list order.',
    }),
    defineField({name: 'headline', title: 'Headline', type: 'string', validation: (rule) => rule.required()}),
    defineField({name: 'body', title: 'Body', type: 'text', rows: 5}),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {hotspot: true},
      description: 'Landscape or square, at least 1600 px wide. A GTP photo is used when empty.',
      fields: [imageAlt],
    }),
    defineField({
      name: 'stat',
      title: 'Highlight figure (optional)',
      type: 'object',
      description: 'e.g. an emissions figure once measured. Hidden when empty.',
      fields: [
        defineField({name: 'value', title: 'Value', type: 'string'}),
        defineField({name: 'label', title: 'Label', type: 'string'}),
      ],
    }),
    defineField({
      name: 'link',
      title: 'Link (optional)',
      type: 'object',
      fields: [
        defineField({name: 'label', title: 'Label', type: 'string'}),
        defineField({
          name: 'href',
          title: 'URL or path',
          type: 'string',
          description: 'Internal path (/events/gtp-2026/...) or full https:// URL.',
        }),
      ],
    }),
  ],
  preview: {select: {title: 'headline', subtitle: 'category', media: 'image'}},
})

/** Singleton for /events/gtp-2026/sustainability (+ teaser band on the About page). */
export const gtp2026SustainabilityPageType = defineType({
  name: 'gtp2026SustainabilityPage',
  title: 'GTP 2026 Sustainability page',
  type: 'document',
  groups: [
    {name: 'page', title: 'Page', default: true},
    {name: 'commitments', title: 'Commitments'},
    {name: 'teaser', title: 'Home teaser'},
  ],
  fields: [
    defineField({name: 'internalTitle', title: 'Internal title', type: 'string', initialValue: 'Sustainability', group: 'page'}),
    defineField({name: 'pageTitle', title: 'Page title', type: 'string', initialValue: 'Our Sustainable Commitment', group: 'page'}),
    defineField({
      name: 'heroImage',
      title: 'Hero image',
      type: 'image',
      options: {hotspot: true},
      description: 'Landscape, at least 2400 x 1200 px.',
      fields: [imageAlt],
      group: 'page',
    }),
    defineField({
      name: 'introLead',
      title: 'Intro (lead sentence)',
      type: 'text',
      rows: 4,
      description: 'Shown large.',
      group: 'page',
    }),
    defineField({
      name: 'introBody',
      title: 'Intro (supporting text)',
      type: 'text',
      rows: 5,
      description: 'Separate paragraphs with a blank line.',
      group: 'page',
    }),
    defineField({
      name: 'seoDescription',
      title: 'Search / social description',
      type: 'text',
      rows: 3,
      group: 'page',
    }),
    defineField({name: 'commitmentsTitle', title: 'Commitments heading', type: 'string', initialValue: 'Our commitments', group: 'commitments'}),
    defineField({
      name: 'commitments',
      title: 'Commitments',
      type: 'array',
      of: [commitment],
      group: 'commitments',
    }),
    defineField({
      name: 'homeTeaserEnabled',
      title: 'Show teaser on the Home (About) page',
      type: 'boolean',
      initialValue: true,
      group: 'teaser',
    }),
    defineField({name: 'homeTeaserTitle', title: 'Teaser title', type: 'string', group: 'teaser'}),
    defineField({name: 'homeTeaserBody', title: 'Teaser body', type: 'text', rows: 3, group: 'teaser'}),
    defineField({
      name: 'homeTeaserImage',
      title: 'Teaser image',
      type: 'image',
      options: {hotspot: true},
      fields: [imageAlt],
      group: 'teaser',
    }),
  ],
  preview: {
    select: {t: 'internalTitle'},
    prepare({t}) {
      return {title: t ?? 'GTP 2026 Sustainability'}
    },
  },
})
