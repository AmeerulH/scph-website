"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { GtpSustainabilityCommitment } from "@/data/gtp-sustainability-page-defaults";
import { cn } from "@/lib/utils";

type Props = {
  title: string;
  commitments: GtpSustainabilityCommitment[];
  headingId?: string;
};

/**
 * Sanity `text` bodies. A blank line starts a new paragraph. Hard wraps inside a
 * paragraph are joined. `<p>` and `<br>` are treated as breaks so they are not printed.
 */
export function plainTextParagraphs(body: string): string[] {
  const normalised = body
    .replace(/\r\n/g, "\n")
    .replace(/<br\s*\/?>/gi, "\n\n")
    .replace(/<\/p>\s*<p\b[^>]*>/gi, "\n\n")
    .replace(/<\/?p\b[^>]*>/gi, "\n\n");

  return normalised
    .split(/\n\s*\n/)
    .map((part) => part.replace(/&nbsp;/gi, " ").replace(/\s+/g, " ").trim())
    .filter(Boolean);
}

function CommitmentBody({ body }: { body: string }) {
  const paragraphs = plainTextParagraphs(body);
  if (paragraphs.length === 0) return null;

  return (
    <div className="max-w-[65ch] space-y-4 text-base leading-relaxed text-gtp-dark-teal-dark/80 sm:text-lg">
      {paragraphs.map((paragraph, index) => (
        <p key={index}>{paragraph}</p>
      ))}
    </div>
  );
}

function CommitmentLink({ link }: { link: NonNullable<GtpSustainabilityCommitment["link"]> }) {
  const external = link.href.startsWith("http");
  const cls =
    "mt-6 inline-flex items-center gap-2 border-b-2 border-gtp-green pb-0.5 text-sm font-semibold text-gtp-dark-teal transition-colors hover:text-gtp-dark-green";
  const inner = (
    <>
      {link.label}
      <ArrowRight className="size-4" aria-hidden />
    </>
  );
  return external ? (
    <a href={link.href} target="_blank" rel="noopener noreferrer" className={cls}>
      {inner}
      <span className="sr-only">(opens in a new tab)</span>
    </a>
  ) : (
    <Link href={link.href} className={cls}>
      {inner}
    </Link>
  );
}

function CommitmentVisual({
  image,
  alt,
  sizes,
}: {
  image: GtpSustainabilityCommitment["image"];
  alt: string;
  sizes: string;
}) {
  if (!image.src) return null;
  return (
    <Image src={image.src} alt={alt} fill sizes={sizes} className="object-cover" />
  );
}

/** Editorial index: rows on the left, a sticky image that crossfades on the right (lg+). */
export function CommitmentsIndex({
  title,
  commitments,
  headingId = "commitments-heading",
}: Props) {
  const [active, setActive] = React.useState(0);
  const refs = React.useRef<(HTMLElement | null)[]>([]);

  React.useEffect(() => {
    const els = refs.current.filter((el): el is HTMLElement => Boolean(el));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.index));
        });
      },
      { rootMargin: "-40% 0px -50% 0px" },
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [commitments.length]);

  return (
    <section
      aria-labelledby={headingId}
      className="bg-gtp-paper px-4 pb-24 pt-16 sm:px-6 lg:px-8 lg:pb-32 lg:pt-24"
    >
      <div className="mx-auto max-w-7xl">
        <h2
          id={headingId}
          className="font-heading text-4xl font-bold leading-none tracking-tight text-gtp-dark-teal sm:text-5xl"
        >
          {title}
        </h2>

        <div className="mt-10 grid gap-12 lg:grid-cols-12 lg:gap-16">
          <ol className="lg:col-span-7">
            {commitments.map((c, i) => (
              <li
                key={c.id}
                ref={(el) => {
                  refs.current[i] = el;
                }}
                data-index={i}
                className={cn(
                  "border-t border-gtp-dark-teal/20 py-12 transition-opacity duration-500 ease-out lg:min-h-[78vh] lg:py-20",
                  i !== active && "lg:opacity-40",
                )}
              >
                <div className="flex items-start gap-6 sm:gap-10">
                  <span
                    aria-hidden
                    className="font-heading text-6xl font-bold leading-none tabular-nums text-gtp-teal sm:text-8xl"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0 pt-1 sm:pt-3">
                    {c.category ? (
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gtp-dark-green">
                        {c.category}
                      </p>
                    ) : null}
                    <h3 className="mt-3 font-heading text-4xl font-bold leading-[1.05] text-gtp-dark-teal sm:text-5xl lg:text-6xl">
                      {c.headline}
                    </h3>
                  </div>
                </div>

                <div className="mt-8 sm:pl-[calc(6rem+2.5rem)] lg:pl-[calc(6rem+2.5rem)]">
                  {c.image.src ? (
                    <div className="relative mb-8 aspect-4/3 overflow-hidden rounded-2xl bg-gtp-dark-teal/10 lg:hidden">
                      <CommitmentVisual
                        image={c.image}
                        alt={c.image.alt}
                        sizes="(max-width: 640px) 100vw, 640px"
                      />
                    </div>
                  ) : null}
                  {c.body ? <CommitmentBody body={c.body} /> : null}
                  {c.stat ? (
                    <p className="mt-8 flex items-baseline gap-3">
                      <span className="font-heading text-5xl font-bold text-gtp-dark-green">
                        {c.stat.value}
                      </span>
                      <span className="text-sm text-slate-600">{c.stat.label}</span>
                    </p>
                  ) : null}
                  {c.link ? <CommitmentLink link={c.link} /> : null}
                </div>
              </li>
            ))}
          </ol>

          <div aria-hidden className="relative hidden lg:col-span-5 lg:block">
            <div className="sticky top-28 h-[calc(100vh-9rem)] max-h-[44rem]">
              <div className="relative size-full overflow-hidden rounded-3xl bg-gtp-dark-teal">
                {commitments.map((c, i) => (
                  <div
                    key={c.id}
                    className={cn(
                      "absolute inset-0 transition-opacity duration-700 ease-out",
                      i === active ? "opacity-100" : "opacity-0",
                    )}
                  >
                    <CommitmentVisual image={c.image} alt="" sizes="40vw" />
                  </div>
                ))}
                <span className="absolute bottom-5 left-5 rounded-full bg-gtp-dark-teal-dark/80 px-4 py-1.5 font-heading text-sm font-semibold tabular-nums text-white backdrop-blur-sm">
                  {String(active + 1).padStart(2, "0")} / {String(commitments.length).padStart(2, "0")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
