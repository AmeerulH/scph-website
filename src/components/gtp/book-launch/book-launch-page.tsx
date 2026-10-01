import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type {
  GtpBookLaunchImage,
  GtpBookLaunchResolved,
} from "@/data/gtp-book-launch-page-defaults";

/*
 * Surfaces: deep teal (drenched), one warm ivory band for the long read.
 * Warm light comes from a single ember glow, never from new brand colours.
 */
const IVORY_TEXT = "text-[oklch(0.96_0.014_90)]";
const IVORY_BG = "bg-[oklch(0.965_0.014_90)]";
const EMBER_LABEL = "text-[oklch(0.82_0.12_65)]";
const EMBER_GLOW =
  "bg-[radial-gradient(closest-side,oklch(0.62_0.15_55/0.34),transparent)]";

function Label({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p
      className={`flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em] ${className ?? ""}`}
    >
      <span aria-hidden className="h-px w-10 bg-current opacity-70" />
      {children}
    </p>
  );
}

function paragraphsOf(text: string) {
  return text.split(/\n\s*\n/).filter(Boolean);
}

function LaunchRegistration({
  registration,
}: {
  registration: GtpBookLaunchResolved["registration"];
}) {
  if (registration.closed) {
    return (
      <span className="inline-flex min-h-13 items-center rounded-full border border-white/25 px-7 text-base font-semibold text-white/85">
        Registration closed
      </span>
    );
  }
  if (!registration.url) {
    return (
      <Button
        type="button"
        size="lg"
        disabled
        className="bg-white/12 text-white/75 shadow-none disabled:opacity-100"
      >
        {registration.pendingLabel}
      </Button>
    );
  }
  return (
    <Button variant="gtpCta" size="lg" asChild>
      <a href={registration.url} target="_blank" rel="noopener noreferrer">
        {registration.label}
        <ArrowUpRight />
      </a>
    </Button>
  );
}

/** The cover as supplied, uncropped. Without one, a designed stand-in carries the title. */
function Cover({ page }: { page: GtpBookLaunchResolved }) {
  const { cover } = page;
  const shadow = "shadow-[0_44px_90px_-24px_oklch(0.1_0.03_220/0.8)]";

  if (cover?.width && cover.height) {
    return (
      <Image
        src={cover.src}
        alt={cover.alt}
        width={cover.width}
        height={cover.height}
        priority
        sizes="(max-width: 1024px) 80vw, 440px"
        className={`h-auto w-full ${shadow}`}
      />
    );
  }
  if (cover) {
    return (
      <div className={`relative aspect-2/3 w-full ${shadow}`}>
        <Image
          src={cover.src}
          alt={cover.alt}
          fill
          priority
          sizes="(max-width: 1024px) 80vw, 440px"
          className="object-contain"
        />
      </div>
    );
  }
  return (
    <div
      aria-hidden
      className={`flex aspect-2/3 w-full flex-col justify-between border border-white/15 bg-linear-to-b from-gtp-dark-teal-light to-gtp-dark-teal p-8 sm:p-10 ${shadow}`}
    >
      <p className={`text-[11px] font-semibold uppercase tracking-[0.24em] ${EMBER_LABEL}`}>
        GTP 2026
      </p>
      <div>
        <div className="h-px w-14 bg-gtp-orange-light" />
        <p className={`mt-6 font-heading text-3xl font-bold leading-tight sm:text-4xl ${IVORY_TEXT}`}>
          {page.bookTitle || page.pageTitle}
        </p>
        <p className="mt-4 text-sm font-medium uppercase tracking-[0.18em] text-white/65">
          {page.authorName}
        </p>
      </div>
    </div>
  );
}

function Detail({ label, value, fallback }: { label: string; value: string; fallback: string }) {
  return (
    <div>
      <dt className={`text-[11px] font-semibold uppercase tracking-[0.2em] ${EMBER_LABEL}`}>
        {label}
      </dt>
      <dd
        className={`mt-1.5 font-heading text-lg leading-snug ${
          value ? `font-semibold ${IVORY_TEXT}` : "font-normal text-white/60"
        }`}
      >
        {value || fallback}
      </dd>
    </div>
  );
}

