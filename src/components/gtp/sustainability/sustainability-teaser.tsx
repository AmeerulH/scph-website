import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  GTP_SUSTAINABILITY_PATH,
  type GtpSustainabilityPageResolved,
} from "@/data/gtp-sustainability-page-defaults";

type Props = { page: GtpSustainabilityPageResolved };

/** Short band for the About (Home) page that points to the full commitment page. */
export function SustainabilityTeaser({ page }: Props) {
  const { teaser, commitments } = page;
  if (!teaser.enabled) return null;

  return (
    <section
      aria-labelledby="sustainability-teaser-heading"
      className="bg-gtp-paper px-4 py-20 sm:px-6 lg:px-8 lg:py-28"
    >
      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="relative aspect-4/3 overflow-hidden rounded-3xl lg:col-span-5">
          <Image
            src={teaser.image.src}
            alt={teaser.image.alt}
            fill
            sizes="(max-width: 1024px) 100vw, 40vw"
            className="object-cover"
          />
        </div>
        <div className="lg:col-span-7">
          <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em] text-gtp-dark-green">
            <span aria-hidden className="h-px w-10 bg-gtp-green" />
            Sustainability
          </p>
          <h2
            id="sustainability-teaser-heading"
            className="mt-4 font-heading text-3xl font-bold tracking-tight text-gtp-dark-teal md:text-5xl"
          >
            {teaser.title}
          </h2>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-700 lg:text-lg">
            {teaser.body}
          </p>
          <ol className="mt-8 max-w-xl divide-y divide-gtp-dark-teal/15 border-y border-gtp-dark-teal/15">
            {commitments.map((c, i) => (
              <li key={c.id} className="flex items-baseline gap-5 py-3">
                <span
                  aria-hidden
                  className="w-7 font-heading text-sm font-semibold tabular-nums text-gtp-teal-dark"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="font-heading text-base font-semibold text-gtp-dark-teal">
                  {c.headline}
                </span>
              </li>
            ))}
          </ol>
          <Link
            href={GTP_SUSTAINABILITY_PATH}
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-gtp-dark-teal px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-gtp-dark-teal-dark"
          >
            Read our commitments
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  );
}
