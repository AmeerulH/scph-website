/**
 * Code defaults for /events/gtp-2026/sustainability (copy from the GTP2026 Sustainability
 * Commitment brief). Studio fields win per field when populated.
 */

export const GTP_SUSTAINABILITY_PATH = "/events/gtp-2026/sustainability";

export type GtpSustainabilityImage = { src: string; alt: string };

export type GtpSustainabilityCommitment = {
  id: string;
  category: string;
  headline: string;
  body: string;
  image: GtpSustainabilityImage;
  stat?: { value: string; label: string };
  link?: { label: string; href: string };
};

export type GtpSustainabilityPageResolved = {
  title: string;
  seoDescription: string;
  heroImage: GtpSustainabilityImage;
  introLead: string;
  introBody: string[];
  commitmentsTitle: string;
  commitments: GtpSustainabilityCommitment[];
  teaser: {
    enabled: boolean;
    title: string;
    body: string;
    image: GtpSustainabilityImage;
  };
};

export const GTP_SUSTAINABILITY_DEFAULTS: GtpSustainabilityPageResolved = {
  title: "Our Sustainable Commitment",
  seoDescription:
    "How the Global Tipping Points Conference 2026 is reducing its footprint: seed paper lanyards, plant based meals, travel carbon tracking and a sensory station built from repurposed materials.",
  heroImage: {
    src: "/images/gtp/conference/river.webp",
    alt: "A river running through tropical forest",
  },
  introLead:
    "The Global Tipping Points Conference 2026 brings together researchers, policymakers and practitioners to understand planetary tipping points. We believe the way we gather should reflect that same commitment to a healthier, more sustainable planet.",
  introBody: [
    "From what we serve to what we use and how we travel, we are taking practical steps to reduce the environmental footprint of the conference while creating opportunities for participants to make more sustainable choices.",
  ],
  commitmentsTitle: "Our commitments",
  commitments: [
    {
      id: "materials",
      category: "Sustainable Materials",
      headline: "Lanyards with a life beyond the conference",
      body: "Our rPET lanyards feature seed paper tags, giving conference materials a second life beyond the event. Participants can take the tags home and plant them, turning a conference keepsake into something that can grow.",
      image: {
        src: "/images/gtp/conference/leaves.webp",
        alt: "Green leaves in soft light",
      },
    },
    {
      id: "meals",
      category: "Plant Based Meals",
      headline: "Rethinking what's on the plate",
      body: "Our catering puts plant-based meals at the centre of the menu, helping reduce reliance on red meat while showcasing delicious, sustainable food choices.",
      image: {
        src: "/images/gtp/gtp-2025/networking.avif",
        alt: "Delegates sharing a meal and conversation",
      },
    },
    {
      id: "travel",
      category: "Travel & Carbon",
      headline: "Understanding our travel footprint",
      body: "Getting thousands of people to one place comes with an environmental footprint. We are tracking the estimated carbon emissions associated with travel to and from the conference to better understand where our biggest impacts come from.",
      image: {
        src: "/images/gtp/conference/flags.webp",
        alt: "Flags of the countries represented at the conference",
      },
    },
    {
      id: "sensory",
      category: "Sensory Experience, Reimagined",
      headline: "Making use of what's already here",
      body: "Our sensorial station is thoughtfully designed using recycled and repurposed materials, giving existing resources a new purpose while creating an engaging experience for our attendees.",
      image: {
        src: "/images/gtp/gtp-2025/games-on-lawn.avif",
        alt: "Attendees enjoying an outdoor activity on the lawn",
      },
      link: {
        label: "Visit the Sensorial Station",
        href: "/events/gtp-2026/programmes/sensorial-station",
      },
    },
    {
      id: "beyond",
      category: "Beyond The Conference",
      headline: "Take the commitments home",
      body: "Sustainability does not end when the conference does. We hope the ideas, connections and actions sparked here continue beyond these four walls, and into the communities, institutions and systems we are all part of.",
      image: {
        src: "/images/gtp/conference/solar.webp",
        alt: "Solar panels under a clear sky",
      },
    },
  ],
  teaser: {
    enabled: true,
    title: "Our Sustainable Commitment",
    body: "Five practical steps to lighten the conference's footprint, from seed paper lanyards to plant based menus.",
    image: {
      src: "/images/gtp/conference/leaves.webp",
      alt: "Green leaves in soft light",
    },
  },
};
