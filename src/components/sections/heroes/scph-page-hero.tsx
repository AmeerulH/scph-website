import Image from "next/image";
import { cn } from "@/lib/utils";

const DEFAULT_FOREST_BG =
  "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&q=80";

export type ScphPageHeroProps = {
  eyebrow: string;
  title: React.ReactNode;
  /** Optional paragraph under the green accent line */
  lede?: string;
  /**
   * `solid-blue` — research / media / network style.
   * `forest-overlay` — about-us style (image + blue wash).
   */
  variant?: "solid-blue" | "forest-overlay";
  /** Used when `variant` is `forest-overlay` */
  forestImageSrc?: string;
  forestImageAlt?: string;
};

export function ScphPageHero({
  eyebrow,
  title,
  lede,
  variant = "solid-blue",
  forestImageSrc = DEFAULT_FOREST_BG,
  forestImageAlt = "Forest background",
}: ScphPageHeroProps) {
  const content = (
    <div className="relative z-10 mx-auto max-w-4xl">
      <span className="inline-block rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-white/80 backdrop-blur-sm">
        {eyebrow}
      </span>
      <h1 className="mt-6 font-heading text-3xl font-bold leading-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">
        {title}
      </h1>
      <div className="mx-auto mt-6 h-1 w-20 rounded-full bg-scph-green" />
      {lede ? (
        <p className="mx-auto mt-6 max-w-2xl text-lg text-white/70">{lede}</p>
      ) : null}
    </div>
  );

  if (variant === "forest-overlay") {
    return (
      <div className="relative min-h-[50vh] overflow-hidden px-4 pb-24 pt-40 text-center">
        <Image
          src={forestImageSrc}
          alt={forestImageAlt}
          fill
          className="object-cover object-center"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-scph-blue/80" />
        {content}
      </div>
    );
  }

  return <div className="bg-scph-blue px-4 pb-24 pt-40 text-center">{content}</div>;
}
