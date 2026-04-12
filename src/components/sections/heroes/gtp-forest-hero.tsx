import Image from "next/image";
import { cn } from "@/lib/utils";

const FOREST_BG = "/images/gtp/forest-bg.jpg";

const titleSizeClasses = {
  default: "text-3xl sm:text-4xl md:text-5xl lg:text-6xl",
  compact: "text-2xl sm:text-3xl md:text-4xl lg:text-5xl",
} as const;

export type GtpForestHeroProps = {
  eyebrow?: string;
  title: React.ReactNode;
  /** Primary line under accent (text-base md:text-lg) */
  lede?: string;
  /** Secondary line (smaller, e.g. programme disclaimer) */
  ledeSecondary?: string;
  /** Submissions uses a slightly smaller heading scale */
  titleSize?: keyof typeof titleSizeClasses;
  /** `compact` pb-16 (programmes, register, submissions, get-involved); `spacious` pb-24 (organising committee) */
  bottomSpacing?: "compact" | "spacious";
};

export function GtpForestHero({
  eyebrow = "GTP 2026",
  title,
  lede,
  ledeSecondary,
  titleSize = "default",
  bottomSpacing = "compact",
}: GtpForestHeroProps) {
  return (
    <div
      className={cn(
        "relative min-h-104 overflow-hidden px-4 pt-40 text-center sm:min-h-112",
        bottomSpacing === "compact" ? "pb-16" : "pb-24",
        bottomSpacing === "spacious" && "md:min-h-120",
      )}
    >
      <Image
        src={FOREST_BG}
        alt=""
        fill
        className="object-cover object-center"
        sizes="100vw"
        priority
        fetchPriority="high"
      />
      <div className="absolute inset-0 bg-gtp-dark-teal/75" />

      <div className="relative mx-auto max-w-4xl">
        <span className="inline-block rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-white/80 backdrop-blur-sm">
          {eyebrow}
        </span>
        <h1
          className={cn(
            "mt-6 font-heading font-bold leading-tight text-white",
            titleSizeClasses[titleSize],
          )}
        >
          {title}
        </h1>
        <div className="mx-auto mt-6 h-1 w-20 rounded-full bg-gtp-teal" />
        {lede ? (
          <p className="mx-auto mt-6 max-w-2xl text-base text-white/70 md:text-lg">{lede}</p>
        ) : null}
        {ledeSecondary ? (
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-white/55 md:text-base">
            {ledeSecondary}
          </p>
        ) : null}
      </div>
    </div>
  );
}
