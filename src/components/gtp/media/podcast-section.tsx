import Image from "next/image";
import type {
  GtpMediaPageResolved,
  GtpMediaPodcastEpisode,
} from "@/data/gtp-media-page-defaults";
import { ApplePodcastsIcon, PlayGlyph, SpotifyIcon, YouTubeIcon } from "./platform-icons";

type Props = { podcasts: GtpMediaPageResolved["podcasts"] };

const pillClass =
  "inline-flex items-center gap-2.5 rounded-full border border-white/30 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-white hover:text-gtp-dark-teal-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gtp-teal-light";

function formatDate(iso?: string) {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

function PlatformLinks({ platforms }: { platforms: Props["podcasts"]["platforms"] }) {
  const links = [
    { key: "spotify", label: "Spotify", href: platforms.spotifyUrl, Icon: SpotifyIcon },
    { key: "apple", label: "Apple Podcasts", href: platforms.appleUrl, Icon: ApplePodcastsIcon },
    { key: "youtube", label: "YouTube", href: platforms.youtubeUrl, Icon: YouTubeIcon },
  ].filter((l) => l.href);

  if (!links.length) {
    return (
      <p className="text-sm text-white/55">
        Listening links for Spotify, Apple Podcasts and YouTube will appear here.
      </p>
    );
  }

  return (
    <div>
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-white/55">Listen on</p>
      <ul className="flex flex-wrap gap-3">
        {links.map(({ key, label, href, Icon }) => (
          <li key={key}>
            <a href={href} target="_blank" rel="noopener noreferrer" className={pillClass}>
              <Icon className="size-5" />
              {label}
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function EpisodeRow({ episode, index }: { episode: GtpMediaPodcastEpisode; index: number }) {
  const href = episode.spotifyUrl || episode.appleUrl || episode.youtubeUrl;
  const date = formatDate(episode.publishedAt);
  const meta = [date, episode.duration].filter(Boolean).join("  ·  ");

  const body = (
    <>
      <span
        aria-hidden
        className="w-10 shrink-0 font-heading text-3xl font-bold tabular-nums text-white/25 transition-colors group-hover:text-gtp-orange"
      >
        {String(index + 1).padStart(2, "0")}
      </span>
      <span className="relative size-20 shrink-0 overflow-hidden rounded-lg bg-gtp-dark-teal">
        {episode.thumbnail ? (
          <Image
            src={episode.thumbnail.src}
            alt=""
            fill
            sizes="80px"
            className="object-cover"
          />
        ) : null}
        <span className="absolute inset-0 flex items-center justify-center bg-gtp-dark-teal-dark/40">
          <PlayGlyph className="size-7 text-white" />
        </span>
      </span>
      <span className="min-w-0">
        {episode.topic ? (
          <span className="block text-[11px] font-semibold uppercase tracking-[0.16em] text-gtp-teal-light">
            {episode.topic}
          </span>
        ) : null}
        <span className="mt-1 block font-heading text-base font-semibold leading-snug text-white md:text-lg">
          {episode.title}
        </span>
        {meta ? <span className="mt-1.5 block text-sm text-white/55">{meta}</span> : null}
      </span>
    </>
  );

  const cls = "group flex items-center gap-4 border-b border-white/15 py-5";
  return href ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
      {body}
      <span className="sr-only">(opens in a new tab)</span>
    </a>
  ) : (
    <div className={cls}>{body}</div>
  );
}

export function PodcastSection({ podcasts }: Props) {
  const { title, intro, cover, platforms, episodes } = podcasts;

  return (
    <section
      id="podcasts"
      aria-labelledby="podcasts-heading"
      className="scroll-mt-40 border-t border-white/10 bg-gtp-dark-teal px-4 py-20 sm:px-6 lg:px-8 lg:py-28"
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <div className="relative mx-auto aspect-square w-full max-w-sm overflow-hidden rounded-2xl bg-gtp-dark-teal-dark shadow-2xl ring-1 ring-white/10">
              <Image
                src={cover.src}
                alt={cover.alt}
                fill
                sizes="(max-width: 1024px) 384px, 30vw"
                className="object-cover"
                unoptimized={cover.src.endsWith(".svg")}
              />
            </div>
          </div>
          <div className="lg:col-span-8">
            <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em] text-gtp-teal-light">
              <span aria-hidden className="h-px w-10 bg-gtp-teal-light" />
              02
            </p>
            <h2
              id="podcasts-heading"
              className="mt-4 font-heading text-4xl font-bold tracking-tight text-white md:text-5xl"
            >
              {title}
            </h2>
            <div className="mt-6 max-w-2xl space-y-4 text-base leading-relaxed text-white/75 lg:text-lg">
              {intro.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
            <div className="mt-8">
              <PlatformLinks platforms={platforms} />
            </div>
          </div>
        </div>

        <div className="mt-16 lg:mt-20">
          {episodes.length ? (
            <>
              <h3 className="font-heading text-sm font-semibold uppercase tracking-[0.2em] text-white/55">
                Recent episodes
              </h3>
              <ol className="mt-2 md:columns-2 md:gap-x-16">
                {episodes.map((episode, i) => (
                  <li key={episode.id} className="break-inside-avoid">
                    <EpisodeRow episode={episode} index={i} />
                  </li>
                ))}
              </ol>
            </>
          ) : (
            <div className="rounded-2xl border border-dashed border-white/25 px-6 py-10 text-center">
              <p className="font-heading text-lg font-semibold text-white">Episodes are on their way</p>
              <p className="mx-auto mt-2 max-w-md text-sm text-white/60">
                New conversations from the conference will be listed here as they are released.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
