import { client } from "./client";
import type { SectionBlock } from "./section-block-types";

export type ScphSectionsOnlyData = {
  sections: SectionBlock[] | null;
};

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

const sectionsProjection = `sections`;

async function fetchSectionsPage(
  type: string,
): Promise<ScphSectionsOnlyData | null> {
  return client.fetch<ScphSectionsOnlyData | null>(
    `*[_type == $type][0]{ ${sectionsProjection} }`,
    { type },
  );
}

export async function getScphAboutPage(): Promise<ScphSectionsOnlyData | null> {
  return fetchSectionsPage("scphAboutPage");
}

export async function getScphResearchPage(): Promise<ScphSectionsOnlyData | null> {
  return fetchSectionsPage("scphResearchPage");
}

export async function getScphMediaPage(): Promise<ScphSectionsOnlyData | null> {
  return fetchSectionsPage("scphMediaPage");
}

export async function getScphNetworkPage(): Promise<ScphSectionsOnlyData | null> {
  return fetchSectionsPage("scphNetworkPage");
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
