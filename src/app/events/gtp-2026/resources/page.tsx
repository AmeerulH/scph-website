import type { Metadata } from "next";
import { ResourcesPage } from "@/components/gtp/library/resources-page";
import { getGtpResourcesPage } from "@/sanity/gtp-resources";
import { GTP_RESOURCES_PATH } from "@/lib/gtp-library";

export const metadata: Metadata = { title: "Resources", description: "Download toolkits, declarations and reports from GTP 2026.",
  alternates: {canonical: GTP_RESOURCES_PATH}, openGraph: {title: "Resources | GTP 2026", url: GTP_RESOURCES_PATH} };
export const dynamic = "force-dynamic";

export default async function GtpResourcesPage() {
  return <ResourcesPage data={await getGtpResourcesPage()} />;
}
