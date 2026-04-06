import {defineField, defineType} from 'sanity'

/** Icons for About → strategy cards (maps to lucide in the app). */
const strategyIconList = [
  {title: 'Target', value: 'target'},
  {title: 'Arrow right', value: 'arrow-right'},
  {title: 'Book open', value: 'book-open'},
  {title: 'Users', value: 'users'},
] as const

/** Icons for Research → pillar cards. */
const pillarIconList = [
  {title: 'Shield alert', value: 'shield-alert'},
  {title: 'Thermometer', value: 'thermometer'},
  {title: 'Building', value: 'building2'},
  {title: 'Wheat', value: 'wheat'},
  {title: 'Megaphone', value: 'megaphone'},
  {title: 'Landmark', value: 'landmark'},
  {title: 'Graduation cap', value: 'graduation-cap'},
] as const

export const scphAboutFoundationBandType = defineType({
  name: 'scphAboutFoundationBand',
  title: 'About — Our Foundation',
  type: 'object',
  fields: [
    defineField({name: 'eyebrow', title: 'Eyebrow', type: 'string'}),
    defineField({name: 'heading', title: 'Heading', type: 'string'}),
    defineField({name: 'body', title: 'Body', type: 'text', rows: 8}),
    defineField({
      name: 'image1',
      title: 'Image 1',
      type: 'image',
      description: 'Optional — e.g. Planetary Health diagram. Leave empty until the asset is ready.',
      options: {hotspot: true},
      fields: [
        defineField({name: 'alt', title: 'Alt text', type: 'string'}),
        defineField({name: 'caption', title: 'Caption', type: 'string'}),
      ],
    }),
    defineField({
      name: 'image2',
      title: 'Image 2',
      type: 'image',
      description: 'Optional — e.g. Wedding Cake diagram.',
      options: {hotspot: true},
      fields: [
        defineField({name: 'alt', title: 'Alt text', type: 'string'}),
        defineField({name: 'caption', title: 'Caption', type: 'string'}),
      ],
    }),
  ],
})

export const scphAboutStrategyCardType = defineType({
  name: 'scphAboutStrategyCard',
  title: 'Strategy card',
  type: 'object',
  fields: [
    defineField({
      name: 'iconKey',
      title: 'Icon',
      type: 'string',
      options: {list: [...strategyIconList], layout: 'dropdown'},
      validation: (rule) => rule.required(),
    }),
    defineField({name: 'title', title: 'Title', type: 'string', validation: (rule) => rule.required()}),
    defineField({name: 'description', title: 'Description', type: 'text', rows: 3}),
    defineField({name: 'href', title: 'Link URL or path', type: 'string', initialValue: '#'}),
  ],
})

export const scphAboutStrategyBandType = defineType({
  name: 'scphAboutStrategyBand',
  title: 'About — Vision & strategy',
  type: 'object',
  fields: [
    defineField({name: 'sectionSubtitle', title: 'Section eyebrow', type: 'string'}),
    defineField({name: 'sectionTitle', title: 'Section title', type: 'string'}),
    defineField({name: 'introBody', title: 'Intro paragraphs', type: 'text', rows: 6}),
    defineField({
      name: 'cards',
      title: 'Cards',
      type: 'array',
      of: [{type: 'scphAboutStrategyCard'}],
    }),
  ],
})

export const scphAboutJourneyBandType = defineType({
  name: 'scphAboutJourneyBand',
  title: 'About — Our Journey',
  type: 'object',
  fields: [
    defineField({name: 'sectionSubtitle', title: 'Section eyebrow', type: 'string'}),
    defineField({name: 'sectionTitle', title: 'Section title', type: 'string'}),
    defineField({name: 'placeholderTitle', title: 'Placeholder title', type: 'string'}),
    defineField({name: 'placeholderBody', title: 'Placeholder description', type: 'text', rows: 3}),
  ],
})

export const scphResearchPillarCardType = defineType({
  name: 'scphResearchPillarCard',
  title: 'Research pillar',
  type: 'object',
  fields: [
    defineField({
      name: 'iconKey',
      title: 'Icon',
      type: 'string',
      options: {list: [...pillarIconList], layout: 'dropdown'},
      validation: (rule) => rule.required(),
    }),
    defineField({name: 'num', title: 'Number label', type: 'string'}),
    defineField({name: 'title', title: 'Title', type: 'string', validation: (rule) => rule.required()}),
    defineField({name: 'description', title: 'Description', type: 'text', rows: 4}),
  ],
})

export const scphNetworkCommunityBandType = defineType({
  name: 'scphNetworkCommunityBand',
  title: 'Network — community',
  type: 'object',
  fields: [
    defineField({name: 'copyEyebrow', title: 'Left column eyebrow', type: 'string'}),
    defineField({name: 'copyTitle', title: 'Left column title', type: 'string'}),
    defineField({name: 'copyBody', title: 'Left column body', type: 'text', rows: 6}),
    defineField({name: 'benefitsEyebrow', title: 'Right column eyebrow', type: 'string'}),
    defineField({name: 'benefitsTitle', title: 'Right column title', type: 'string'}),
    defineField({
      name: 'benefitItems',
      title: 'Member benefits',
      type: 'array',
      of: [{type: 'string'}],
    }),
  ],
})

export const scphPageBandObjectTypes = [
  scphAboutFoundationBandType,
  scphAboutStrategyCardType,
  scphAboutStrategyBandType,
  scphAboutJourneyBandType,
  scphResearchPillarCardType,
  scphNetworkCommunityBandType,
]
