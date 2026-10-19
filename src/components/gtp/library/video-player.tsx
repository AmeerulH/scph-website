"use client";

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { Dialog } from "radix-ui";
import { ArrowUpRight, X } from "lucide-react";
import type { LibraryVideo } from "@/lib/gtp-videos";
import { youTubeEmbedUrl } from "@/lib/youtube";
import styles from "./library.module.css";

const PlayerContext = createContext<((video: LibraryVideo, trigger: HTMLButtonElement, instant: boolean) => void) | null>(null);

export function VideoPlayer({ children }: { children: ReactNode }) {
  const [active, setActive] = useState<LibraryVideo>();
  const [open, setOpen] = useState(false);
  const [instant, setInstant] = useState(false);
  const trigger = useRef<HTMLButtonElement | null>(null);
  const content = useRef<HTMLDivElement | null>(null);
  const isOpen = useRef(false);
  const cleanup = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(cleanup.current), []);
  // A reversing exit retains the same Radix content, so its mount autofocus does not rerun.
  useEffect(() => { if (open) content.current?.focus(); }, [open]);

  function finishClose() {
    if (isOpen.current) return;
    clearTimeout(cleanup.current);
    setActive(undefined);
  }

  function close(immediate = false) {
    if (!isOpen.current) return;
    isOpen.current = false;
    setInstant(immediate);
    setOpen(false);
    if (immediate) finishClose();
    else cleanup.current = setTimeout(finishClose, 200);
  }

  return <PlayerContext.Provider value={(video, button, immediate) => {
    clearTimeout(cleanup.current);
    isOpen.current = true;
    trigger.current = button;
    setInstant(immediate);
    setActive(video);
    setOpen(true);
  }}>
    {children}
    <Dialog.Root open={open} onOpenChange={next => { if (!next) close(); }}>
      {active && <Dialog.Portal forceMount><Dialog.Overlay className={styles.overlay} data-instant={instant || undefined} style={{ pointerEvents: open ? "auto" : "none" }} />
        <Dialog.Content ref={content} className={styles.dialog} data-instant={instant || undefined} inert={!open}
          onEscapeKeyDown={event => { event.preventDefault(); close(true); }}
          onTransitionEnd={event => { if (event.target === event.currentTarget && event.propertyName === "opacity") finishClose(); }}
          onCloseAutoFocus={event => { event.preventDefault(); if (!isOpen.current) trigger.current?.focus(); }}>
          <Dialog.Title className={styles.dialogTitle}>{active?.title}</Dialog.Title>
          <Dialog.Description className={styles.dialogDescription}>{active?.description || "Watch this video from the GTP 2026 collection."}</Dialog.Description>
          <Dialog.Close className={styles.close} aria-label="Close video" disabled={!open}
            onClick={event => { event.preventDefault(); close(event.detail === 0); }}><X size={22} /></Dialog.Close>
          {active?.youtubeId && <div className={styles.frame}>{open && <iframe key={active.id} src={youTubeEmbedUrl(active.youtubeId)} title={active.title}
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" />}</div>}
          {active?.credit && <p className={styles.dialogDescription}>{active.credit}</p>}
          {active?.youtubeId && <a className={styles.watchLink} href={`https://www.youtube.com/watch?v=${active.youtubeId}`} target="_blank" rel="noopener noreferrer">
            Watch on YouTube<ArrowUpRight size={16} aria-hidden /><span className="sr-only">(opens in a new tab)</span></a>}
        </Dialog.Content>
      </Dialog.Portal>}
    </Dialog.Root>
  </PlayerContext.Provider>;
}

export function VideoPlayButton({ video, children, className }: { video: LibraryVideo; children: ReactNode; className?: string }) {
  const play = useContext(PlayerContext);
  return <button type="button" className={className} aria-label={`Play ${video.title}`}
    onClick={event => play?.(video, event.currentTarget, event.detail === 0)}>{children}</button>;
}
