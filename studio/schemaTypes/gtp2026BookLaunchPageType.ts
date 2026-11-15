import {defineField, defineType} from 'sanity'

const imageAlt = defineField({
  name: 'alt',
  title: 'Alt text',
  type: 'string',
  description: 'Describe the image for screen readers.',
})

/** Singleton for /events/gtp-2026/programmes/book-launch. */
export const gtp2026BookLaunchPageType = defineType({
  name: 'gtp2026BookLaunchPage',
  title: 'GTP 2026 Book Launch page',
  type: 'document',
  groups: [
    {name: 'launch', title: 'Launch', default: true},
    {name: 'event', title: 'Date and registration'},
    {name: 'book', title: 'About the book'},
    {name: 'author', title: 'Author'},
    {name: 'thanks', title: 'With thanks'},
  ],
  fields: [
    defineField({
      name: 'internalTitle',
      title: 'Internal title',
      type: 'string',
      initialValue: 'Book Launch',
      group: 'launch',
    }),
    defineField({
      name: 'pageTitle',
      title: 'Page name',
      type: 'string',
      initialValue: 'Book Launch',
      description:
        'Shown as the small label above the book title. If the Book title below is empty, this is used as the main headline.',
      group: 'launch',
    }),
    defineField({
      name: 'bookTitle',
      title: 'Book title',
      type: 'string',
      description: 'The main headline of the page.',
      group: 'launch',
    }),
    defineField({
      name: 'bookSubtitle',
      title: 'Subtitle (optional)',
      type: 'string',
      group: 'launch',
    }),
    defineField({
      name: 'authorName',
      title: 'Author name',
      type: 'string',
      initialValue: 'Andre Hoffmann',
      group: 'launch',
    }),
    defineField({
      name: 'coverImage',
      title: 'Book cover or poster',
      type: 'image',
      options: {hotspot: true},
      description:
        'Portrait artwork, shown in full and not cropped. Without one, the page shows a designed stand-in with the title and author.',
      fields: [imageAlt],
      group: 'launch',
    }),
    defineField({
      name: 'heroImage',
      title: 'Banner image (optional)',
      type: 'image',
      options: {hotspot: true},
      description:
        'Landscape, at least 2400 x 1200 px. Sits behind the title under a deep teal tint. The GTP forest image is used when empty.',
      fields: [imageAlt],
      group: 'launch',
    }),
    defineField({
      name: 'seoDescription',
      title: 'Search / social description',
      type: 'text',
      rows: 3,
      group: 'launch',
    }),

    defineField({
      name: 'dateLabel',
      title: 'Date',
      type: 'string',
      description: 'For example 14 October 2026. Shows "Date to be announced" while empty.',
      group: 'event',
    }),
    defineField({
      name: 'time',
      title: 'Time',
      type: 'string',
      description: 'For example 6:30 PM. Shows "Time to be announced" while empty.',
      group: 'event',
    }),
    defineField({
      name: 'venue',
      title: 'Venue',
      type: 'string',
      description: 'Shows "Venue to be announced" while empty.',
      group: 'event',
    }),
    defineField({
      name: 'detailsNote',
      title: 'Note under the details (optional)',
      type: 'string',
      description: 'For example who the launch is open to.',
      group: 'event',
    }),
    defineField({
      name: 'registrationUrl',
      title: 'Registration URL',
      type: 'url',
      validation: (rule) => rule.uri({scheme: ['https']}),
      description:
        'Link to the sign-up form. While empty, the button is greyed out and shows the text below. Paste the link and publish to turn it into a working button.',
      group: 'event',
    }),
    defineField({
      name: 'registrationLabel',
      title: 'Registration button label',
      type: 'string',
      description: 'Shown on the working button. Default: Register for the launch.',
      group: 'event',
    }),
    defineField({
      name: 'registrationPendingLabel',
      title: 'Button text until the link is ready',
      type: 'string',
      description: 'Shown on the greyed-out button. Default: Registration link coming soon.',
      group: 'event',
    }),
    defineField({
      name: 'registrationClosed',
      title: 'Registration closed',
      type: 'boolean',
      initialValue: false,
      description: 'Tick to replace every Register button with "Registration closed".',
      group: 'event',
    }),

    defineField({
      name: 'introLead',
      title: 'Introduction (lead sentence)',
      type: 'text',
      rows: 4,
      description: 'Shown large at the start of the About the book section.',
      group: 'book',
    }),
    defineField({
      name: 'body',
      title: 'Description',
      type: 'text',
      rows: 8,
      description: 'Supporting text. Separate paragraphs with a blank line.',
      group: 'book',
    }),
    defineField({
      name: 'pullQuote',
      title: 'Quote (optional)',
      type: 'text',
      rows: 3,
      description: 'A line from the book or the author. Hidden when empty.',
      group: 'book',
    }),
    defineField({
      name: 'pullQuoteAttribution',
      title: 'Quote attribution (optional)',
      type: 'string',
      group: 'book',
    }),

    defineField({
      name: 'authorRole',
      title: 'Author role line',
      type: 'string',
      initialValue: 'Author',
      group: 'author',
    }),
    defineField({
      name: 'authorBio',
      title: 'About the author',
      type: 'text',
      rows: 8,
      description:
        'Separate paragraphs with a blank line. The author section is hidden when both this and the photo are empty.',
      group: 'author',
    }),
    defineField({
      name: 'authorPhoto',
      title: 'Author photo',
      type: 'image',
      options: {hotspot: true},
      description: 'Portrait or square, at least 1200 px.',
      fields: [imageAlt],
      group: 'author',
    }),

    defineField({
      name: 'thanksEnabled',
      title: 'Show the thank-you section',
      type: 'boolean',
      initialValue: true,
      group: 'thanks',
    }),
    defineField({name: 'thanksTitle', title: 'Title', type: 'string', group: 'thanks'}),
    defineField({name: 'thanksBody', title: 'Message', type: 'text', rows: 4, group: 'thanks'}),
  ],
  preview: {
    select: {t: 'internalTitle', book: 'bookTitle', media: 'coverImage'},
    prepare({t, book, media}) {
      return {title: book || t || 'GTP 2026 Book Launch', subtitle: 'Book Launch page', media}
    },
  },
})
