import {defineField, defineType} from 'sanity'

/** Same UX as SCPH `sectionProseCta.enabled` — first field on each About band. */
function gtpAboutVisibleOnSiteField() {
  return defineField({
    name: 'enabled',
    title: 'Visible on site',
    type: 'boolean',
    initialValue: true,
    description:
      'When off, this section is hidden on the public About page. Extra blocks under the hero use each block’s own “Visible on site” toggle.',
  })
}

/** Hero text + CTAs above the programme carousel (GtpHeroGradient). */
export const gtpAboutHeroBandType = defineType({
  name: 'gtpAboutHeroBand',
  title: 'About hero (headline)',
  type: 'object',
  fields: [
    gtpAboutVisibleOnSiteField(),
    defineField({name: 'badge', title: 'Badge line', type: 'string'}),
    defineField({name: 'title', title: 'Headline', type: 'string'}),
    defineField({name: 'lede', title: 'Supporting line', type: 'text', rows: 3}),
    defineField({name: 'primaryCtaLabel', title: 'Primary CTA label', type: 'string'}),
    defineField({name: 'primaryCtaHref', title: 'Primary CTA URL', type: 'string'}),
    defineField({name: 'secondaryCtaLabel', title: 'Secondary CTA label', type: 'string'}),
    defineField({name: 'secondaryCtaHref', title: 'Secondary CTA URL', type: 'string'}),
    defineField({
      name: 'importantDatesEyebrow',
      title: 'Important dates — strip heading',
      type: 'string',
      description:
        'Shown above the date rows in the hero (above the programme carousel). Not shown in the site footer.',
    }),
    defineField({
      name: 'importantDates',
      title: 'Important dates',
      type: 'array',
      of: [{type: 'gtpFooterImportantDate'}],
      description:
        'Deadlines and milestones in the About page hero. Edit here — the GTP footer no longer lists dates.',
    }),
  ],
})

/** Dark “Why this meeting matters” two-column band. */
export const gtpAboutWhyMattersBandType = defineType({
  name: 'gtpAboutWhyMattersBand',
  title: 'Why this meeting matters',
  type: 'object',
  fields: [
    gtpAboutVisibleOnSiteField(),
    defineField({name: 'eyebrow', title: 'Eyebrow', type: 'string'}),
    defineField({name: 'title', title: 'Heading', type: 'string'}),
    defineField({
      name: 'body',
      title: 'Body (three paragraphs)',
      type: 'text',
      rows: 12,
      description: 'Separate paragraphs with a blank line.',
    }),
    defineField({name: 'ctaLabel', title: 'CTA button label', type: 'string'}),
    defineField({name: 'ctaHref', title: 'CTA URL (path or full URL)', type: 'string'}),
    defineField({
      name: 'tallImageSrc',
      title: 'Tall left image path/URL',
      type: 'string',
      description: 'e.g. /images/gtp/conference/leaves.jpg',
    }),
    defineField({name: 'topRightImageSrc', title: 'Top-right image path/URL', type: 'string'}),
    defineField({
      name: 'bottomRightImageSrc',
      title: 'Bottom-right image path/URL',
      type: 'string',
    }),
    defineField({name: 'tallImageAlt', title: 'Tall image alt text', type: 'string'}),
    defineField({name: 'topRightImageAlt', title: 'Top-right image alt text', type: 'string'}),
    defineField({
      name: 'bottomRightImageAlt',
      title: 'Bottom-right image alt text',
      type: 'string',
    }),
  ],
})

export const gtpAboutThemeCardType = defineType({
  name: 'gtpAboutThemeCard',
  title: 'Theme card',
  type: 'object',
  fields: [
    defineField({name: 'num', title: 'Number label', type: 'string'}),
    defineField({name: 'title', title: 'Title', type: 'string'}),
    defineField({name: 'body', title: 'Body', type: 'text', rows: 4}),
    defineField({
      name: 'icon',
      title: 'Icon',
      type: 'string',
      options: {
        list: [
          {title: 'Trending down', value: 'trending-down'},
          {title: 'Lightbulb', value: 'lightbulb'},
          {title: 'Zap', value: 'zap'},
        ],
        layout: 'radio',
      },
      initialValue: 'trending-down',
    }),
  ],
})

export const gtpAboutThemesBandType = defineType({
  name: 'gtpAboutThemesBand',
  title: 'Conference themes',
  type: 'object',
  fields: [
    gtpAboutVisibleOnSiteField(),
    defineField({name: 'title', title: 'Section title', type: 'string'}),
    defineField({name: 'subtitle', title: 'Eyebrow', type: 'string'}),
    defineField({name: 'footerBlurb', title: 'Footer line', type: 'text', rows: 3}),
    defineField({
      name: 'themes',
      title: 'Theme cards',
      type: 'array',
      of: [{type: 'gtpAboutThemeCard'}],
      validation: (rule) => rule.max(6),
    }),
  ],
})

export const gtpAboutSpeakersChromeType = defineType({
  name: 'gtpAboutSpeakersChrome',
  title: 'Speaker highlights (titles)',
  type: 'object',
  fields: [
    gtpAboutVisibleOnSiteField(),
    defineField({name: 'title', title: 'Section title', type: 'string'}),
    defineField({name: 'subtitle', title: 'Eyebrow', type: 'string'}),
  ],
})

