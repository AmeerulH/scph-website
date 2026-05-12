import {defineField, defineType} from 'sanity'
import {sectionBlockMembers} from './objects'

/**
 * Singleton-style home overrides. Create one document of this type in Studio.
 * The site uses the first (and should be only) `scphHomePage` document.
 */
export const scphHomePageType = defineType({
  name: 'scphHomePage',
  title: 'SCPH Home page',
  type: 'document',
  fields: [
    defineField({
      name: 'internalTitle',
      title: 'Internal title',
      type: 'string',
      description: 'Shown in the document list only.',
      initialValue: 'Home',
    }),
    defineField({
      name: 'hero',
      title: 'Hero',
      type: 'scphHomeHero',
      description:
        'Main headline, tagline, and intro above the stats row. Leave empty to use built-in defaults.',
    }),
    defineField({
      name: 'highlightedEvents',
      title: 'Highlighted events (hero strip)',
      type: 'array',
      of: [{type: 'scphHomeHighlightedEvent'}],
      description:
        'Rows in the dark strip at the bottom of the hero. Add multiple for a scrollable row. Leave empty for built-in defaults.',
    }),
    defineField({
      name: 'statsRow',
      title: 'Stats row',
      type: 'sectionStatsRow',
      description:
        'Optional. Leave empty or disable to keep the built-in default stats on the live site.',
    }),
    defineField({
      name: 'introSections',
      title: 'Sections after stats',
      type: 'array',
      of: [...sectionBlockMembers],
      description:
        'Optional blocks between the stats row and the About section (e.g. rich text or CTA sections).',
    }),
    defineField({
      name: 'aboutSection',
      title: 'About section',
      type: 'scphHomeAboutSection',
      description: 'The "About Us" two-column section. Toggle visibility and edit copy here.',
    }),
    defineField({
      name: 'priorityAreasSection',
      title: 'Priority areas section',
      type: 'scphHomePrioritiesSection',
      description:
        'The "Three Key Priorities" card grid. Toggle visibility and edit card titles/descriptions here.',
    }),
    defineField({
      name: 'roadmapSection',
      title: 'Roadmap section',
      type: 'sectionProseCta',
      description:
        'Optional. When set and visible, replaces the default "Planetary Health Roadmap" block.',
    }),
    defineField({
      name: 'nphapSection',
      title: 'NPHAP section',
      type: 'sectionProseCta',
      description:
        'Optional. When set and visible, replaces the default NPHAP block before partners.',
    }),
    defineField({
      name: 'partnersBand',
      title: 'Partners band',
      type: 'scphHomePartnersBand',
      description:
        'Partner logos marquee and footer notice. Reuses the same logo object type as GTP About sponsors.',
    }),
    defineField({
      name: 'showGtpSection',
      title: 'Show GTP promo section',
      type: 'boolean',
      description:
        'Show or hide the "New Reality / What are Global Tipping Points" and Speaker Highlights bands.',
      initialValue: true,
    }),
    defineField({
      name: 'showGtpInquirySection',
      title: 'Show GTP "Get in Touch" section',
      type: 'boolean',
      description: 'Show or hide the GTP event inquiry contact form.',
      initialValue: true,
    }),
  ],
  preview: {
    select: {title: 'internalTitle'},
    prepare({title}) {
      return {title: title ?? 'SCPH Home page'}
    },
  },
})
