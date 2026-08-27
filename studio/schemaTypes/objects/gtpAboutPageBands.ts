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
      name: 'tallImage',
      title: 'Tall left image',
      type: 'image',
      options: {hotspot: true},
      description: 'Uploaded via Sanity. Replaces the default leaves image.',
    }),
    defineField({
      name: 'topRightImage',
      title: 'Top-right image',
      type: 'image',
      options: {hotspot: true},
      description: 'Uploaded via Sanity. Replaces the default river image.',
    }),
    defineField({
      name: 'bottomRightImage',
      title: 'Bottom-right image',
      type: 'image',
      options: {hotspot: true},
      description: 'Uploaded via Sanity. Replaces the default solar image.',
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
      name: 'photo',
      title: 'Photo',
      type: 'image',
      options: {hotspot: true},
      description: 'Upload the speaker/co-chair photo directly.',
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
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {hotspot: true},
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
  title: 'Sponsor logo',
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
      name: 'tier',
      title: 'Tier',
      type: 'string',
      options: {
        list: [
          {title: 'Platinum', value: 'platinum'},
          {title: 'Gold', value: 'gold'},
          {title: 'Silver', value: 'silver'},
          {title: 'Bronze', value: 'bronze'},
          {title: 'Others', value: 'others'},
        ],
        layout: 'radio',
      },
      description:
        'Sponsors only. Required for the logo to appear on the site. Leave empty to hide it.',
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
    select: {title: 'name', tier: 'tier', media: 'logo'},
    prepare({title, tier, media}) {
      const tierLabel =
        tier === 'platinum'
          ? 'Platinum'
          : tier === 'gold'
            ? 'Gold'
            : tier === 'silver'
              ? 'Silver'
              : tier === 'bronze'
                ? 'Bronze'
                : tier === 'others'
                  ? 'Others'
                  : 'No tier (hidden on site)'
      return {title: title ?? 'Sponsor', subtitle: tierLabel, media}
    },
  },
})

/** Partners band logos — no tier tagging. */
export const gtpAboutPartnerLogoType = defineType({
  name: 'gtpAboutPartnerLogo',
  title: 'Partner logo',
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
      return {title: title ?? 'Partner', media}
    },
  },
})

const GTP_LOGO_TIER_MAX = 5

function validateLogosMaxPerTier(
  logos: Array<{tier?: string} | undefined> | undefined,
): true | string {
  if (!logos?.length) return true
  const counts: Record<string, number> = {
    platinum: 0,
    gold: 0,
    silver: 0,
    bronze: 0,
    others: 0,
  }
  for (const row of logos) {
    const t = row?.tier
    if (t && t in counts) counts[t] += 1
  }
  for (const [tier, count] of Object.entries(counts)) {
    if (count > GTP_LOGO_TIER_MAX) {
      return `At most ${GTP_LOGO_TIER_MAX} logos per tier (${tier} has ${count}).`
    }
  }
  return true
}

