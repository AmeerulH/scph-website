import type { Metadata } from "next";
import Image from "next/image";
import { CommitmentsIndex } from "@/components/gtp/sustainability/commitments-index";
import { GTP_SUSTAINABILITY_PATH } from "@/data/gtp-sustainability-page-defaults";
import { getGtpSustainabilityPage } from "@/sanity/gtp-sustainability-page";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getGtpSustainabilityPage();
  return {
    title: "Sustainable Commitment",
    description: page.seoDescription,
    alternates: { canonical: GTP_SUSTAINABILITY_PATH },
    openGraph: {
      title: `${page.title} | GTP 2026`,
      description: page.seoDescription,
      url: GTP_SUSTAINABILITY_PATH,
    },
    twitter: {
      card: "summary_large_image",
      title: `${page.title} | GTP 2026`,
      description: page.seoDescription,
    },
  };
}

export default async function GtpSustainabilityPage() {
  const page = await getGtpSustainabilityPage();

  return (
    <div className="bg-gtp-paper">
      <header className="relative isolate overflow-hidden bg-gtp-dark-teal-dark">
        <Image
          src={page.heroImage.src}
          alt=""
          fill
          priority
          fetchPriority="high"
          sizes="100vw"
          className="object-cover object-center"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-linear-to-b from-gtp-dark-teal-dark/75 via-gtp-dark-teal/70 to-gtp-dark-teal-dark/90"
        />
        <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-44 sm:px-6 lg:px-8 lg:pb-28 lg:pt-56">
          <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em] text-gtp-green-light">
            <span aria-hidden className="h-px w-10 bg-gtp-green-light" />
            GTP 2026
          </p>
          <h1 className="mt-6 max-w-5xl font-heading text-[clamp(2.75rem,8vw,6.5rem)] font-bold leading-[0.98] tracking-tight text-white">
            {page.title}
          </h1>
        </div>
      </header>

      <section
        aria-label="Introduction"
        className="px-4 py-20 sm:px-6 lg:px-8 lg:py-28"
      >
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-12 lg:gap-16">
          <p className="font-heading text-2xl font-semibold leading-snug text-gtp-dark-teal md:text-3xl lg:col-span-7 lg:text-4xl lg:leading-snug">
            {page.introLead}
          </p>
          <div className="space-y-5 text-base leading-relaxed text-slate-700 lg:col-span-5 lg:pt-3 lg:text-lg">
            {page.introBody.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </div>
      </section>

      <CommitmentsIndex title={page.commitmentsTitle} commitments={page.commitments} />
    </div>
  );
}
