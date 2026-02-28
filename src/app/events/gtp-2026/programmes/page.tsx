"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

import { TABS, TabId, day1, day2, day3, day4 } from "@/components/gtp/programmes/data";
import { ProgrammesHero } from "@/components/gtp/programmes/programmes-hero";
import { PreConferencePlaceholder } from "@/components/gtp/programmes/pre-conference-placeholder";
import { DayAgenda } from "@/components/gtp/programmes/day-agenda";

export default function ProgrammesPage() {
  const [activeTab, setActiveTab] = React.useState<TabId>("pre");
  const tabStripRef = React.useRef<HTMLDivElement>(null);
  const anchorRef = React.useRef<HTMLDivElement>(null);

  function handleTabClick(id: TabId) {
    setActiveTab(id);
    // Use a non-sticky anchor div whose getBoundingClientRect always reflects the true document position
    if (anchorRef.current) {
      const navbarHeight = 72;
      const top = anchorRef.current.getBoundingClientRect().top + window.scrollY - navbarHeight;
      window.scrollTo({ top, behavior: "smooth" });
    }
  }

  return (
    <>
      <ProgrammesHero />

      {/* Scroll anchor — non-sticky, always reports true document position */}
      <div ref={anchorRef} />

      {/* Sticky tab strip */}
      <div ref={tabStripRef} className="sticky top-[72px] z-40 py-4">
        <div className="flex justify-center px-4">
          {/* Frosted pill container */}
          <div className="flex overflow-x-auto gap-1 rounded-full bg-gtp-dark-teal/50 p-1.5 shadow-lg backdrop-blur-xl border border-white/10 [&::-webkit-scrollbar]:hidden">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={cn(
                  "shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 whitespace-nowrap",
                  activeTab === tab.id
                    ? "bg-gtp-teal text-white shadow-sm"
                    : "text-white hover:bg-white/10"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab content */}
      <div className="bg-gtp-dark-teal/5 min-h-screen">
        <div className="mx-auto max-w-4xl px-4 py-10 md:px-6 lg:px-8">
          {activeTab === "pre"  && <PreConferencePlaceholder />}
          {activeTab === "day1" && <DayAgenda sessions={day1} />}
          {activeTab === "day2" && <DayAgenda sessions={day2} />}
          {activeTab === "day3" && <DayAgenda sessions={day3} />}
          {activeTab === "day4" && <DayAgenda sessions={day4} />}
        </div>
      </div>
    </>
  );
}
