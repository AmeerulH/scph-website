"use client";

import Link from "next/link";
import { CalendarDays, Download, FileText, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RESOURCE_THEMES, RESOURCE_TYPES } from "@/lib/mpn/filter-options";
import {
  getResourceWorkshop,
  type MpnResource,
  type MpnWorkshop,
} from "@/lib/mpn/resource-types";
import { cn } from "@/lib/utils";

type ResourcesBrowserProps = {
  resources: MpnResource[];
  workshops: MpnWorkshop[];
};

type ResourceTab = "shared" | "workshop";

export function ResourcesBrowser({ resources, workshops }: ResourcesBrowserProps) {
  const [tab, setTab] = useState<ResourceTab>("shared");
  const [type, setType] = useState<string | null>(null);
  const [theme, setTheme] = useState<string | null>(null);
  const [workshopId, setWorkshopId] = useState<string | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const visibleResources = useMemo(
    () =>
      resources.filter((resource) => {
        if (tab === "shared") {
          return (
            resource.workshop_id === null &&
            (!type || resource.type === type) &&
            (!theme || resource.theme === theme)
          );
        }

        return (
          resource.workshop_id !== null &&
          (!workshopId || resource.workshop_id === workshopId)
        );
      }),
    [resources, tab, theme, type, workshopId]
  );

  function selectTab(nextTab: ResourceTab) {
    setTab(nextTab);
    setType(null);
    setTheme(null);
    setWorkshopId(null);
  }

  const filterPanel = (
    <aside className="rounded-[10px] border border-slate-200 bg-white p-4 sm:p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
        Filter resources
      </p>
      {tab === "shared" ? (
        <div className="mt-5 space-y-6">
          <FilterGroup
            activeValue={type}
            label="Type"
            onChange={setType}
            options={RESOURCE_TYPES}
          />
          <FilterGroup
            activeValue={theme}
            label="Theme"
            onChange={setTheme}
            options={RESOURCE_THEMES}
          />
        </div>
      ) : (
        <div className="mt-5">
          <FilterGroup
            activeValue={workshopId}
            label="Workshop"
            onChange={setWorkshopId}
            options={workshops.map((workshop) => ({
              label: `${workshop.number}. ${workshop.title}`,
              value: workshop.id,
            }))}
          />
        </div>
      )}
    </aside>
  );

  return (
    <div className="mt-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex rounded-full border border-slate-200 bg-white p-1">
          <TabButton active={tab === "shared"} onClick={() => selectTab("shared")}>
            Shared resources
          </TabButton>
          <TabButton active={tab === "workshop"} onClick={() => selectTab("workshop")}>
            Workshop resources
          </TabButton>
        </div>
        <Button
          className="md:hidden"
          onClick={() => setFiltersOpen((open) => !open)}
          size="sm"
          type="button"
          variant="outline"
        >
          <SlidersHorizontal aria-hidden="true" />
          Filters
        </Button>
      </div>

      {filtersOpen ? <div className="mt-4 md:hidden">{filterPanel}</div> : null}

      <div className="mt-8 grid gap-8 md:grid-cols-[188px_minmax(0,1fr)]">
        <div className="hidden md:block md:sticky md:top-44 md:self-start">
          {filterPanel}
        </div>
        <div>
          <p className="text-sm text-slate-500">
            {visibleResources.length}{" "}
            {visibleResources.length === 1 ? "resource" : "resources"}
          </p>
          <div className="mt-3 space-y-3">
            {visibleResources.map((resource) => (
              <ResourceRow key={resource.id} resource={resource} />
            ))}
          </div>
          {visibleResources.length === 0 ? (
            <div className="mt-3 rounded-[10px] border border-dashed border-slate-300 bg-white px-5 py-10 text-center">
              <FileText className="mx-auto size-6 text-slate-400" aria-hidden="true" />
              <p className="mt-3 font-semibold text-[#0d1f3c]">
                No resources match these filters.
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Try another filter or check back when new materials are shared.
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function FilterGroup({
  label,
  options,
  activeValue,
  onChange,
}: {
  label: string;
  options: readonly string[] | { label: string; value: string }[];
  activeValue: string | null;
  onChange: (value: string | null) => void;
}) {
  return (
    <div>
      <p className="px-2 text-sm font-semibold text-[#0d1f3c]">{label}</p>
      <div className="mt-2 grid gap-1">
        <FilterButton active={activeValue === null} onClick={() => onChange(null)}>
          All
        </FilterButton>
        {options.map((option) => {
          const label = typeof option === "string" ? option : option.label;
          const value = typeof option === "string" ? option : option.value;
          return (
            <FilterButton active={activeValue === value} key={value} onClick={() => onChange(value)}>
              {label}
            </FilterButton>
          );
        })}
      </div>
    </div>
  );
}

function FilterButton({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      className={cn(
        "w-full rounded-lg px-2.5 py-1.5 text-left text-sm transition-colors",
        active
          ? "bg-scph-blue font-semibold text-white"
          : "text-slate-700 hover:bg-slate-100"
      )}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}

function TabButton({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      className={cn(
        "rounded-full px-4 py-1.5 text-sm font-semibold transition-colors",
        active
          ? "bg-scph-blue text-white"
          : "text-slate-600 hover:bg-slate-100 hover:text-scph-blue"
      )}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}

function ResourceRow({ resource }: { resource: MpnResource }) {
  const workshop = getResourceWorkshop(resource);
  return (
    <Link
      className="group flex items-start gap-4 rounded-[10px] border border-slate-200 bg-white p-4 transition-colors hover:border-scph-blue/40 sm:p-5"
      href={`/community/mpn/resources/${resource.id}`}
    >
      <div className="grid size-10 shrink-0 place-items-center rounded-lg bg-scph-blue/10 text-scph-blue">
        <FileText aria-hidden="true" size={20} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="scph">{resource.type}</Badge>
          {workshop ? <Badge variant="scphGreen">Workshop {workshop.number}</Badge> : null}
        </div>
        <h2 className="mt-2 font-heading text-lg font-semibold text-[#0d1f3c] group-hover:text-scph-blue">
          {resource.title}
        </h2>
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500">
          <span>{resource.theme}</span>
          {resource.source ? <span>{resource.source}</span> : null}
          {resource.published_date ? (
            <span className="inline-flex items-center gap-1">
              <CalendarDays aria-hidden="true" size={14} />
              {new Intl.DateTimeFormat("en", {
                month: "short",
                year: "numeric",
              }).format(new Date(`${resource.published_date}T00:00:00`))}
            </span>
          ) : null}
        </div>
      </div>
      <span className="hidden items-center gap-1 text-sm font-semibold text-scph-blue sm:inline-flex">
        View <Download aria-hidden="true" size={16} />
      </span>
    </Link>
  );
}
