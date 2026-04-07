import { footerSocialIconSrc } from "@/lib/footer-social-icons";
import type {
  FooterLinkColumnResolved,
  FooterNavLinkResolved,
  FooterSocialResolved,
  ScphFooterResolved,
} from "@/sanity/footer-types";

export const SCPH_FOOTER_LOGO_DEFAULT = {
  src: "/images/scph/logo-mixcolor.png",
  alt: "Sunway Centre for Planetary Health",
  width: 180,
  height: 60,
} as const;

export const SCPH_FOOTER_BOTTOM_LOGO_DEFAULT = {
  src: "/images/gtp/logos/sunway-uni-white.png",
  alt: "Sunway University",
  width: 360,
  height: 120,
} as const;

export const scphFooterDefaultTagline =
  "Sunway Centre for Planetary Health is a \"Think-and-Do\" tank, committed to research and advocacy that advances planetary health through three priority areas: healthy cities, health-centred decarbonisation, and driving an education revolution.";

export const scphFooterDefaultSocialLinks: FooterSocialResolved[] = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/SunwayCPH",
    iconSrc: footerSocialIconSrc("fb"),
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/sunwaycph/",
    iconSrc: footerSocialIconSrc("ig"),
  },
  {
    label: "LinkedIn",
    href: "https://my.linkedin.com/showcase/sunway-centre-for-planetary-health/",
    iconSrc: footerSocialIconSrc("li"),
  },
  {
    label: "TikTok",
    href: "https://www.tiktok.com/@sunwaycph?is_from_webapp=1&sender_device=pc",
    iconSrc: footerSocialIconSrc("tt"),
  },
  {
    label: "X / Twitter",
    href: "https://x.com/SunwayCPH",
    iconSrc: footerSocialIconSrc("x"),
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/@sunwaycentreforplanetaryhe8898",
    iconSrc: footerSocialIconSrc("yt"),
  },
];

export const scphFooterDefaultColumnQuick: FooterLinkColumnResolved = {
  title: "Quick Links",
  links: [
    { label: "About Us", href: "/about-us", openInNewTab: false },
    { label: "Programmes", href: "/programmes", openInNewTab: false },
    { label: "Research", href: "/research", openInNewTab: false },
    { label: "Media", href: "/media", openInNewTab: false },
  ],
};

export const scphFooterDefaultColumnCommunity: FooterLinkColumnResolved = {
  title: "Community",
  links: [
    { label: "Media Professional Network", href: "/network", openInNewTab: false },
    { label: "Youth Action Network", href: "/network", openInNewTab: false },
  ],
};

export const scphFooterDefaultColumnConferences: FooterLinkColumnResolved = {
  title: "Conferences",
  links: [
    { label: "GTP 2026", href: "/events/gtp-2026/about", openInNewTab: false },
    { label: "PHAM 2024", href: "https://www.pham2024.com/", openInNewTab: true },
  ],
};

export const scphFooterDefaults: ScphFooterResolved = {
  tagline: scphFooterDefaultTagline,
  logo: { ...SCPH_FOOTER_LOGO_DEFAULT },
  bottomLogo: { ...SCPH_FOOTER_BOTTOM_LOGO_DEFAULT },
  socialLinks: scphFooterDefaultSocialLinks,
  columnQuick: scphFooterDefaultColumnQuick,
  columnCommunity: scphFooterDefaultColumnCommunity,
  columnConferences: scphFooterDefaultColumnConferences,
  contactEmail: "scph@sunway.edu.my",
  address:
    "Sunway University, 5, Jalan Universiti,\nBandar Sunway, 47500,\nPetaling Jaya, Selangor, Malaysia",
  phoneDisplay: "03 – 7491 8622",
  phoneTel: "+60374918622",
  careerEmail: "scphcareer@sunway.edu.my",
  copyrightLine: "© 2026 Sunway Centre for Planetary Health. All rights reserved.",
  partOfLabel: "Part of",
};
