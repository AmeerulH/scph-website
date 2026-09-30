import Image from "next/image";
import type { GtpMediaPageResolved } from "@/data/gtp-media-page-defaults";
import { cn } from "@/lib/utils";

type Props = {
  hero: GtpMediaPageResolved["hero"];
  counts: { albums: number; episodes: number; videos: number };
};

function plural(n: number, one: string, many = `${one}s`) {
  return `${n} ${n === 1 ? one : many}`;
}

export function MediaHero({ hero, counts }: Props) {
  const index = [
    { n: "01", href: "#photos", label: "Photo Gallery", meta: plural(counts.albums, "album") },
    {
      n: "02",
      href: "#podcasts",
      label: "Podcasts",
      meta: counts.episodes ? plural(counts.episodes, "episode") : "Coming soon",
    },
    {
      n: "03",
      href: "#videos",
      label: "Videos",
      meta: counts.videos ? plural(counts.videos, "video") : "Coming soon",
    },
  ];

  return (
    <header className="relative isolate overflow-hidden bg-gtp-dark-teal-dark">
      <Image
        src={hero.image.src}
        alt=""
        fill
        priority
        fetchPriority="high"
        sizes="100vw"
        className="object-cover object-center"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-linear-to-b from-gtp-dark-teal-dark/70 via-gtp-dark-teal-dark/60 to-gtp-dark-teal-dark"
      />

      <div className="relative mx-auto max-w-7xl px-4 pt-40 sm:px-6 lg:px-8 lg:pt-52">
        <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em] text-gtp-teal-light">
          <span aria-hidden className="h-px w-10 bg-gtp-teal-light" />
          GTP 2026
        </p>
        <h1 className="mt-6 font-heading text-[clamp(3.25rem,11vw,8.5rem)] font-bold leading-[0.95] tracking-tight text-white">
          {hero.title}
        </h1>
        <p className="mt-8 max-w-xl text-base leading-relaxed text-white/75 md:text-lg">
          {hero.lede}
        </p>

        <nav aria-label="Media sections" className="mt-16 lg:mt-24">
          <ol className="grid border-t border-white/20 md:grid-cols-3">
            {index.map((item, i) => (
              <li
                key={item.href}
                className="border-b border-white/20 md:border-b-0 md:border-r md:last:border-r-0"
              >
                <a
                  href={item.href}
                  className={cn(
                    "group flex items-baseline gap-5 py-7 transition-colors hover:bg-white/5 md:py-8 md:pr-8 lg:pr-10",
                    i === 0 ? "md:pl-0" : "md:pl-8 lg:pl-10",
                  )}
                >
                  <span className="font-heading text-sm font-semibold tabular-nums text-gtp-teal-light">
                    {item.n}
                  </span>
                  <span className="flex flex-col">
                    <span className="font-heading text-xl font-semibold text-white md:text-2xl">
                      {item.label}
                    </span>
                    <span className="mt-1 text-sm text-white/60">{item.meta}</span>
                  </span>
                  <span
                    aria-hidden
                    className="ml-auto self-center text-white/40 transition-transform duration-300 ease-out group-hover:translate-y-1 group-hover:text-white"
                  >
                    ↓
                  </span>
                </a>
              </li>
            ))}
          </ol>
        </nav>
      </div>
    </header>
  );
}
