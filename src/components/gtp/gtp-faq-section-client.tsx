"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { AnimatePresence, motion } from "motion/react";
import type { Gtp2026FaqGroupWithItems } from "@/sanity/gtp-stage1";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { FaqAnswerBody } from "@/components/gtp/faq-answer-body";
import { cn } from "@/lib/utils";

/** Slightly bouncy spring for FAQ expand/collapse */
const faqAccordionSpring = {
  type: "spring" as const,
  stiffness: 420,
  damping: 14,
  mass: 0.55,
};

const faqAccordionReduced = {
  duration: 0.18,
  ease: [0.25, 0.1, 0.25, 1] as const,
};

type Props = {
  groups: Gtp2026FaqGroupWithItems[];
};

export function GtpFaqSectionClient({ groups }: Props) {
  const baseId = useId();
  const prefersReducedMotion = useReducedMotion();
  const tabRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const accordionTransition = prefersReducedMotion
    ? faqAccordionReduced
    : faqAccordionSpring;
  const [activeGroupId, setActiveGroupId] = useState(() => groups[0]?._id ?? "");
  const [openFaqId, setOpenFaqId] = useState<string | null>(null);

  useEffect(() => {
    if (groups.length === 0) return;
    if (!groups.some((g) => g._id === activeGroupId)) {
      setActiveGroupId(groups[0]._id);
      setOpenFaqId(null);
    }
  }, [groups, activeGroupId]);

  useEffect(() => {
    const el = tabRefs.current.get(activeGroupId);
    el?.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      inline: "nearest",
      block: "nearest",
    });
  }, [activeGroupId, prefersReducedMotion]);

  const activeGroup =
    groups.find((g) => g._id === activeGroupId) ?? groups[0] ?? null;

  const selectTab = useCallback((id: string) => {
    setActiveGroupId(id);
    setOpenFaqId(null);
  }, []);

  const onTabKeyDown = useCallback(
    (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
      if (groups.length < 2) return;
      let next = index;
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        next = (index + 1) % groups.length;
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        next = (index - 1 + groups.length) % groups.length;
      } else if (e.key === "Home") {
        e.preventDefault();
        next = 0;
      } else if (e.key === "End") {
        e.preventDefault();
        next = groups.length - 1;
      } else {
        return;
      }
      const id = groups[next]?._id;
      if (id) {
        selectTab(id);
        tabRefs.current.get(id)?.focus();
      }
    },
    [groups, selectTab],
  );

  if (!activeGroup) {
    return null;
  }

  const panelId = `${baseId}-panel`;
  const showTabs = groups.length > 1;

  return (
    <div className="mx-auto w-full min-w-0 max-w-4xl md:max-w-5xl">
      {showTabs ? (
        <div className="mb-6 flex w-full min-w-0 justify-center">
          <div className="max-w-full min-w-0 touch-pan-x overflow-x-auto overflow-y-visible overscroll-x-contain pb-1 [-webkit-overflow-scrolling:touch]">
            <div
              role="tablist"
              aria-label="FAQ categories"
              className="mx-auto flex w-max flex-nowrap gap-1 rounded-xl border border-gtp-dark-teal/15 bg-white/80 p-1 shadow-sm ring-1 ring-gtp-dark-teal/5"
            >
            {groups.map((g, index) => {
              const selected = g._id === activeGroupId;
              const tabId = `${baseId}-tab-${g._id}`;
              return (
                <button
                  key={g._id}
                  id={tabId}
                  ref={(el) => {
                    if (el) tabRefs.current.set(g._id, el);
                    else tabRefs.current.delete(g._id);
                  }}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  aria-controls={panelId}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => selectTab(g._id)}
                  onKeyDown={(e) => onTabKeyDown(e, index)}
                  className={cn(
                    "shrink-0 whitespace-nowrap rounded-lg px-3 py-2.5 text-center text-xs font-semibold leading-snug transition-colors duration-200 sm:px-4 sm:text-sm",
                    selected
                      ? "bg-gtp-teal text-white shadow-sm"
                      : "text-gtp-dark-teal/75 hover:bg-gtp-dark-teal/5 hover:text-gtp-dark-teal",
                  )}
                >
                  {g.title}
                </button>
              );
            })}
            </div>
          </div>
        </div>
      ) : null}

      <div
        id={panelId}
        role="tabpanel"
        aria-labelledby={
          showTabs ? `${baseId}-tab-${activeGroup._id}` : undefined
        }
        className="min-w-0 space-y-3"
      >
        {activeGroup.items.map((item) => {
          const open = openFaqId === item._id;
          return (
            <div
              key={item._id}
              data-open={open}
              className={cn(
                "min-w-0 rounded-2xl border border-gtp-dark-teal/10 bg-white/90 shadow-sm ring-1 ring-gtp-dark-teal/5 transition-shadow duration-300",
                open && "shadow-md",
              )}
            >
              <h3 className="m-0 min-w-0 text-base font-semibold">
                <button
                  type="button"
                  aria-expanded={open}
                  id={`${baseId}-faq-${item._id}`}
                  aria-controls={`${baseId}-faq-body-${item._id}`}
                  onClick={() =>
                    setOpenFaqId((prev) => (prev === item._id ? null : item._id))
                  }
                  className="flex w-full min-w-0 cursor-pointer list-none items-start justify-between gap-3 rounded-2xl px-4 py-4 text-left font-heading text-lg font-semibold text-gtp-dark-teal outline-none focus-visible:ring-2 focus-visible:ring-gtp-teal/40"
                >
                  <span className="min-w-0 flex-1 wrap-anywhere">
                    {item.question.trim()}
                  </span>
                  <motion.span
                    aria-hidden
                    animate={{ rotate: open ? 180 : 0 }}
                    transition={accordionTransition}
                    className="mt-1 inline-block shrink-0 text-gtp-teal"
                  >
                    ▼
                  </motion.span>
                </button>
              </h3>
              <AnimatePresence initial={false}>
                {open ? (
                  <motion.div
                    key="panel"
                    id={`${baseId}-faq-body-${item._id}`}
                    role="region"
                    aria-labelledby={`${baseId}-faq-${item._id}`}
                    initial={
                      prefersReducedMotion
                        ? { opacity: 0 }
                        : { height: 0, opacity: 0, y: -6 }
                    }
                    animate={
                      prefersReducedMotion
                        ? { opacity: 1 }
                        : { height: "auto", opacity: 1, y: 0 }
                    }
                    exit={
                      prefersReducedMotion
                        ? { opacity: 0 }
                        : { height: 0, opacity: 0, y: -4 }
                    }
                    transition={accordionTransition}
                    className="min-w-0 overflow-hidden border-gtp-dark-teal/8 text-base leading-relaxed text-gray-600"
                  >
                    <div className="min-w-0 border-t border-gtp-dark-teal/8 px-4 pb-4 pt-3">
                      <FaqAnswerBody text={item.answer} />
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