export const gtpAboutSponsorsBandType = defineType({
  name: 'gtpAboutSponsorsBand',
  title: 'Sponsors band',
  type: 'object',
  fields: [
    gtpAboutVisibleOnSiteField(),
    defineField({name: 'title', title: 'Section title', type: 'string'}),
    defineField({name: 'subtitle', title: 'Eyebrow', type: 'string'}),
    defineField({
      name: 'sponsors',
      title: 'Sponsor logos',
      type: 'array',
      of: [{type: 'gtpAboutSponsorLogo'}],
      description:
        'Set Tier on each logo (Platinum–Others). Logos without a tier stay hidden on the site. Max 5 per tier.',
      validation: (rule) => rule.custom(validateLogosMaxPerTier),
    }),
    defineField({
      name: 'platinum',
      title: 'Platinum (legacy list)',
      type: 'array',
      of: [{type: 'gtpAboutSponsorLogo'}],
      hidden: true,
    }),
    defineField({
      name: 'gold',
      title: 'Gold (legacy list)',
      type: 'array',
      of: [{type: 'gtpAboutSponsorLogo'}],
      hidden: true,
    }),
    defineField({
      name: 'silver',
      title: 'Silver (legacy list)',
      type: 'array',
      of: [{type: 'gtpAboutSponsorLogo'}],
      hidden: true,
    }),
    defineField({
      name: 'bronze',
      title: 'Bronze (legacy list)',
      type: 'array',
      of: [{type: 'gtpAboutSponsorLogo'}],
      hidden: true,
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

export const gtpAboutPartnersBandType = defineType({
  name: 'gtpAboutPartnersBand',
  title: 'Partners band',
  type: 'object',
  fields: [
    gtpAboutVisibleOnSiteField(),
    defineField({name: 'title', title: 'Section title', type: 'string'}),
    defineField({name: 'subtitle', title: 'Eyebrow', type: 'string'}),
    defineField({
      name: 'partners',
      title: 'Partner logos',
      type: 'array',
      of: [
        {type: 'gtpAboutPartnerLogo'},
        // Legacy rows saved as sponsor logos (may still have a tier field; site ignores it).
        {type: 'gtpAboutSponsorLogo'},
      ],
      description:
        'Main partner logos (e.g. PIK, Exeter, Sunway). No tier tagging. Prefer “Partner logo” when adding new rows.',
    }),
    defineField({
      name: 'supportedBy',
      title: 'Supported by logos',
      type: 'array',
      of: [
        {type: 'gtpAboutPartnerLogo'},
        {type: 'gtpAboutSponsorLogo'},
      ],
      description:
        'Secondary partner strip shown below the main partner logos, labelled “Supported by” on the site. Empty list shows Coming soon.',
    }),
    defineField({
      name: 'platinum',
      title: 'Platinum (legacy list)',
      type: 'array',
      of: [{type: 'gtpAboutSponsorLogo'}],
      hidden: true,
    }),
    defineField({
      name: 'gold',
      title: 'Gold (legacy list)',
      type: 'array',
      of: [{type: 'gtpAboutSponsorLogo'}],
      hidden: true,
    }),
    defineField({
      name: 'silver',
      title: 'Silver (legacy list)',
      type: 'array',
      of: [{type: 'gtpAboutSponsorLogo'}],
      hidden: true,
    }),
    defineField({
      name: 'bronze',
      title: 'Bronze (legacy list)',
      type: 'array',
      of: [{type: 'gtpAboutSponsorLogo'}],
      hidden: true,
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

export const gtpAboutAccommodationCardType = defineType({
  name: 'gtpAboutAccommodationCard',
  title: 'Carousel card',
  type: 'object',
  fields: [
    defineField({
      name: 'categoryLabel',
      title: 'Category badge',
      type: 'string',
      description: 'e.g. Official Hotel, Shopping Mall, Theme Park',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'primaryCtaLabel',
      title: 'Primary button label',
      type: 'string',
      description: 'e.g. Book Now, Explore now',
    }),
    defineField({
      name: 'primaryCtaHref',
      title: 'Primary button URL',
      type: 'url',
      validation: (rule) =>
        rule.uri({allowRelative: false, scheme: ['http', 'https']}),
    }),
    defineField({
      name: 'mapsHref',
      title: 'Open in Maps URL',
      type: 'url',
      description: 'Google Maps (or other maps) link. Leave empty to hide the Maps button.',
      validation: (rule) =>
        rule.uri({allowRelative: false, scheme: ['http', 'https']}),
    }),
    defineField({
      name: 'address',
      title: 'Address line',
      type: 'string',
      description: 'Optional. Shown with a map pin (e.g. hotel address).',
    }),
    defineField({
      name: 'image',
      title: 'Card photo',
      type: 'image',
      options: {hotspot: true},
      description:
        'Recommended ~1200×900 px or larger (4:3). Without an image, the gradient fallback below is used.',
      fields: [
        defineField({
          name: 'alt',
          type: 'string',
          title: 'Alt text',
        }),
      ],
    }),
    defineField({
      name: 'backgroundGradient',
      title: 'Gradient fallback (no photo)',
      type: 'string',
      description:
        'CSS background value when no image is uploaded (e.g. radial-gradient(ellipse at top left, #1a7a96 0%, #0a3d4d 100%)).',
    }),
  ],
  preview: {
    select: {title: 'title', category: 'categoryLabel', media: 'image'},
    prepare({title, category, media}) {
      return {
        title: title ?? 'Carousel card',
        subtitle: category,
        media,
      }
    },
  },
})

export const gtpAboutAccommodationActivitiesBandType = defineType({
  name: 'gtpAboutAccommodationActivitiesBand',
  title: 'Accommodation and Activities',
  type: 'object',
  fields: [
    gtpAboutVisibleOnSiteField(),
    defineField({
      name: 'title',
      title: 'Section title',
      type: 'string',
      initialValue: 'Accommodation and Activities',
    }),
    defineField({
      name: 'subtitle',
      title: 'Eyebrow (optional)',
      type: 'string',
      description: 'Small label above the title. Leave empty to hide.',
    }),
    defineField({
      name: 'intro',
      title: 'Intro paragraph',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'cards',
      title: 'Carousel cards',
      type: 'array',
      of: [{type: 'gtpAboutAccommodationCard'}],
      description:
        'Drag rows to set carousel order. The featured (centre) card shows full details and buttons.',
    }),
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
  gtpAboutAccommodationCardType,
  gtpAboutAccommodationActivitiesBandType,
  gtpAboutEventInquiryBandType,
  gtpAboutSponsorLogoType,
  gtpAboutPartnerLogoType,
  gtpAboutSponsorsBandType,
  gtpAboutPartnersBandType,
]
