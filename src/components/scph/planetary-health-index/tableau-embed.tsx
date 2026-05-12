"use client";

import * as React from "react";
import Script from "next/script";
import { PILLARS, type PillarId } from "./data";

type Props = { activePillar: PillarId };

export function TableauEmbed({ activePillar }: Props) {
  const containerRef = React.useRef<HTMLDivElement>(null);

  const sizeVizes = React.useCallback(() => {
    const width = containerRef.current?.offsetWidth;
    if (!width) return;
    const height = Math.round(width * 0.75);
    PILLARS.forEach(({ vizId }) => {
      const obj = document
        .getElementById(vizId)
        ?.querySelector<HTMLObjectElement>("object");
      if (obj) {
        obj.style.width = "100%";
        obj.style.height = `${height}px`;
      }
    });
  }, []);

  React.useEffect(() => {
    sizeVizes();
    const ro = new ResizeObserver(sizeVizes);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [sizeVizes]);

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden rounded-xl"
      style={{ aspectRatio: "4 / 3" }}
    >
      {/* Loaded once; Next.js deduplicates by id across re-renders */}
      <Script
        id="tableau-api"
        src="https://public.tableau.com/javascripts/api/viz_v1.js"
        strategy="afterInteractive"
        onLoad={sizeVizes}
      />

      {PILLARS.map((p) => (
        <div
          key={p.id}
          className="absolute inset-0"
          style={{
            visibility: p.id === activePillar ? "visible" : "hidden",
          }}
        >
          {/* ID must match what Tableau's bootstrap script references */}
          <div id={p.vizId} style={{ position: "relative", width: "100%", height: "100%" }}>
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
            {/*
             * Tableau's viz_v1.js scans the DOM for <object class="tableauViz"> and
             * bootstraps each viz via the <param> children below.
             * display:none is the documented initial state — the API makes it visible.
             */}
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
