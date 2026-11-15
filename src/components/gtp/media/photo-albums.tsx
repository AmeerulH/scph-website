"use client";

import * as React from "react";
import Image from "next/image";
import { ArrowUpRight, ChevronLeft, ChevronRight, X } from "lucide-react";
import type { GtpMediaPhotoAlbum } from "@/data/gtp-media-page-defaults";
import { cn } from "@/lib/utils";
import { AlbumCarousel } from "./album-carousel";

type Props = {
  title: string;
  intro: string[];
  albums: GtpMediaPhotoAlbum[];
};

function Lightbox({
  album,
  index,
  onClose,
  onIndex,
}: {
  album: GtpMediaPhotoAlbum;
  index: number | null;
  onClose: () => void;
  onIndex: (i: number) => void;
}) {
  const ref = React.useRef<HTMLDialogElement>(null);
  const touchX = React.useRef<number | null>(null);
  const total = album.photos.length;
  const open = index !== null;

  React.useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  const step = React.useCallback(
    (dir: 1 | -1) => {
      if (index === null) return;
      onIndex((index + dir + total) % total);
    },
    [index, total, onIndex],
  );

  const photo = index !== null ? album.photos[index] : null;

  return (
    <dialog
      ref={ref}
      aria-label={`${album.title} photo viewer`}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") step(1);
        if (e.key === "ArrowLeft") step(-1);
      }}
      onTouchStart={(e) => {
        touchX.current = e.touches[0].clientX;
      }}
      onTouchEnd={(e) => {
        if (touchX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
        touchX.current = null;
      }}
      className="m-0 h-dvh max-h-none w-screen max-w-none bg-gtp-dark-teal-dark/95 p-0 text-white backdrop:bg-black/80"
    >
      {photo ? (
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between px-4 py-3 sm:px-6">
            <p className="text-sm text-white/70">
              <span className="font-semibold text-white">{album.title}</span>
              <span className="ml-3 tabular-nums">
                {(index ?? 0) + 1} / {total}
              </span>
            </p>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close photo viewer"
              className="flex size-10 items-center justify-center rounded-full border border-white/25 transition-colors hover:bg-white/10"
            >
              <X className="size-5" aria-hidden />
            </button>
          </div>

          <div className="relative min-h-0 flex-1">
            <Image
              key={photo.src}
              src={photo.src}
              alt={photo.alt}
              fill
              sizes="100vw"
              className="object-contain"
            />
            <button
              type="button"
              onClick={() => step(-1)}
              aria-label="Previous photo"
              className="absolute left-3 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-gtp-dark-teal-dark/70 backdrop-blur-sm transition-colors hover:bg-gtp-dark-teal-dark"
            >
              <ChevronLeft className="size-6" aria-hidden />
            </button>
            <button
              type="button"
              onClick={() => step(1)}
              aria-label="Next photo"
              className="absolute right-3 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-gtp-dark-teal-dark/70 backdrop-blur-sm transition-colors hover:bg-gtp-dark-teal-dark"
            >
              <ChevronRight className="size-6" aria-hidden />
            </button>
          </div>

          <p className="min-h-12 px-4 py-3 text-center text-sm text-white/70">
            {photo.caption || (album.isPlaceholder ? "Preview photo from GTP 2025" : "")}
          </p>
        </div>
      ) : null}
    </dialog>
  );
}