function Hero({ page }: { page: GtpBookLaunchResolved }) {
  const hasTitle = Boolean(page.bookTitle);
  return (
    <header className="relative isolate overflow-hidden bg-gtp-dark-teal-dark">
      <Image
        src={page.heroImage.src}
        alt={page.heroImage.alt}
        fill
        priority
        fetchPriority="high"
        sizes="100vw"
        quality={50}
        className="object-cover object-center"
      />
      <div aria-hidden className="absolute inset-0 bg-gtp-dark-teal-dark/88" />
      <div
        aria-hidden
        className={`absolute -right-[12%] top-[8%] -z-0 size-[56rem] max-w-none rounded-full ${EMBER_GLOW}`}
      />

      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-4 pb-20 pt-40 sm:px-6 lg:grid-cols-12 lg:gap-12 lg:px-8 lg:pb-28 lg:pt-52">
        <div className="lg:col-span-7">
          <Label className={EMBER_LABEL}>
            {hasTitle ? page.pageTitle : "GTP 2026"}
          </Label>
          <h1
            className={`mt-6 font-heading text-[clamp(2.75rem,7vw,6rem)] font-bold leading-[0.98] tracking-tight text-balance ${IVORY_TEXT}`}
          >
            {page.bookTitle || page.pageTitle}
          </h1>
          {page.bookSubtitle ? (
            <p className="mt-5 max-w-[34ch] font-heading text-xl font-medium leading-snug text-white/80 sm:text-2xl">
              {page.bookSubtitle}
            </p>
          ) : null}
          <p className="mt-6 text-base text-white/70 sm:text-lg">
            {hasTitle ? "By" : "With"}{" "}
            <span className={`font-semibold ${IVORY_TEXT}`}>{page.authorName}</span>
          </p>

          <dl className="mt-10 grid max-w-2xl gap-x-10 gap-y-6 border-t border-white/15 pt-7 sm:grid-cols-3">
            <Detail label="Date" value={page.dateLabel} fallback="To be announced" />
            <Detail label="Time" value={page.time} fallback="To be announced" />
            <Detail label="Venue" value={page.venue} fallback="To be announced" />
          </dl>
          {page.detailsNote ? (
            <p className="mt-5 max-w-[60ch] text-sm leading-relaxed text-white/65">
              {page.detailsNote}
            </p>
          ) : null}

          <div className="mt-10">
            <LaunchRegistration registration={page.registration} />
          </div>
        </div>

        <div className="mx-auto w-full max-w-72 sm:max-w-sm lg:col-span-5 lg:max-w-md lg:justify-self-end">
          <Cover page={page} />
        </div>
      </div>
    </header>
  );
}

