import {defineField, defineType} from 'sanity'

/** Hero copy on the SCPH home page (gradient block above the events strip). */
export const scphHomeHeroType = defineType({
  name: 'scphHomeHero',
  title: 'Home hero',
  type: 'object',
  fields: [
    defineField({
      name: 'headlinePrefix',
      title: 'Headline line 1',
      type: 'string',
      description: 'First line of the hero title (white), e.g. “Sunway Centre for”.',
      initialValue: 'Sunway Centre for',
    }),
    defineField({
      name: 'headlineAccent',
      title: 'Headline line 2 (accent)',
      type: 'string',
      description: 'Second line of the hero title (brand green), e.g. “Planetary Health”.',
      initialValue: 'Planetary Health',
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
      initialValue: 'Where knowledge meets action',
    }),
    defineField({
      name: 'body',
      title: 'Intro paragraph',
      type: 'text',
      rows: 5,
      initialValue:
        'A "Think-and-Do" tank, committed to research and advocacy that advances planetary health through three priority areas: healthy cities, health-centred decarbonisation, and driving an education revolution.',
    }),
  ],
})