export function PhotoAlbums({ title, intro, albums }: Props) {
  const [activeId, setActiveId] = React.useState(albums[0]?.id);
  const [lightbox, setLightbox] = React.useState<number | null>(null);
  const active = albums.find((a) => a.id === activeId) ?? albums[0];
  if (!active) return null;

  return (
    <section
      id="photos"
      aria-labelledby="photos-heading"
      className="scroll-mt-40 px-4 py-20 sm:px-6 lg:px-8 lg:py-28"
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em] text-gtp-teal-light">
              <span aria-hidden className="h-px w-10 bg-gtp-teal-light" />
              01
            </p>
            <h2
              id="photos-heading"
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

        <div className="mt-14 grid gap-8 lg:grid-cols-[15rem_1fr] lg:gap-12">
          <div
            role="tablist"
            aria-label="Photo albums"
            className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2 [scrollbar-width:none] lg:mx-0 lg:flex-col lg:gap-0 lg:overflow-visible lg:border-t lg:border-white/15 lg:px-0 lg:pb-0 [&::-webkit-scrollbar]:hidden"
          >
            {albums.map((album) => {
              const selected = album.id === active.id;
              return (
                <button
                  key={album.id}
                  role="tab"
                  type="button"
                  id={`album-tab-${album.id}`}
                  aria-selected={selected}
                  aria-controls="album-panel"
                  onClick={() => setActiveId(album.id)}
                  className={cn(
                    "shrink-0 rounded-full border px-5 py-2.5 text-left transition-colors lg:rounded-none lg:border-0 lg:border-b lg:border-white/15 lg:px-0 lg:py-4",
                    selected
                      ? "border-white bg-white text-gtp-dark-teal-dark lg:bg-transparent lg:text-white"
                      : "border-white/25 text-white/70 hover:text-white",
                  )}
                >
                  <span className="flex items-baseline gap-3">
                    <span
                      className={cn(
                        "hidden size-2 shrink-0 rounded-full transition-colors lg:block",
                        selected ? "bg-gtp-orange" : "bg-white/20",
                      )}
                      aria-hidden
                    />
                    <span className="font-heading text-sm font-semibold whitespace-nowrap lg:text-lg">
                      {album.title}
                    </span>
                  </span>
                  {album.dateLabel ? (
                    <span className="hidden pl-5 text-sm text-white/55 lg:block">{album.dateLabel}</span>
                  ) : null}
                </button>
              );
            })}
          </div>

          <div
            role="tabpanel"
            id="album-panel"
            aria-labelledby={`album-tab-${active.id}`}
            tabIndex={0}
            className="min-w-0"
          >
            <div className="relative">
              <div
                inert={active.isPlaceholder}
                aria-hidden={active.isPlaceholder || undefined}
                className={cn(active.isPlaceholder && "opacity-25 saturate-50")}
              >
                <div className="md:hidden">
                  <AlbumCarousel key={active.id} photos={active.photos} onOpen={setLightbox} />
                </div>
                <div className="hidden auto-rows-[11rem] grid-cols-4 gap-3 md:grid lg:auto-rows-[12.5rem]">
                {active.photos.slice(0, 9).map((photo, i) => (
                  <button
                    key={`${active.id}-${photo.src}-${i}`}
                    type="button"
                    onClick={() => setLightbox(i)}
                    aria-label={`Open photo ${i + 1} of ${active.photos.length}: ${photo.alt}`}
                    className={cn(
                      "group relative overflow-hidden rounded-xl bg-gtp-dark-teal focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gtp-teal-light",
                      i === 0 && "col-span-2 row-span-2",
                    )}
                  >
                    <Image
                      src={photo.src}
                      alt=""
                      fill
                      sizes={
                        i === 0
                          ? "(max-width: 768px) 100vw, 40vw"
                          : "(max-width: 768px) 50vw, 20vw"
                      }
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  </button>
                ))}
                </div>
              </div>

              {active.isPlaceholder ? (
                <div className="mt-4 md:absolute md:inset-0 md:mt-0 md:flex md:items-center md:justify-center md:p-4">
                  <div
                    role="status"
                    className="mx-auto w-full max-w-lg rounded-2xl border border-white/15 bg-gtp-dark-teal-dark px-6 py-10 text-center shadow-2xl sm:px-14 md:py-16"
                  >
                    <p className="flex items-center justify-center gap-2.5 text-xs font-semibold uppercase tracking-[0.22em] text-gtp-teal-light">
                      <span aria-hidden className="size-2 rounded-full bg-gtp-orange" />
                      Coming soon
                    </p>
                    <p className="mt-6 font-heading text-2xl font-bold leading-tight text-white sm:text-3xl">
                      {active.title} photos are on their way
                    </p>
                    <p className="mx-auto mt-4 max-w-sm text-sm leading-relaxed text-white/70 sm:text-base">
                      The {active.title} gallery will be published here after the conference.
                      Check back soon.
                    </p>
                    <p className="mt-10 border-t border-white/10 pt-6 text-xs text-white/45">
                      Faded images are previews from GTP 2025.
                    </p>
                  </div>
                </div>
              ) : null}
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
              {active.isPlaceholder ? (
                <span />
              ) : (
                <p className="text-sm text-white/55">
                  {`${active.photos.length} ${active.photos.length === 1 ? "photo" : "photos"}`}
                </p>
              )}
              {active.driveLinks.length ? (
                <div className="flex flex-wrap gap-3">
                  {active.driveLinks.map((link) => (
                    <a
                      key={link.url}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-white/30 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-white hover:text-gtp-dark-teal-dark"
                    >
                      {link.label}
                      <ArrowUpRight className="size-4" aria-hidden />
                      <span className="sr-only">(opens in a new tab)</span>
                    </a>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      <Lightbox
        album={active}
        index={lightbox}
        onClose={() => setLightbox(null)}
        onIndex={setLightbox}
      />
    </section>
  );
}
