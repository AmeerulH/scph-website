"use client";

import * as React from "react";
import { PILLARS, type PillarId, type MobileViz } from "./data";

type Props = { activePillar: PillarId };

const MOBILE_HEIGHT = 1027;
const BREAKPOINT = 500;

const INACTIVE_STYLE: React.CSSProperties = {
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  visibility: "hidden",
  pointerEvents: "none",
};

export function TableauEmbed({ activePillar }: Props) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const scriptInjected = React.useRef(false);

  // useLayoutEffect fires before paint — DOM is correct before Tableau ever initialises.
  // null = not-yet-determined (SSR + first client render).
  const [isMobile, setIsMobile] = React.useState<boolean | null>(null);
  React.useLayoutEffect(() => {
    setIsMobile(window.innerWidth <= BREAKPOINT);
  }, []);

  React.useEffect(() => {
    if (scriptInjected.current) return;
    scriptInjected.current = true;

    const mobile = window.innerWidth <= BREAKPOINT;

    if (mobile) {
      // Pre-set mobile viz object dimensions before viz_v1.js loads
      PILLARS.forEach(({ mobileViz }) => {
        const obj = document
          .getElementById(mobileViz.vizId)
          ?.querySelector<HTMLObjectElement>("object");
        if (!obj) return;
        obj.style.width = "100%";
        obj.style.height = `${MOBILE_HEIGHT}px`;
      });

      // CSS !important safety net in case viz_v1.js resets to 727px
      const styleId = "tableau-mobile-height-override";
      if (!document.getElementById(styleId)) {
        const style = document.createElement("style");
        style.id = styleId;
        style.textContent = PILLARS.map(
          ({ mobileViz }) =>
            `#${mobileViz.vizId} iframe,` +
            `#${mobileViz.vizId} .tableauPlaceholder` +
            `{height:${MOBILE_HEIGHT}px!important;}`
        ).join("");
        document.head.appendChild(style);
      }
    } else {
      const containerW = containerRef.current?.offsetWidth ?? window.innerWidth ?? 1000;
      PILLARS.forEach(({ vizId }) => {
        const divElement = document.getElementById(vizId);
        if (!divElement) return;
        const obj = divElement.querySelector<HTMLObjectElement>("object");
        if (!obj) return;
        const w = divElement.offsetWidth || containerW;
        obj.style.width = "100%";
        obj.style.height = `${Math.round(w * 0.75)}px`;
      });
    }

    // Insert viz_v1.js — by this point useLayoutEffect has already hidden
    // the wrong group, so Tableau only initialises the visible set.
    const script = document.createElement("script");
    script.src = "https://public.tableau.com/javascripts/api/viz_v1.js";
    document.head.appendChild(script);

    const ro = new ResizeObserver(() => {
      const w = containerRef.current?.offsetWidth ?? 0;
      const mob = w <= BREAKPOINT;
      PILLARS.forEach(({ vizId, mobileViz }) => {
        const desktopObj = document.getElementById(vizId)?.querySelector<HTMLObjectElement>("object");
        const mobileObj = document.getElementById(mobileViz.vizId)?.querySelector<HTMLObjectElement>("object");
        if (desktopObj && !mob) {
          desktopObj.style.width = "100%";
          desktopObj.style.height = `${Math.round(w * 0.75)}px`;
        }
        if (mobileObj) mobileObj.style.width = "100%";
      });
    });
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  // null  → both groups shown (SSR / pre-layout-effect, never visible to user)
  // true  → mobile shown, desktop hidden
  // false → desktop shown, mobile hidden
  // Default to desktop (null = not yet determined). Mobile only shown once confirmed.
  const desktopDisplay = isMobile === true ? "none" : "block";
  const mobileDisplay = isMobile === true ? "block" : "none";

  return (
    <div ref={containerRef} className="relative w-full rounded-xl">
      {/* Desktop vizes */}
      <div style={{ display: desktopDisplay }}>
        {PILLARS.map((p) => (
          <div
            key={p.id}
            style={p.id === activePillar ? { position: "relative" } : INACTIVE_STYLE}
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

      {/* Mobile vizes */}
      <div style={{ display: mobileDisplay }}>
        {PILLARS.map((p) => (
          <MobileVizPanel
            key={p.id}
            pillar={p}
            mobileViz={p.mobileViz}
            active={p.id === activePillar}
          />
        ))}
      </div>
    </div>
  );
}

// ── Mobile viz panel ──────────────────────────────────────────────────────────

type MobileVizPanelProps = {
  pillar: { label: string };
  mobileViz: MobileViz;
  active: boolean;
};

function MobileVizPanel({ pillar, mobileViz, active }: MobileVizPanelProps) {
  return (
    <div style={active ? { position: "relative" } : INACTIVE_STYLE}>
      <div id={mobileViz.vizId} style={{ position: "relative", width: "100%" }}>
        <noscript>
          <a href="#">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img alt={pillar.label} src={mobileViz.rssImage} style={{ border: "none" }} />
          </a>
        </noscript>
        <object className="tableauViz" style={{ display: "none" }}>
          <param name="host_url" value="https%3A%2F%2Fpublic.tableau.com%2F" />
          <param name="embed_code_version" value="3" />
          {mobileViz.path ? (
            <param name="path" value={mobileViz.path} />
          ) : (
            <>
              <param name="site_root" value="" />
              <param name="name" value={mobileViz.name ?? ""} />
              <param name="tabs" value="no" />
            </>
          )}
          <param name="toolbar" value="yes" />
          <param name="static_image" value={mobileViz.staticImage} />
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
  );
}