function AboutTheBook({ page }: { page: GtpBookLaunchResolved }) {
  return (
    <section
      aria-labelledby="book-launch-about"
      className={`${IVORY_BG} px-4 py-20 sm:px-6 lg:px-8 lg:py-28`}
    >
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-12 lg:gap-16">
        <h2 id="book-launch-about" className="lg:col-span-4">
          <Label className="text-gtp-orange-dark">About the book</Label>
        </h2>
        <div className="lg:col-span-8">
          <p className="font-heading text-2xl font-semibold leading-snug text-gtp-dark-teal-dark md:text-3xl lg:text-4xl lg:leading-snug">
            {page.introLead}
          </p>
          <div className="mt-8 max-w-[65ch] space-y-5 text-base leading-relaxed text-slate-700 lg:text-lg">
            {page.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          {page.pullQuote ? (
            <figure className="mt-14 border-t border-gtp-dark-teal-dark/15 pt-10">
              <span
                aria-hidden
                className="block font-heading text-7xl font-bold leading-none text-gtp-orange"
              >
                &ldquo;
              </span>
              <blockquote className="-mt-3 max-w-[28ch] font-heading text-3xl font-semibold leading-snug text-gtp-dark-teal-dark sm:text-4xl">
                {page.pullQuote}
              </blockquote>
              {page.pullQuoteAttribution ? (
                <figcaption className="mt-5 text-sm font-semibold uppercase tracking-[0.18em] text-slate-600">
                  {page.pullQuoteAttribution}
                </figcaption>
              ) : null}
            </figure>
          ) : null}
        </div>
      </div>
    </section>
  );
}

function AuthorPhoto({ photo }: { photo: GtpBookLaunchImage }) {
  return (
    <div className="relative aspect-4/5 w-full overflow-hidden bg-gtp-dark-teal-dark">
      <Image
        src={photo.src}
        alt={photo.alt}
        fill
        sizes="(max-width: 1024px) 90vw, 480px"
        className="object-cover"
      />
    </div>
  );
}

function Author({ page }: { page: GtpBookLaunchResolved }) {
  const { author } = page;
  if (!author.photo && author.bio.length === 0) return null;

  return (
    <section
      aria-labelledby="book-launch-author"
      className="bg-gtp-dark-teal px-4 py-20 sm:px-6 lg:px-8 lg:py-28"
    >
      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-12 lg:gap-16">
        {author.photo ? (
          <div className="mx-auto w-full max-w-sm lg:col-span-5 lg:max-w-none">
            <AuthorPhoto photo={author.photo} />
          </div>
        ) : null}
        <div className={author.photo ? "lg:col-span-7" : "lg:col-span-8 lg:col-start-3"}>
          <Label className={EMBER_LABEL}>{author.role}</Label>
          <h2
            id="book-launch-author"
            className={`mt-5 font-heading text-[clamp(2.25rem,5vw,4rem)] font-bold leading-tight ${IVORY_TEXT}`}
          >
            {page.authorName}
          </h2>
          <div className="mt-8 max-w-[62ch] space-y-5 text-base leading-relaxed text-white/80 lg:text-lg">
            {author.bio.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Closing({ page }: { page: GtpBookLaunchResolved }) {
  const { thanks } = page;
  return (
    <section
      aria-label={thanks.enabled ? thanks.title : "Register"}
      className="relative isolate overflow-hidden bg-gtp-dark-teal-dark px-4 py-24 sm:px-6 lg:px-8 lg:py-32"
    >
      <div
        aria-hidden
        className={`absolute -bottom-1/2 -left-[10%] size-[48rem] max-w-none rounded-full ${EMBER_GLOW}`}
      />
      <div className="relative mx-auto grid max-w-7xl items-end gap-12 lg:grid-cols-12">
        {thanks.enabled ? (
          <div className="lg:col-span-8">
            <Label className={EMBER_LABEL}>With thanks</Label>
            <h2
              className={`mt-5 font-heading text-[clamp(2rem,5vw,4rem)] font-bold leading-tight text-balance ${IVORY_TEXT}`}
            >
              {thanks.title}
            </h2>
            {thanks.body ? (
              <p className="mt-6 max-w-[58ch] text-lg leading-relaxed text-white/75">
                {paragraphsOf(thanks.body).join(" ")}
              </p>
            ) : null}
          </div>
        ) : null}
        <div
          className={`flex flex-col items-start gap-5 ${
            thanks.enabled ? "lg:col-span-4 lg:items-end" : "lg:col-span-12"
          }`}
        >
          <LaunchRegistration registration={page.registration} />
          <Link
            href="/events/gtp-2026/programmes"
            className="text-sm font-semibold text-white/75 underline-offset-4 transition-colors hover:text-white hover:underline focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-gtp-teal"
          >
            Back to the conference programme
          </Link>
        </div>
      </div>
    </section>
  );
}

export function BookLaunchPage({ page }: { page: GtpBookLaunchResolved }) {
  return (
    <>
      <Hero page={page} />
      <AboutTheBook page={page} />
      <Author page={page} />
      <Closing page={page} />
    </>
  );
}
