"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { PILLARS, type PillarId } from "./data";
import { TableauEmbed } from "./tableau-embed";

export function PlanetaryHealthTabs() {
  const [active, setActive] = React.useState<PillarId>("environmental");

  const pillar = PILLARS.find((p) => p.id === active)!;

  return (
    <div>
      {/* Tab bar */}
      <div className="flex border-b border-border">
        {PILLARS.map((p) => (
          <button
            key={p.id}
            role="tab"
            aria-selected={active === p.id}
            onClick={() => setActive(p.id)}
            className={cn(
              "relative px-6 py-3.5 text-sm font-medium transition-colors duration-150 focus-visible:outline-none",
              active === p.id
                ? "text-[var(--tab-color)]"
                : "text-muted-foreground hover:text-foreground"
            )}
            style={{ "--tab-color": p.color } as React.CSSProperties}
          >
            <span className="flex items-center gap-2">
              <span
                className="inline-block h-2 w-2 shrink-0 rounded-full"
                style={{ background: p.color }}
              />
              {p.label}
            </span>
            {active === p.id && (
              <span
                className="absolute inset-x-0 bottom-0 h-0.5 rounded-full"
                style={{ background: p.color }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="pt-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">

          {/* Left: map */}
          <TableauEmbed activePillar={active} />

          {/* Right: info panel */}
          <div className="flex flex-col gap-4">

            {/* About */}
            <div className="rounded-xl bg-muted p-4">
              <p
                className="mb-2 text-xs font-semibold uppercase tracking-widest"
                style={{ color: pillar.color }}
              >
                About this index
              </p>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {pillar.description}
              </p>
            </div>

            {/* Sub-indices */}
            <div className="rounded-xl bg-muted p-4">
              <p
                className="mb-3 text-xs font-semibold uppercase tracking-widest"
                style={{ color: pillar.color }}
              >
                Sub-indices
              </p>
              <div className="flex flex-wrap gap-2">
                {pillar.subIndices.map((name) => (
                  <span
                    key={name}
                    className="rounded-full border px-3 py-1 text-xs font-medium"
                    style={{
                      borderColor: `${pillar.color}40`,
                      color: pillar.color,
                      background: `${pillar.color}10`,
                    }}
                  >
                    {name}
                  </span>
                ))}
              </div>
            </div>

            {/* Global snapshot */}
            <div className="rounded-xl bg-muted p-4">
              <p
                className="mb-3 text-xs font-semibold uppercase tracking-widest"
                style={{ color: pillar.color }}
              >
                Global snapshot
              </p>
              <div className="grid grid-cols-2 gap-2">
                {pillar.stats.map(({ label, value }) => (
                  <div
                    key={label}
                    className="rounded-lg border border-border bg-background p-3 text-center"
                  >
                    <div
                      className="text-xl font-semibold"
                      style={{ color: pillar.color }}
                    >
                      {value}
                    </div>
                    <div className="mt-0.5 text-xs text-muted-foreground">
                      {label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
