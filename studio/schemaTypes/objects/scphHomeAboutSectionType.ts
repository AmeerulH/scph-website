import {defineField, defineType} from 'sanity'

/** About Us band on the SCPH home page. */
export const scphHomeAboutSectionType = defineType({
  name: 'scphHomeAboutSection',
  title: 'About section',
  type: 'object',
  fields: [
    defineField({
      name: 'enabled',
      title: 'Visible on site',
      type: 'boolean',
      description: 'Toggle to show or hide the About Us section.',
      initialValue: true,
    }),
    defineField({
      name: 'eyebrow',
      title: 'Eyebrow label',
      type: 'string',
      description: 'Small text above the title (e.g. "About Us").',
      initialValue: 'About Us',
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      initialValue: 'Sunway Centre for Planetary Health',
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'text',
      rows: 6,
      initialValue:
        'Sunway Centre for Planetary Health is a "Think-and-Do" tank, committed to research and advocacy that advances planetary health through three priority areas: healthy cities, health-centred decarbonisation, and driving an education revolution. Established in 2021.',
    }),
    defineField({
      name: 'ctaLabel',
      title: 'Button label',
      type: 'string',
      initialValue: 'Learn More',
    }),
    defineField({
      name: 'ctaHref',
      title: 'Button link',
      type: 'string',
      description: 'Internal path (e.g. /about-us) or external URL.',
      initialValue: '/about-us',
    }),
  ],
  preview: {
    select: {title: 'title', enabled: 'enabled'},
    prepare({title, enabled}: {title?: string; enabled?: boolean}) {
      return {
        title: title || 'About section',
        subtitle: enabled === false ? 'Hidden' : undefined,
      }
    },
  },
})
