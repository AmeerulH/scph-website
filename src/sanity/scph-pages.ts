import { client } from "./client";
import type { SectionBlock } from "./section-block-types";
import type {
  ScphAboutPageBandsCms,
  ScphNetworkPageBandsCms,
  ScphResearchPageBandsCms,
} from "./scph-page-bands-merge";
import type { ScphMediaPageCms } from "./scph-media-page-merge";

export type ScphSectionsOnlyData = {
  sections: SectionBlock[] | null;
};

export type ScphAboutPageData = ScphAboutPageBandsCms;

export type ScphResearchPageData = ScphResearchPageBandsCms;

export type ScphNetworkPageData = ScphNetworkPageBandsCms;

export type ScphMediaPageData = ScphMediaPageCms;

export type ScphMeetTheTeamPageData = {
  sectionTitle: string | null;
  sectionSubtitle: string | null;
  introBlurb: string | null;
  showGetInvolvedCta: boolean | null;
};

export type ScphEventsPageData = {
  pageTitle: string | null;
  pageSubtitle: string | null;
  sections: SectionBlock[] | null;
};

/** Programmes / projects: placeholder fields + sections (Stage 4). */
export type ScphPlaceholderOrSectionsPageData = {
  pageTitle: string | null;
  placeholderDescription: string | null;
  sections: SectionBlock[] | null;
};

const aboutBandsProjection = `{
  foundation {
    eyebrow,
    heading,
    body,
    image1 {
      alt,
      caption,
      "assetUrl": asset->url
    },
    image2 {
      alt,
      caption,
      "assetUrl": asset->url
    }
  },
  strategy {
    sectionSubtitle,
    sectionTitle,
    introBody,
    cards[] {
      _key,
      iconKey,
      title,
      description,
      href
    }
  },
  journey {
    sectionSubtitle,
    sectionTitle,
    placeholderTitle,
    placeholderBody
  },
  sections
}`;

const researchBandsProjection = `{
  statsRow {
    _type,
    enabled,
    variant,
    items[] {
      _key,
      _type,
      value,
      label
    }
  },
  roadmapBlock {
    _type,
    enabled,
    title,
    subtitle,
    body,
    background,
    constrainProse,
    actionsInsideProse,
    ctas[] {
      _key,
      _type,
      label,
      href,
      openInNewTab,
      style
    }
  },
  pillarsSectionSubtitle,
  pillarsSectionTitle,
  pillars[] {
    _key,
    iconKey,
    num,
    title,
    description
  },
  sections
}`;

const networkBandsProjection = `{
  community {
    copyEyebrow,
    copyTitle,
    copyBody,
    benefitsEyebrow,
    benefitsTitle,
    benefitItems
  },
  sections
}`;

const mediaPageProjection = `{
  heroEyebrow,
  heroTitle,
  heroLede,
  articlesSectionTitle,
  articlesSectionSubtitle,
  viewAllArticlesUrl,
  viewAllArticlesLabel,
  readArticleLabel,
  articlesIntroNote,
  articles[] {
    _key,
    title,
    tag,
    href,
    body
  },
  sections
}`;

const sectionsProjection = `sections`;

async function fetchSectionsPage(
  type: string,
): Promise<ScphSectionsOnlyData | null> {
  return client.fetch<ScphSectionsOnlyData | null>(
    `*[_type == $type][0]{ ${sectionsProjection} }`,
    { type },
  );
}

export async function getScphAboutPage(): Promise<ScphAboutPageData | null> {
  return client.fetch<ScphAboutPageData | null>(
    `*[_type == "scphAboutPage"][0] ${aboutBandsProjection}`,
  );
}

export async function getScphResearchPage(): Promise<ScphResearchPageData | null> {
  return client.fetch<ScphResearchPageData | null>(
    `*[_type == "scphResearchPage"][0] ${researchBandsProjection}`,
  );
}

export async function getScphMediaPage(): Promise<ScphMediaPageData | null> {
  return client.fetch<ScphMediaPageData | null>(
    `*[_type == "scphMediaPage"][0] ${mediaPageProjection}`,
  );
}

export async function getScphNetworkPage(): Promise<ScphNetworkPageData | null> {
  return client.fetch<ScphNetworkPageData | null>(
    `*[_type == "scphNetworkPage"][0] ${networkBandsProjection}`,
  );
}

export async function getScphEventsPage(): Promise<ScphEventsPageData | null> {
  return client.fetch<ScphEventsPageData | null>(
    `*[_type == "scphEventsPage"][0]{
      pageTitle,
      pageSubtitle,
      sections
    }`,
  );
}

export async function getScphMeetTheTeamPage(): Promise<ScphMeetTheTeamPageData | null> {
  return client.fetch<ScphMeetTheTeamPageData | null>(
    `*[_type == "scphMeetTheTeamPage"][0]{
      sectionTitle,
      sectionSubtitle,
      introBlurb,
      showGetInvolvedCta
    }`,
  );
}

const programmesProjectsProjection = `pageTitle, placeholderDescription, sections`;

export async function getScphProgrammesPage(): Promise<ScphPlaceholderOrSectionsPageData | null> {
  return client.fetch<ScphPlaceholderOrSectionsPageData | null>(
    `*[_type == "scphProgrammesPage"][0]{ ${programmesProjectsProjection} }`,
  );
}

export async function getScphProjectsPage(): Promise<ScphPlaceholderOrSectionsPageData | null> {
  return client.fetch<ScphPlaceholderOrSectionsPageData | null>(
    `*[_type == "scphProjectsPage"][0]{ ${programmesProjectsProjection} }`,
  );
}
