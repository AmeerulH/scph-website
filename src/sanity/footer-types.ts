export type FooterNavLinkResolved = {
  label: string;
  href: string;
  openInNewTab: boolean;
};

export type FooterLinkColumnResolved = {
  title: string;
  links: FooterNavLinkResolved[];
};

export type FooterSocialResolved = {
  label: string;
  href: string;
  iconSrc: string;
};

export type ScphFooterResolved = {
  tagline: string;
  logo: { src: string; alt: string; width?: number; height?: number };
  bottomLogo: { src: string; alt: string; width?: number; height?: number };
  socialLinks: FooterSocialResolved[];
  columnQuick: FooterLinkColumnResolved;
  columnCommunity: FooterLinkColumnResolved;
  columnConferences: FooterLinkColumnResolved;
  contactEmail: string;
  address: string;
  phoneDisplay: string;
  phoneTel: string;
  careerEmail: string;
  copyrightLine: string;
  partOfLabel: string;
};

export type GtpFooterContactRowResolved =
  | { rowType: "email"; text: string }
  | { rowType: "sitePlain"; text: string }
  | { rowType: "externalLink"; text: string; url: string };

export type GtpFooterBannerResolved =
  | {
      source: "sanity";
      url: string;
      alt: string;
      width?: number;
      height?: number;
    }
  | {
      source: "static";
      src: string;
      alt: string;
      width: number;
      height: number;
    };

export type GtpFooterResolved = {
  banner: GtpFooterBannerResolved;
  quickLinks: FooterNavLinkResolved[];
  contactRows: GtpFooterContactRowResolved[];
  socialLinks: FooterSocialResolved[];
  copyrightLine: string;
  hostedByPrefix: string;
  hostedByLabel: string;
  hostedByUrl: string;
};
