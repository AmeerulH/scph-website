"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const SECTIONS = [
  { id: "photos", label: "Photo Gallery" },
  { id: "podcasts", label: "Podcasts" },
  { id: "videos", label: "Videos" },
] as const;

/** Sticky section switcher with scrollspy. Anchors work without JS. */
export function MediaSectionNav() {
  const [active, setActive] = React.useState<string>(SECTIONS[0].id);

  React.useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      // The active section is the last one whose top has passed a line 35% down the viewport.
      const line = window.innerHeight * 0.35;
      let current: string = SECTIONS[0].id;
      for (const { id } of SECTIONS) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= line) current = id;
      }
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
  }, []);

  return (
    <div className="sticky top-[4.5rem] z-30 flex justify-center px-4 py-2">
      <nav
        aria-label="Jump to section"
        className="flex items-center gap-1 rounded-full border border-white/15 bg-gtp-dark-teal-dark/85 p-1 shadow-lg backdrop-blur-md"
      >
        {SECTIONS.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            aria-current={active === s.id ? "true" : undefined}
            className={cn(
              "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
              active === s.id
                ? "bg-white text-gtp-dark-teal-dark"
                : "text-white/75 hover:bg-white/10 hover:text-white",
            )}
          >
            {s.label}
          </a>
        ))}
      </nav>
    </div>
  );
}
