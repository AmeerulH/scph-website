"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import styles from "./media-section-nav.module.css";

const SECTIONS = [
  { id: "photos", label: "Photo Gallery" },
  { id: "podcasts", label: "Podcasts" },
  { id: "videos", label: "Videos" },
] as const;

/** Sticky section switcher with scrollspy. Anchors work without JS. */
export function MediaSectionNav({ sections = SECTIONS, label = "Jump to section" }: {
  sections?: readonly { id: string; label: string }[];
  label?: string;
}) {
  const [active, setActive] = React.useState<string>(sections[0]?.id ?? "");
  const [instant, setInstant] = React.useState(false);
  const nav = React.useRef<HTMLElement>(null);

  React.useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      // The active section is the last one whose top has passed a line 35% down the viewport.
      const line = window.innerHeight * 0.35;
      let current = sections[0]?.id ?? "";
      for (const { id } of sections) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= line) current = id;
      }
      // A short final section can reach the page bottom before crossing the spy line.
      const last = sections.at(-1);
      const lastSection = last && document.getElementById(last.id);
      if (lastSection && lastSection.getBoundingClientRect().top < window.innerHeight &&
        Math.ceil(window.scrollY + window.innerHeight) >= document.documentElement.scrollHeight) current = last.id;
      setActive(current);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    window.addEventListener("hashchange", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("hashchange", schedule);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [sections]);

  React.useEffect(() => {
    const strip = nav.current;
    const selected = strip?.querySelector<HTMLAnchorElement>('a[aria-current="true"]');
    if (!strip || !selected) return;
    const bounds = strip.getBoundingClientRect();
    const item = selected.getBoundingClientRect();
    // Reveal only inside the pill; scrollIntoView could also move the document.
    if (item.left < bounds.left + 4) strip.scrollLeft -= bounds.left + 4 - item.left;
    else if (item.right > bounds.right - 4) strip.scrollLeft += item.right - bounds.right + 4;
  }, [active]);

  return (
    <div className="sticky top-[5.25rem] z-30 flex justify-center px-4 py-2">
      <nav
        ref={nav}
        aria-label={label}
        data-instant={instant || undefined}
        onKeyDown={() => setInstant(true)}
        onPointerDown={() => setInstant(false)}
        onClick={event => setInstant(event.detail === 0)}
        className={cn(styles.nav, "flex max-w-full items-center gap-1 overflow-x-auto overscroll-x-contain rounded-full border border-white/15 bg-gtp-dark-teal-dark/85 p-1 shadow-lg backdrop-blur-md [scrollbar-width:none] [&::-webkit-scrollbar]:hidden")}
      >
        {sections.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            aria-current={active === s.id ? "true" : undefined}
            className={cn(
              styles.link,
              "flex min-h-11 shrink-0 items-center whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium",
              active === s.id
                ? "bg-white text-gtp-dark-teal-dark"
                : "text-white/75",
            )}
          >
            {s.label}
          </a>
        ))}
      </nav>
    </div>
  );
}
