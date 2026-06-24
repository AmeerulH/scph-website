/**
 * Defaults for the GTP About “Accommodation and Activities” carousel
 * (`gtpAboutAccommodationActivitiesBand` on `gtp2026AboutPage`).
 */

export type GtpAccommodationActivityCardCopy = {
  /** Stable id for React keys (slug). */
  id: string;
  categoryLabel: string;
  title: string;
  description: string;
  primaryCtaLabel: string;
  primaryCtaHref: string;
  mapsHref?: string;
  address?: string;
  /** Resolved Sanity CDN URL or local `/public` fallback path. */
  imageUrl?: string;
  /** CSS `background` value when no image is set. */
  backgroundGradient: string;
};

export type GtpAccommodationActivitiesBandCopy = {
  enabled: boolean;
  title: string;
  /** Optional SectionWrapper eyebrow; leave empty to hide. */
  subtitle: string;
  intro: string;
  cards: GtpAccommodationActivityCardCopy[];
};

export const DEFAULT_GTP_ACCOMMODATION_ACTIVITIES_BAND: GtpAccommodationActivitiesBandCopy =
  {
    enabled: true,
    title: "Accommodation and Activities",
    subtitle: "",
    intro:
      "Enjoy special rates and explore fun activities. Let us inspire your visit to Sunway City, Malaysia",
    cards: [
      {
        id: "sunway-lagoon-hotel",
        categoryLabel: "Official Hotel",
        title: "Sunway Lagoon Hotel",
        description:
          "Preferred delegate rates. Check-in 9 Oct · Check-out 18 Oct 2026.",
        primaryCtaLabel: "Book Now",
        primaryCtaHref:
          "https://reservations.travelclick.com/110621?RatePlanId=11226966",
        address:
          "Jalan 11/15, Bandar Sunway, 47500 Petaling Jaya, Selangor, Malaysia",
        mapsHref:
          "https://maps.google.com/maps?q=Sunway+Lagoon+Hotel,+Jalan+11/15,+Bandar+Sunway,+47500+Petaling+Jaya",
        imageUrl: "/images/gtp/sunway-lagoon-hotel.jpg",
        backgroundGradient:
          "radial-gradient(ellipse at top left, #1a7a96 0%, #0a3d4d 100%)",
      },
      {
        id: "sunway-pyramid",
        categoryLabel: "Shopping Mall",
        title: "Sunway Pyramid",
        description:
          "Malaysia’s iconic shopping mall at the heart of Sunway City.",
        primaryCtaLabel: "Explore now",
        primaryCtaHref: "https://www.sunwaypyramid.com/",
        mapsHref:
          "https://maps.google.com/maps?q=Sunway+Pyramid,+Petaling+Jaya,+Selangor",
        imageUrl: "/images/gtp/accommodation/sunway-pyramid.png",
        backgroundGradient:
          "radial-gradient(ellipse at top right, #5c2d8a 0%, #2a1540 100%)",
      },
      {
        id: "sunway-square",
        categoryLabel: "Official Venue",
        title: "Sunway Square",
        description:
          "Retail and lifestyle destination next to the conference campus.",
        primaryCtaLabel: "Explore now",
        primaryCtaHref: "https://www.sunwaysquare.com/mall",
        mapsHref:
          "https://maps.google.com/maps?q=Sunway+Square,+Bandar+Sunway,+Selangor",
        imageUrl: "/images/gtp/accommodation/sunway-square.png",
        backgroundGradient:
          "radial-gradient(ellipse at bottom left, #1a7a96 0%, #093a48 100%)",
      },
      {
        id: "sunway-lagoon-theme-park",
        categoryLabel: "Theme Park",
        title: "Sunway Lagoon",
        description:
          "Theme park, water park, and wildlife experiences in Sunway City.",
        primaryCtaLabel: "Book now",
        primaryCtaHref: "https://sunwaylagoon.com/",
        mapsHref:
          "https://maps.google.com/maps?q=Sunway+Lagoon+Theme+Park,+Bandar+Sunway",
        imageUrl: "/images/gtp/accommodation/sunway-lagoon-theme-park.png",
        backgroundGradient:
          "radial-gradient(ellipse at bottom right, #3a6e14 0%, #1c3a08 100%)",
      },
    ],
  };
