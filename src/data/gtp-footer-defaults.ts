import { footerSocialIconSrc } from "@/lib/footer-social-icons";
import type {
  FooterNavLinkResolved,
  FooterSocialResolved,
  GtpFooterBannerResolved,
  GtpFooterContactRowResolved,
  GtpFooterResolved,
} from "@/sanity/footer-types";

export const GTP_FOOTER_BANNER_STATIC: Extract<
  GtpFooterBannerResolved,
  { source: "static" }
> = {
  source: "static",
  src: "/images/gtp/footer-partner-logos.svg",
  alt: "Global Tipping Points Conference 2026 — hosts and partners",
  width: 1901,
  height: 101,
};

export const gtpFooterDefaultQuickLinks: FooterNavLinkResolved[] = [
  { label: "About", href: "/events/gtp-2026/about", openInNewTab: false },
  {
    label: "Organising Committee",
    href: "/events/gtp-2026/organising-committee",
    openInNewTab: false,
  },
  { label: "Programme", href: "/events/gtp-2026/programmes", openInNewTab: false },
  { label: "FAQ", href: "/events/gtp-2026/faq", openInNewTab: false },
  { label: "Get Involved", href: "/events/gtp-2026/get-involved", openInNewTab: false },
  { label: "Submissions", href: "/events/gtp-2026/submissions", openInNewTab: false },
];

export const gtpFooterDefaultContactRows: GtpFooterContactRowResolved[] = [
  { rowType: "email", text: "scph_gtpc2026@sunway.edu.my" },
  {
    rowType: "externalLink",
    text: "www.sunwayplanetaryhealth.com.my",
    url: "https://www.sunwayplanetaryhealth.com.my",
  },
  {
    rowType: "externalLink",
    text: "www.globaltippingpoints.org",
    url: "https://www.globaltippingpoints.org/",
  },
];

export const gtpFooterDefaultSocialLinks: FooterSocialResolved[] = [
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

export const gtpFooterDefaults: GtpFooterResolved = {
  banner: { ...GTP_FOOTER_BANNER_STATIC },
  quickLinks: gtpFooterDefaultQuickLinks,
  contactRows: gtpFooterDefaultContactRows,
  socialLinks: gtpFooterDefaultSocialLinks,
  copyrightLine: "© 2026 Global Tipping Points Conference. All rights reserved.",
  hostedByPrefix: "Hosted by",
  hostedByLabel: "Sunway Centre for Planetary Health",
  hostedByUrl: "https://www.sunwayplanetaryhealth.com.my",
};
