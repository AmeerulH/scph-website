"use client";

import { useState } from "react";
import { ArrowUp } from "lucide-react";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import type { GtpSubmissionsResolvedCopy } from "@/sanity/gtp-stage2";
import { AbstractForm } from "./abstract-form";
import { WorkshopForm } from "./workshop-form";

type TabId = "abstract" | "workshop";

export function SubmissionsFormsClient({
  copy,
}: {
  copy: GtpSubmissionsResolvedCopy;
}) {
  const [activeTab, setActiveTab] = useState<TabId>("abstract");

  const tabs: { id: TabId; label: string; deadline: string }[] = [
    {
      id: "abstract",
      label: copy.abstractTabLabel,
      deadline: copy.abstractDeadline,
    },
    {
      id: "workshop",
      label: copy.workshopTabLabel,
      deadline: copy.workshopDeadline,
    },
  ];

  const active = tabs.find((t) => t.id === activeTab)!;

  return (
    <SectionWrapper theme="gtp" background="dark">
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="font-heading text-2xl font-bold text-white md:text-3xl">
          {copy.ctaTitle}
        </h2>
        <p className="mt-4 text-base leading-relaxed text-white/70">
          {copy.ctaSubtitle}
        </p>

        <div
          id="submissions-tabs"
          className="mt-8 inline-flex w-full overflow-hidden rounded-xl bg-white/10 p-1 backdrop-blur-sm sm:w-auto"
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 rounded-lg px-3 py-2.5 text-center text-xs font-semibold leading-snug transition-all duration-200 sm:flex-none sm:px-5 sm:text-sm ${
                activeTab === tab.id
                  ? "bg-white text-gtp-dark-teal shadow"
                  : "text-white/70 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative mt-6">
          <div className="overflow-hidden rounded-2xl bg-white text-left shadow-xl ring-1 ring-white/20">
            <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
              <h3 className="font-heading text-lg font-bold text-gtp-dark-teal">
                {active.label}
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Deadline:{" "}
                <span className="font-semibold text-gray-700">
                  {active.deadline}
                </span>
              </p>
              <p className="mt-3 text-sm leading-relaxed text-gray-600">
                {activeTab === "abstract"
                  ? copy.abstractFormIntro
                  : copy.workshopFormIntro}
              </p>
            </div>
            <div className="p-6 sm:p-8">
              {activeTab === "abstract" ? (
                <AbstractForm
                  abstractForm={copy.abstractForm}
                  themeTitles={copy.themes.map((t) => t.title)}
                />
              ) : (
                <WorkshopForm
                  workshopForm={copy.workshopForm}
                  themeTitles={copy.themes.map((t) => t.title)}
                />
              )}
            </div>
          </div>

          <div className="absolute z-10 max-md:-bottom-10 max-md:right-2 md:-bottom-8 md:-right-8">
            <button
              type="button"
              onClick={() =>
                document
                  .getElementById("submissions-tabs")
                  ?.scrollIntoView({ behavior: "smooth", block: "center" })
              }
              className="flex flex-col items-center gap-1 transition-all duration-200 hover:scale-110 active:scale-95"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gtp-teal text-white shadow-lg">
                <ArrowUp className="h-5 w-5" />
              </span>
              <span className="whitespace-nowrap text-center text-xs font-semibold text-white/80">
                {copy.backToTopLabel}
              </span>
            </button>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
