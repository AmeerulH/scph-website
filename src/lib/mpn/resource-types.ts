export type MpnWorkshop = {
  id: string;
  number: number;
  title: string;
  location: string | null;
};

export type MpnResource = {
  id: string;
  title: string;
  description: string | null;
  type: string;
  theme: string;
  source: string | null;
  published_date: string | null;
  article_url: string | null;
  visibility: "members" | "workshop_alumni" | "admins";
  workshop_id: string | null;
  download_count: number;
  tags: string[] | null;
  workshops: MpnWorkshop | MpnWorkshop[] | null;
};

export function getResourceWorkshop(
  resource: MpnResource
): MpnWorkshop | null {
  return Array.isArray(resource.workshops)
    ? resource.workshops[0] ?? null
    : resource.workshops;
}
