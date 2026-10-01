/**
 * Code defaults for /events/gtp-2026/programmes/book-launch. Studio fields win per field when
 * populated. Nothing here states facts about the book that the team has not confirmed: until
 * the title, date, venue and link are entered in Studio the page says "to be announced".
 */

export const GTP_BOOK_LAUNCH_PATH = "/events/gtp-2026/programmes/book-launch";

export type GtpBookLaunchImage = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
};

export type GtpBookLaunchResolved = {
  /** Page name, shown as the label above the book title (or as the title until one is set). */
  pageTitle: string;
  seoDescription: string;
  heroImage: GtpBookLaunchImage;
  /** Empty until the team enters it; the page then uses `pageTitle` as the headline. */
  bookTitle: string;
  bookSubtitle: string;
  authorName: string;
  cover: GtpBookLaunchImage | null;
  dateLabel: string;
  time: string;
  venue: string;
  detailsNote: string;
  registration: {
    closed: boolean;
    url?: string;
    label: string;
    pendingLabel: string;
  };
  introLead: string;
  body: string[];
  pullQuote: string;
  pullQuoteAttribution: string;
  author: {
    role: string;
    bio: string[];
    photo: GtpBookLaunchImage | null;
  };
  thanks: { enabled: boolean; title: string; body: string };
};

export const GTP_BOOK_LAUNCH_DEFAULTS: GtpBookLaunchResolved = {
  pageTitle: "Book Launch",
  seoDescription:
    "Join us at the Global Tipping Points Conference 2026 for the launch of a new book by Andre Hoffmann.",
  heroImage: {
    src: "/images/gtp/forest-bg.webp",
    alt: "",
  },
  bookTitle: "",
  bookSubtitle: "",
  authorName: "Andre Hoffmann",
  cover: null,
  dateLabel: "",
  time: "",
  venue: "",
  detailsNote: "",
  registration: {
    closed: false,
    label: "Register for the launch",
    pendingLabel: "Registration link coming soon",
  },
  introLead:
    "A celebration of a new book by Andre Hoffmann, shared with the community gathered for the Global Tipping Points Conference 2026.",
  body: [
    "Details about the book, the programme for the launch and how to join will be shared here as soon as they are confirmed.",
  ],
  pullQuote: "",
  pullQuoteAttribution: "",
  author: {
    role: "Author",
    bio: [],
    photo: null,
  },
  thanks: {
    enabled: true,
    title: "With thanks to Andre Hoffmann",
    body: "Our heartfelt thanks to Andre Hoffmann for his generous support of the Global Tipping Points Conference 2026 and the Sunway Centre for Planetary Health.",
  },
};
