"use client";

import * as React from "react";
import { PILLARS, type PillarId } from "./data";

type Props = { activePillar: PillarId };

function calcHeight(w: number) {
  return w > 500 ? Math.round(w * 0.75) : 500;
}

export function TableauEmbed({ activePillar }: Props) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const scriptInjected = React.useRef(false);
  const [maxHeight, setMaxHeight] = React.useState<number | undefined>(undefined);

  React.useEffect(() => {
    if (scriptInjected.current) return;
    scriptInjected.current = true;

    // Set dimensions on objects before inserting viz_v1.js —
    // Tableau reads these on load, so order matters.
    PILLARS.forEach(({ vizId }) => {
      const divElement = document.getElementById(vizId);
      if (!divElement) return;
      const vizElement = divElement.querySelector<HTMLObjectElement>("object");
      if (!vizElement) return;
      const w = divElement.offsetWidth || containerRef.current?.offsetWidth || 800;
      vizElement.style.width = "100%";
      vizElement.style.height = `${calcHeight(w)}px`;
    });

    // Initial max-height clamp
    const w = containerRef.current?.offsetWidth ?? 800;
    setMaxHeight(calcHeight(w));

    // Insert viz_v1.js once
    const firstDiv = document.getElementById(PILLARS[0].vizId);
    const firstObj = firstDiv?.querySelector("object");
    if (firstObj) {
      const script = document.createElement("script");
      script.src = "https://public.tableau.com/javascripts/api/viz_v1.js";
      firstObj.parentNode!.insertBefore(script, firstObj);
    }

    // Keep object heights + container max-height in sync on resize
    const ro = new ResizeObserver(() => {
      const width = containerRef.current?.offsetWidth;
      if (!width) return;
      const h = calcHeight(width);
      setMaxHeight(h);
      PILLARS.forEach(({ vizId }) => {
        const obj = document
          .getElementById(vizId)
          ?.querySelector<HTMLObjectElement>("object");
        if (obj) {
          obj.style.width = "100%";
          obj.style.height = `${h}px`;
        }
      });
    });

    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden rounded-xl"
      // maxHeight clamps Tableau's iframe (which it hardcodes to 727px on mobile)
      // overflow-hidden clips anything beyond it
      style={maxHeight !== undefined ? { maxHeight } : undefined}
    >
      {PILLARS.map((p) => (
        <div
          key={p.id}
          style={{ display: p.id === activePillar ? "block" : "none" }}
        >
          <div id={p.vizId} style={{ position: "relative", width: "100%" }}>
            <noscript>
              <a href="#">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  alt={p.label}
                  src={`https://public.tableau.com/static/images/Pl/${p.workbook}/${p.sheet}/1_rss.png`}
                  style={{ border: "none" }}
                />
              </a>
            </noscript>
            <object className="tableauViz" style={{ display: "none" }}>
              <param name="host_url" value="https%3A%2F%2Fpublic.tableau.com%2F" />
              <param name="embed_code_version" value="3" />
              <param name="site_root" value="" />
              <param name="name" value={`${p.workbook}/${p.sheet}`} />
              <param name="tabs" value="no" />
              <param name="toolbar" value="yes" />
              <param
                name="static_image"
                value={`https://public.tableau.com/static/images/Pl/${p.workbook}/${p.sheet}/1.png`}
              />
              <param name="animate_transition" value="yes" />
              <param name="display_static_image" value="yes" />
              <param name="display_spinner" value="yes" />
              <param name="display_overlay" value="yes" />
              <param name="display_count" value="yes" />
              <param name="language" value="en-GB" />
              <param name="filter" value="publish=yes" />
            </object>
          </div>
        </div>
      ))}
    </div>
  );
}
