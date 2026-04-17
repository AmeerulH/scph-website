import { client } from "./client";

/** One workshop row from `scphJournalistWorkshopsPage.workshops`. */
export type ScphJournalistWorkshopRowCms = {
  _key?: string;
  title: string | null;
  slug: { current?: string } | null;
  accessCode: string | null;
  driveFolderId: string | null;
  enabled: boolean | null;
  sortOrder: number | null;
};

export type ScphJournalistWorkshopsPageData = {
  internalTitle: string | null;
  pageTitle: string | null;
  intro: string | null;
  workshops: ScphJournalistWorkshopRowCms[] | null;
};

const journalistWorkshopsProjection = `{
  internalTitle,
  pageTitle,
  intro,
  workshops[]{
    _key,
    title,
    slug,
    accessCode,
    driveFolderId,
    enabled,
    sortOrder
  }
}`;

export async function getScphJournalistWorkshopsPage(): Promise<ScphJournalistWorkshopsPageData | null> {
  return client.fetch<ScphJournalistWorkshopsPageData | null>(
    `*[_type == "scphJournalistWorkshopsPage"][0] ${journalistWorkshopsProjection}`,
  );
}