export const gtpAboutQuoteCardType = defineType({
  name: 'gtpAboutQuoteCard',
  title: 'Quote card',
  type: 'object',
  fields: [
    defineField({name: 'name', title: 'Name', type: 'string'}),
    defineField({name: 'designation', title: 'Role / affiliation', type: 'text', rows: 2}),
    defineField({name: 'quote', title: 'Quote', type: 'text', rows: 6}),
    defineField({
      name: 'photoSrc',
      title: 'Photo path or URL',
      type: 'string',
      description: 'e.g. /images/gtp/co-chairs/tim-lenton.jpg',
    }),
    defineField({
      name: 'avatarObjectClass',
      title: 'Avatar object-position (Tailwind, optional)',
      type: 'string',
    }),
    defineField({
      name: 'avatarScaleClass',
      title: 'Avatar scale (Tailwind, optional)',
      type: 'string',
    }),
  ],
})

export const gtpAboutQuotesBandType = defineType({
  name: 'gtpAboutQuotesBand',
  title: 'Co-chair quotes',
  type: 'object',
  fields: [
    gtpAboutVisibleOnSiteField(),
    defineField({name: 'title', title: 'Section title', type: 'string'}),
    defineField({name: 'subtitle', title: 'Eyebrow', type: 'string'}),
    defineField({
      name: 'quotes',
      title: 'Quotes',
      type: 'array',
      of: [{type: 'gtpAboutQuoteCard'}],
      validation: (rule) => rule.max(8),
    }),
  ],
})

export const gtpAboutGallerySlideType = defineType({
  name: 'gtpAboutGallerySlide',
  title: 'Gallery image',
  type: 'object',
  fields: [
    defineField({
      name: 'src',
      title: 'Image path or URL',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({name: 'alt', title: 'Alt text', type: 'string', validation: (rule) => rule.required()}),
  ],
})

export const gtpAboutGalleryBandType = defineType({
  name: 'gtpAboutGalleryBand',
  title: 'Gallery strip',
  type: 'object',
  fields: [
    gtpAboutVisibleOnSiteField(),
    defineField({name: 'title', title: 'Section title', type: 'string'}),
    defineField({name: 'subtitle', title: 'Eyebrow', type: 'string'}),
    defineField({name: 'footerText', title: 'Footer (before link)', type: 'string'}),
    defineField({name: 'footerLinkLabel', title: 'Footer link label', type: 'string'}),
    defineField({name: 'footerLinkHref', title: 'Footer link URL', type: 'string'}),
    defineField({
      name: 'slides',
      title: 'Images (bento order, 15 slots)',
      type: 'array',
      of: [{type: 'gtpAboutGallerySlide'}],
      description:
        'Order matches the scrolling bento layout on the About page. Fewer than 15 falls back to built-in defaults for missing slots.',
    }),
  ],
})

export const gtpAboutEventInquiryBandType = defineType({
  name: 'gtpAboutEventInquiryBand',
  title: 'Event inquiry',
  type: 'object',
  fields: [
    gtpAboutVisibleOnSiteField(),
    defineField({name: 'title', title: 'Section title', type: 'string'}),
    defineField({name: 'subtitle', title: 'Eyebrow', type: 'string'}),
    defineField({name: 'intro', title: 'Intro paragraph', type: 'text', rows: 4}),
  ],
})

export const gtpAboutSponsorLogoType = defineType({
  name: 'gtpAboutSponsorLogo',
  title: 'Sponsor / partner logo',
  type: 'object',
  fields: [
    defineField({
      name: 'name',
      title: 'Partner name',
      type: 'string',
      validation: (rule) => rule.required(),
      description: 'Used for alt text and accessibility labels.',
    }),
    defineField({
      name: 'logo',
      title: 'Logo image',
      type: 'image',
      options: {hotspot: true},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'href',
      title: 'Website URL',
      type: 'url',
      description: 'Optional. When set, the logo links here (opens in a new tab).',
    }),
  ],
  preview: {
    select: {title: 'name', media: 'logo'},
    prepare({title, media}) {
      return {title: title ?? 'Sponsor', media}
    },
  },
})

export const gtpAboutSponsorsBandType = defineType({
  name: 'gtpAboutSponsorsBand',
  title: 'Sponsors & partners',
  type: 'object',
  fields: [
    gtpAboutVisibleOnSiteField(),
    defineField({name: 'title', title: 'Section title', type: 'string'}),
    defineField({name: 'subtitle', title: 'Eyebrow', type: 'string'}),
    defineField({
      name: 'sponsors',
      title: 'Sponsor / partner logos',
      type: 'array',
      of: [{type: 'gtpAboutSponsorLogo'}],
      description:
        'The public site shows this band only when visibility is on and at least one row has logo + name. Add rows in Studio (image + name + optional URL).',
    }),
    defineField({
      name: 'noticeBeforeLink',
      title: 'Notice (before link)',
      type: 'text',
      rows: 2,
    }),
    defineField({name: 'noticeLinkText', title: 'Link text', type: 'string'}),
    defineField({name: 'noticeLinkHref', title: 'Link URL', type: 'string'}),
  ],
})

export const gtpAboutPageBandObjectTypes = [
  gtpAboutHeroBandType,
  gtpAboutWhyMattersBandType,
  gtpAboutThemeCardType,
  gtpAboutThemesBandType,
  gtpAboutSpeakersChromeType,
  gtpAboutQuoteCardType,
  gtpAboutQuotesBandType,
  gtpAboutGallerySlideType,
  gtpAboutGalleryBandType,
  gtpAboutEventInquiryBandType,
  gtpAboutSponsorLogoType,
  gtpAboutSponsorsBandType,
]
