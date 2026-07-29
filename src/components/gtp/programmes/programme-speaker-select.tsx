"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { ChevronDown, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SpeakerOption } from "./programme-speaker-filter";
import { normalizeSpeakerName } from "./programme-speaker-filter";

function getPanelStyle(trigger: HTMLElement): React.CSSProperties {
  const rect = trigger.getBoundingClientRect();
  const gap = 6;
  const maxPanelHeight = 280;
  const spaceBelow = window.innerHeight - rect.bottom - gap;
  const spaceAbove = rect.top - gap;
  const openUp = spaceBelow < Math.min(maxPanelHeight, 200) && spaceAbove > spaceBelow;
  const height = Math.min(maxPanelHeight, Math.max(openUp ? spaceAbove : spaceBelow, 120));

  return {
    position: "fixed",
    left: rect.left,
    width: Math.max(rect.width, 220),
    zIndex: 80,
    maxHeight: height,
    ...(openUp
      ? { bottom: window.innerHeight - rect.top + gap }
      : { top: rect.bottom + gap }),
  };
}

export function ProgrammeSpeakerSelect({
  options,
  value,
  onChange,
  className,
}: {
  options: SpeakerOption[];
  /** Display name of selected speaker, or null for all. */
  value: string | null;
  onChange: (name: string | null) => void;
  className?: string;
}) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [mounted, setMounted] = React.useState(false);
  const [panelStyle, setPanelStyle] = React.useState<React.CSSProperties | null>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const triggerRef = React.useRef<HTMLDivElement>(null);
  const panelRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const listId = React.useId();

  const selected = value
    ? options.find((o) => normalizeSpeakerName(o.name) === normalizeSpeakerName(value))
    : null;

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter((o) => {
      const nameHit = o.name.toLowerCase().includes(q);
      const designationHit = o.designation?.toLowerCase().includes(q) ?? false;
      return nameHit || designationHit;
    });
  }, [options, query]);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const updatePanelPosition = React.useCallback(() => {
    const trigger = triggerRef.current;
    if (!trigger) return;
    setPanelStyle(getPanelStyle(trigger));
  }, []);

  function openMenu() {
    const trigger = triggerRef.current;
    if (trigger) {
      setPanelStyle(getPanelStyle(trigger));
    }
    setOpen(true);
  }

  function closeMenu() {
    setOpen(false);
    setQuery("");
    setPanelStyle(null);
  }

  function toggleMenu() {
    if (open) closeMenu();
    else openMenu();
  }

  React.useEffect(() => {
    if (!open) return;
    function onReposition() {
      updatePanelPosition();
    }
    window.addEventListener("resize", onReposition);
    // Capture scroll from nested containers (sidebar), but do not scroll the page ourselves.
    window.addEventListener("scroll", onReposition, true);
    return () => {
      window.removeEventListener("resize", onReposition);
      window.removeEventListener("scroll", onReposition, true);
    };
  }, [open, updatePanelPosition]);

  React.useEffect(() => {
    if (!open) return;
    function handlePointer(e: MouseEvent) {
      const target = e.target as Node;
      if (containerRef.current?.contains(target)) return;
      if (panelRef.current?.contains(target)) return;
      closeMenu();
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") closeMenu();
    }
    document.addEventListener("mousedown", handlePointer);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handlePointer);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  React.useEffect(() => {
    if (!open || !panelStyle) return;
    // Portaled input sits at end of <body> until fixed styles apply — never scroll to it.
    inputRef.current?.focus({ preventScroll: true });
  }, [open, panelStyle]);

  function selectSpeaker(name: string) {
    onChange(name);
    closeMenu();
  }

  function clearSpeaker(e: React.MouseEvent) {
    e.stopPropagation();
    onChange(null);
    closeMenu();
  }

  const dropdown =
    open && mounted && panelStyle
      ? createPortal(
          <div
            ref={panelRef}
            style={panelStyle}
            className="flex flex-col overflow-hidden rounded-lg border border-white/15 bg-gtp-dark-teal shadow-xl"
            role="presentation"
          >
            <div className="shrink-0 border-b border-white/10 p-2">
              <div className="relative">
                <Search
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/45"
                  aria-hidden
                />
                <input
                  ref={inputRef}
                  type="text"
                  autoComplete="off"
                  placeholder="Search speakers…"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full rounded-md border border-white/15 bg-white/10 py-2 pl-10 pr-3 text-sm text-white placeholder:text-white/40 focus:border-gtp-teal focus:outline-none focus:ring-1 focus:ring-gtp-teal"
                  aria-autocomplete="list"
                  aria-controls={listId}
                />
              </div>
            </div>

            <ul
              id={listId}
              role="listbox"
              aria-label="Speakers"
              className="min-h-0 flex-1 overflow-y-auto py-1"
            >
              <li role="option" aria-selected={!selected}>
                <button
                  type="button"
                  className={cn(
                    "w-full px-3 py-2 text-left text-sm transition-colors",
                    !selected
                      ? "bg-gtp-teal/30 text-white"
                      : "text-white/75 hover:bg-white/10 hover:text-white",
                  )}
                  onClick={() => {
                    onChange(null);
                    closeMenu();
                  }}
                >
                  All speakers
                </button>
              </li>
              {filtered.length === 0 ? (
                <li className="px-3 py-2.5 text-sm text-white/45">No speakers found</li>
              ) : (
                filtered.map((option) => {
                  const isActive =
                    !!selected &&
                    normalizeSpeakerName(selected.name) ===
                      normalizeSpeakerName(option.name);
                  return (
                    <li
                      key={normalizeSpeakerName(option.name)}
                      role="option"
                      aria-selected={isActive}
                    >
                      <button
                        type="button"
                        className={cn(
                          "w-full px-3 py-2 text-left text-sm font-medium transition-colors",
                          isActive
                            ? "bg-gtp-teal/30 text-white"
                            : "text-white/80 hover:bg-white/10 hover:text-white",
                        )}
                        onClick={() => selectSpeaker(option.name)}
                      >
                        {option.name}
                      </button>
                    </li>
                  );
                })
              )}
            </ul>
          </div>,
          document.body,
        )
      : null;

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <div
        ref={triggerRef}
        className={cn(
          "flex w-full items-center gap-1 rounded-lg border transition-colors",
          selected
            ? "border-gtp-teal/50 bg-gtp-teal/20 text-white"
            : "border-white/15 bg-white/5 text-white/80",
        )}
      >
        <button
          type="button"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={listId}
          onClick={toggleMenu}
          className={cn(
            "flex min-w-0 flex-1 items-center gap-3 px-3 py-2 text-left text-sm",
            !selected && "hover:text-white",
          )}
        >
          <Search className="h-3.5 w-3.5 shrink-0 opacity-60" aria-hidden />
          <span className="min-w-0 flex-1 truncate font-medium leading-none">
            {selected ? selected.name : "All speakers"}
          </span>
          {!selected ? (
            <ChevronDown
              className={cn(
                "h-3.5 w-3.5 shrink-0 opacity-60 transition-transform duration-150",
                open && "rotate-180",
              )}
              aria-hidden
            />
          ) : null}
        </button>
        {selected ? (
          <button
            type="button"
            aria-label="Clear speaker filter"
            onClick={clearSpeaker}
            className="mr-1.5 rounded p-1 text-white/70 hover:bg-white/15 hover:text-white"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        ) : null}
      </div>
      {dropdown}
    </div>
  );
}
