import Image from "next/image";

export function ProgrammesHero() {
  return (
    <div className="relative overflow-hidden px-4 pb-16 pt-40 text-center">
      {/* Forest background */}
      <Image
        src="/images/gtp/forest-bg.jpg"
        alt=""
        fill
        className="object-cover object-center"
        priority
      />
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gtp-dark-teal/75" />

      <div className="relative mx-auto max-w-4xl">
        <span className="inline-block rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-white/80 backdrop-blur-sm">
          GTP 2026
        </span>
        <h1 className="mt-6 font-heading text-3xl font-bold leading-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">
          Conference Programme
        </h1>
        <div className="mx-auto mt-6 h-1 w-20 rounded-full bg-gtp-teal" />
        <p className="mx-auto mt-6 max-w-2xl text-base text-white/70 md:text-lg">
          12–15 October 2026 · Kuala Lumpur, Malaysia
        </p>
      </div>
    </div>
  );
}
