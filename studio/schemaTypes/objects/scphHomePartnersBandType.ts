import {defineField, defineType} from 'sanity'

/**
 * Partners marquee + notice on SCPH home (`/`).
 * Reuses `gtpAboutSponsorLogo` for each row (name, image, optional URL) like GTP About sponsors.
 */
export const scphHomePartnersBandType = defineType({
  name: 'scphHomePartnersBand',
  title: 'Home partners band',
  type: 'object',
  fields: [
    defineField({
      name: 'showBand',
      title: 'Show partners band on home page',
      type: 'boolean',
      initialValue: true,
      description:
        'When on, the band appears only if at least one partner has both logo and name. When off, the band is hidden.',
    }),
    defineField({
      name: 'title',
      title: 'Section title',
      type: 'string',
      initialValue: 'Building Coalitions for Change',
    }),
    defineField({
      name: 'subtitle',
      title: 'Eyebrow',
      type: 'string',
      initialValue: 'Our Partners',
    }),
    defineField({
      name: 'partners',
      title: 'Partner logos',
      type: 'array',
      of: [{type: 'gtpAboutSponsorLogo'}],
      description:
        'Add as many as needed; they appear in the scrolling strip. If empty, placeholder tiles are shown.',
    }),
    defineField({
      name: 'noticeBeforeLink',
      title: 'Notice (before link)',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'noticeLinkText',
      title: 'Link text',
      type: 'string',
    }),
    defineField({
      name: 'noticeLinkHref',
      title: 'Link URL',
      type: 'string',
      description: 'Path (e.g. /network) or full URL.',
    }),
  ],
})
