import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, CalendarDays, ExternalLink, FileText } from "lucide-react";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DownloadButton } from "@/components/mpn/resources/download-button";
import { getAuthenticatedMpnProfile } from "@/lib/mpn/auth";
import { getMpnResource, getResourceWorkshop } from "@/lib/mpn/resources";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const resource = await getMpnResource(id);
  return {
    title: resource
      ? `${resource.title} | Media Professional Network`
      : "Resource | Media Professional Network",
  };
}

export default async function MpnResourceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [resource, profile] = await Promise.all([
    getMpnResource(id),
    getAuthenticatedMpnProfile(),
  ]);

  if (!resource) notFound();

  const workshop = getResourceWorkshop(resource);
  const canDownload = profile !== null && profile.role !== "rejected";
  const publishedDate = resource.published_date
    ? new Intl.DateTimeFormat("en", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(new Date(`${resource.published_date}T00:00:00`))
    : null;

  return (
    <section className="mx-auto max-w-4xl px-4 pb-16 sm:px-6">
      <Link
        className="inline-flex items-center gap-2 text-sm font-semibold text-scph-blue hover:underline"
        href="/community/mpn/resources"
      >
        <ArrowLeft aria-hidden="true" size={16} />
        All resources
      </Link>

      <div className="mt-8 rounded-[10px] border border-slate-200 bg-white p-6 sm:p-8">
        <div className="flex flex-wrap gap-2">
          <Badge variant="scph">{resource.type}</Badge>
          <Badge variant="outline">{resource.theme}</Badge>
          {workshop ? (
            <Badge variant="scphGreen">Workshop {workshop.number}</Badge>
          ) : null}
        </div>
        <h1 className="mt-5 font-heading text-3xl font-bold tracking-tight text-[#0d1f3c] sm:text-4xl">
          {resource.title}
        </h1>
        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-500">
          {resource.source ? <span>{resource.source}</span> : null}
          {publishedDate ? (
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays aria-hidden="true" size={15} />
              {publishedDate}
            </span>
          ) : null}
          <span>{resource.download_count} downloads</span>
        </div>

        {resource.description ? (
          <p className="mt-7 max-w-3xl whitespace-pre-line leading-7 text-slate-700">
            {resource.description}
          </p>
        ) : null}

        {resource.tags?.length ? (
          <div className="mt-7 flex flex-wrap gap-2">
            {resource.tags.map((tag) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
        ) : null}

        <div className="mt-8 flex flex-wrap gap-3 border-t border-slate-200 pt-6">
          {canDownload ? (
            <DownloadButton resourceId={resource.id} />
          ) : (
            <Button asChild variant="scph">
              <Link href={`/community/mpn/login?next=/community/mpn/resources/${resource.id}`}>
                <FileText aria-hidden="true" />
                Sign in to download
              </Link>
            </Button>
          )}
          {resource.article_url ? (
            <Button asChild variant="scphOutline">
              <a href={resource.article_url} rel="noreferrer" target="_blank">
                View article
                <ExternalLink aria-hidden="true" />
              </a>
            </Button>
          ) : null}
        </div>
      </div>
    </section>
  );
}
