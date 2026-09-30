"use client";

import * as React from "react";
import Image from "next/image";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import type { GtpMediaPageResolved, GtpMediaVideo } from "@/data/gtp-media-page-defaults";
import { youTubeEmbedUrl, youTubeThumbnailUrl } from "@/lib/youtube";
import { cn } from "@/lib/utils";
import { PlayGlyph, YouTubeIcon } from "./platform-icons";

type Props = { videos: GtpMediaPageResolved["videos"] };

function poster(video: GtpMediaVideo) {
  return video.thumbnail?.src ?? youTubeThumbnailUrl(video.youtubeId);
}

export function VideoSection({ videos }: Props) {
  const { title, intro, channelUrl, items } = videos;
  const [activeId, setActiveId] = React.useState(items[0]?.id);
  const [playing, setPlaying] = React.useState(false);
  const rail = React.useRef<HTMLUListElement>(null);
  const active = items.find((v) => v.id === activeId) ?? items[0];

  const scrollRail = (dir: 1 | -1) => {
    const el = rail.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: "smooth" });
  };

  return (
    <section
      id="videos"
      aria-labelledby="videos-heading"
      className="scroll-mt-40 border-t border-white/10 px-4 py-20 sm:px-6 lg:px-8 lg:py-28"
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em] text-gtp-teal-light">
              <span aria-hidden className="h-px w-10 bg-gtp-teal-light" />
              03
            </p>
            <h2
              id="videos-heading"
              className="mt-4 font-heading text-4xl font-bold tracking-tight text-white md:text-5xl"
            >
              {title}
            </h2>
          </div>
          <div className="space-y-4 text-base leading-relaxed text-white/75 lg:col-span-7 lg:text-lg">
            {intro.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </div>

        {active ? (
          <div className="mt-14">
            <div className="relative aspect-video overflow-hidden rounded-2xl bg-black shadow-2xl ring-1 ring-white/10">
              {playing ? (
                <iframe
                  key={active.youtubeId}
                  src={youTubeEmbedUrl(active.youtubeId)}
                  title={active.title}
                  allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                  allowFullScreen
                  className="absolute inset-0 size-full"
                />
              ) : (
                <button
                  type="button"
                  onClick={() => setPlaying(true)}
                  aria-label={`Play video: ${active.title}`}
                  className="group absolute inset-0 focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-gtp-teal-light"
                >
                  <Image
                    src={poster(active)}
                    alt=""
                    fill
                    priority={false}
                    sizes="(max-width: 1280px) 100vw, 1200px"
                    className="object-cover"
                  />
                  <span aria-hidden className="absolute inset-0 bg-linear-to-t from-gtp-dark-teal-dark/80 via-transparent to-transparent" />
                  <span className="absolute bottom-5 left-5 flex items-center gap-4 sm:bottom-8 sm:left-8">
                    <span className="flex size-16 items-center justify-center rounded-full bg-gtp-orange text-white shadow-lg transition-transform duration-300 ease-out group-hover:scale-110 sm:size-20">
                      <PlayGlyph className="size-8 translate-x-0.5 sm:size-10" />
                    </span>
                    <span className="text-left text-white">
                      <span className="block font-heading text-lg font-semibold sm:text-xl">Start watching</span>
                      {active.duration ? (
                        <span className="text-sm text-white/75">{active.duration}</span>
                      ) : null}
                    </span>
                  </span>
                </button>
              )}
            </div>

            <div className="mt-6 flex flex-wrap items-start justify-between gap-6">
              <div className="max-w-3xl">
                {active.topic ? (
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gtp-teal-light">
                    {active.topic}
                  </p>
                ) : null}
                <h3 className="mt-2 font-heading text-2xl font-bold text-white md:text-3xl">
                  {active.title}
                </h3>
                {active.description ? (
                  <p className="mt-3 text-base leading-relaxed text-white/70">{active.description}</p>
                ) : null}
              </div>
              {channelUrl ? (
                <a
                  href={channelUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 rounded-full border border-white/30 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-white hover:text-gtp-dark-teal-dark"
                >
                  <YouTubeIcon className="size-5" />
                  Subscribe on YouTube
                  <ArrowUpRight className="size-4" aria-hidden />
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              ) : null}
            </div>

            {items.length > 1 ? (
              <div className="mt-14">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-heading text-sm font-semibold uppercase tracking-[0.2em] text-white/55">
                    More videos
                  </h3>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => scrollRail(-1)}
                      aria-label="Scroll videos left"
                      className="flex size-10 items-center justify-center rounded-full border border-white/25 text-white transition-colors hover:bg-white/10"
                    >
                      <ChevronLeft className="size-5" aria-hidden />
                    </button>
                    <button
                      type="button"
                      onClick={() => scrollRail(1)}
                      aria-label="Scroll videos right"
                      className="flex size-10 items-center justify-center rounded-full border border-white/25 text-white transition-colors hover:bg-white/10"
                    >
                      <ChevronRight className="size-5" aria-hidden />
                    </button>
                  </div>
                </div>
                <ul
                  ref={rail}
                  className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden"
                >
                  {items.map((video) => {
                    const current = video.id === active.id;
                    return (
                      <li key={video.id} className="w-64 shrink-0 snap-start sm:w-72">
                        <button
                          type="button"
                          onClick={() => {
                            setActiveId(video.id);
                            setPlaying(false);
                          }}
                          aria-current={current ? "true" : undefined}
                          className="group block w-full text-left"
                        >
                          <span
                            className={cn(
                              "relative block aspect-video overflow-hidden rounded-xl bg-gtp-dark-teal ring-2 transition-shadow",
                              current ? "ring-gtp-orange" : "ring-transparent group-hover:ring-white/30",
                            )}
                          >
                            <Image
                              src={poster(video)}
                              alt=""
                              fill
                              sizes="288px"
                              className="object-cover"
                            />
                            <span className="absolute bottom-2 left-2 flex size-9 items-center justify-center rounded-full bg-gtp-dark-teal-dark/80 text-white">
                              <PlayGlyph className="size-5 translate-x-px" />
                            </span>
                            {video.duration ? (
                              <span className="absolute bottom-2 right-2 rounded bg-gtp-dark-teal-dark/80 px-1.5 py-0.5 text-xs tabular-nums text-white">
                                {video.duration}
                              </span>
                            ) : null}
                          </span>
                          {video.topic ? (
                            <span className="mt-3 block text-[11px] font-semibold uppercase tracking-[0.16em] text-gtp-teal-light">
                              {video.topic}
                            </span>
                          ) : null}
                          <span className="mt-1 block font-heading text-base font-semibold leading-snug text-white">
                            {video.title}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ) : null}
          </div>
        ) : (
          <div className="mt-14 rounded-2xl border border-dashed border-white/25 px-6 py-14 text-center">
            <p className="font-heading text-lg font-semibold text-white">Videos are on their way</p>
            <p className="mx-auto mt-2 max-w-md text-sm text-white/60">
              Highlights and sessions from the conference will be published here.
            </p>
            {channelUrl ? (
              <a
                href={channelUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-2.5 rounded-full bg-gtp-orange px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gtp-orange-dark"
              >
                <YouTubeIcon className="size-5" />
                Visit our YouTube channel
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            ) : null}
          </div>
        )}
      </div>
    </section>
  );
}
