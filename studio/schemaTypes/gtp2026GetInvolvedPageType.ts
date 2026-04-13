import {defineField, defineType} from 'sanity'

/**
 * Visible marketing copy for /events/gtp-2026/get-involved (form behaviour stays in code).
 */
export const gtp2026GetInvolvedPageType = defineType({
  name: 'gtp2026GetInvolvedPage',
  title: 'GTP 2026 Get involved page',
  type: 'document',
  fields: [
    defineField({
      name: 'internalTitle',
      title: 'Internal title',
      type: 'string',
      initialValue: 'Get involved',
    }),
    defineField({
      name: 'heroTitle',
      title: 'Hero title',
      type: 'string',
    }),
    defineField({
      name: 'heroLede',
      title: 'Hero lede',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'contactSectionTitle',
      title: 'Contact section — title',
      type: 'string',
    }),
    defineField({
      name: 'contactSectionSubtitle',
      title: 'Contact section — subtitle',
      type: 'string',
    }),
    defineField({
      name: 'contactIntro',
      title: 'Contact section — intro paragraph',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'contactOrgName',
      title: 'Contact — organisation name',
      type: 'string',
    }),
    defineField({
      name: 'contactOrgAddress',
      title: 'Contact — address line',
      type: 'string',
    }),
    defineField({
      name: 'contactConferenceDates',
      title: 'Contact — conference dates line',
      type: 'string',
    }),
    defineField({
      name: 'contactIntroSuffix',
      title: 'Contact — text after FAQ link',
      description:
        'Shown after the FAQ link when FAQ label and URL are set. Example: “Feel free to contact us using the form.”',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'contactFaqLinkLabel',
      title: 'Contact — FAQ link label',
      description: 'Leave empty to hide the FAQ link. Use with FAQ URL.',
      type: 'string',
    }),
    defineField({
      name: 'contactFaqHref',
      title: 'Contact — FAQ URL or path',
      description: 'Internal path (e.g. /events/gtp-2026/faq) or full URL.',
      type: 'string',
    }),
    defineField({
      name: 'contactInfoAddressLabel',
      title: 'Contact info — address label',
      type: 'string',
    }),
    defineField({
      name: 'contactInfoAddress',
      title: 'Contact info — address',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'contactInfoHoursLabel',
      title: 'Contact info — operating hours label',
      type: 'string',
    }),
    defineField({
      name: 'contactInfoHours',
      title: 'Contact info — operating hours',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'contactInfoPhoneLabel',
      title: 'Contact info — phone label',
      type: 'string',
    }),
    defineField({
      name: 'contactInfoPhone',
      title: 'Contact info — phone (display)',
      type: 'string',
    }),
    defineField({
      name: 'contactInfoPhoneTel',
      title: 'Contact info — phone tel: value',
      description:
        'Optional. E.164 or digits for the tel: link (e.g. +60374918622). Leave empty to show phone as plain text.',
      type: 'string',
    }),
    defineField({
      name: 'contactInfoEmailLabel',
      title: 'Contact info — email label',
      type: 'string',
    }),
    defineField({
      name: 'contactInfoEmail',
      title: 'Contact info — email address',
      type: 'string',
    }),
    defineField({
      name: 'contactInfoSocialHeading',
      title: 'Contact info — social heading',
      type: 'string',
    }),
    defineField({
      name: 'contactInfoSocialLinks',
      title: 'Contact info — social links',
      type: 'array',
      of: [{type: 'footerSocialLink'}],
    }),
    defineField({
      name: 'contactMapEmbedUrl',
      title: 'Google Map — embed URL',
      description:
        'In Google Maps: Share → Embed a map → copy only the iframe src URL (https://www.google.com/maps/embed?...).',
      type: 'url',
    }),
    defineField({
      name: 'contactMapTitle',
      title: 'Google Map — iframe title (accessibility)',
      type: 'string',
    }),
    defineField({
      name: 'partnershipSectionTitle',
      title: 'Partnership section — title',
      type: 'string',
    }),
    defineField({
      name: 'partnershipSectionSubtitle',
      title: 'Partnership section — subtitle',
      type: 'string',
    }),
    defineField({
      name: 'partnershipLead',
      title: 'Partnership — lead paragraph',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'partnershipHighlight',
      title: 'Partnership — emphasis paragraph',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'partnershipBody',
      title: 'Partnership — supporting paragraph',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'partnershipCtaLabel',
      title: 'Partnership — button label',
      type: 'string',
    }),
  ],
  preview: {
    select: {t: 'internalTitle'},
    prepare({t}) {
      return {title: t ?? 'GTP 2026 Get involved'}
    },
  },
})
