import { cn } from "@/lib/utils";
import { ScrollReveal } from "@/components/motion/ScrollReveal";

type Theme = "scph" | "gtp";

interface SectionWrapperProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  theme?: Theme;
  className?: string;
  contentClassName?: string;
  /** "default" = white bg, "muted" = subtle tinted bg, "dark" = brand dark bg */
  background?: "default" | "muted" | "dark";
  id?: string;
  /** Enable scroll-triggered reveal animation (default: true for both scph and gtp) */
  scrollReveal?: boolean;
}

const accentClasses: Record<Theme, string> = {
  scph: "bg-scph-green",
  gtp: "bg-gtp-teal",
};

const titleClasses: Record<Theme, string> = {
  scph: "text-scph-blue",
  gtp: "text-gtp-dark-teal",
};

const subtitleClasses: Record<Theme, string> = {
  scph: "text-scph-dark-green",
  gtp: "text-gtp-teal",
};

const mutedBgClasses: Record<Theme, string> = {
  scph: "bg-scph-blue/5",
  // Opaque surface: transparent /5 tints disappear on GTP layout’s dark-teal <main>,
  // which made dark-teal headings effectively invisible.
  gtp: "bg-slate-100",
};

const darkBgClasses: Record<Theme, string> = {
  scph: "bg-scph-blue text-white",
  gtp: "bg-gtp-dark-teal text-white",
};

export function SectionWrapper({
  title,
  subtitle,
  children,
  theme = "scph",
  className,
  contentClassName,
  background = "default",
  id,
  scrollReveal = true,
}: SectionWrapperProps) {
  const bgClass =
    background === "muted"
      ? mutedBgClasses[theme]
      : background === "dark"
        ? darkBgClasses[theme]
        : "bg-white";

  const isDark = background === "dark";
  const isGtpDark = isDark && theme === "gtp";
  const isGtpDefault = !isDark && theme === "gtp" && background !== "muted";
  const isGtpMuted = !isDark && theme === "gtp" && background === "muted";

  const content = (
    <>
      {(title || subtitle) && (
        <div className="mb-12">
          {subtitle && (
            <div
              className={cn(
                "mb-4 flex items-center gap-3",
                isDark ? "text-white/60" : subtitleClasses[theme]
              )}
            >
              <span className="h-px w-8 bg-current opacity-60 shrink-0" />
              <span className="text-xs font-semibold uppercase tracking-[0.15em]">
                {subtitle}
              </span>
            </div>
          )}
          {title && (
            <div>
              <h2
                className={cn(
                  "font-heading text-3xl font-bold leading-tight md:text-4xl lg:text-5xl",
                  isDark ? "text-white" : titleClasses[theme]
                )}
              >
                {title}
              </h2>
              <div
                className={cn(
                  "mt-4 h-1 w-20 rounded-full",
                  isDark ? "bg-white/30" : accentClasses[theme]
                )}
              />
            </div>
          )}
        </div>
      )}
      {children}
    </>
  );

  return (
    <section
      id={id}
      className={cn(
        "py-20 px-4 md:px-6 lg:px-8 md:py-28",
        (isGtpDark || isGtpDefault || isGtpMuted) && "relative overflow-hidden",
        bgClass,
        className,
      )}
    >
      {isGtpDark && (
        <>
          {/* Dot-grid texture — same pattern as the hero */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.055]"
            style={{
              backgroundImage:
                "radial-gradient(circle, white 1.5px, transparent 1.5px)",
              backgroundSize: "28px 28px",
            }}
          />
          {/* Teal radial bloom — upper-left quadrant */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_12%_25%,rgba(0,156,180,0.28),transparent_52%)]" />
          {/* Green radial bloom — lower-right quadrant */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_88%_80%,rgba(134,188,37,0.11),transparent_48%)]" />
        </>
      )}

      {/* ── Light GTP sections: default (white) ──────────────────────── */}
      {isGtpDefault && (
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(155deg, rgba(0,156,180,0.04) 0%, transparent 48%, rgba(134,188,37,0.03) 100%)",
          }}
        />
      )}

      {/* ── Light GTP sections: muted (slate-100) ────────────────────── */}
      {isGtpMuted && (
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(335deg, rgba(219,93,0,0.03) 0%, transparent 48%, rgba(0,156,180,0.04) 100%)",
          }}
        />
      )}

      <div
        className={cn(
          "mx-auto max-w-7xl overflow-visible",
          (isGtpDark || isGtpDefault || isGtpMuted) && "relative z-10",
          contentClassName,
        )}
      >
        {scrollReveal ? (
          <ScrollReveal amount={0.05}>{content}</ScrollReveal>
        ) : (
          content
        )}
      </div>
    </section>
  );
}
