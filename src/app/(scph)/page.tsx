import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <>
      {/* Full-screen hero placeholder — navbar floats over this */}
      <section className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-scph-blue via-scph-dark-green to-scph-blue-dark px-4 text-center">
        <div className="max-w-3xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-scph-green">
            Sunway University · Kuala Lumpur
          </p>
          <h1 className="font-heading text-6xl font-bold leading-tight text-white md:text-7xl">
            Sunway Centre for<br />Planetary Health
          </h1>
          <p className="mt-6 text-xl leading-relaxed text-white/75">
            A Think-and-Do tank committed to research and advocacy that advances
            planetary health.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Button variant="scphSecondary" size="lg" asChild>
              <Link href="/about-us">
                Explore Our Work <ArrowRight />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-white/60 bg-white/15 text-white backdrop-blur-sm hover:bg-white/25 hover:border-white/80 hover:text-white"
              asChild
            >
              <Link href="/events/gtp-2026">GTP 2026</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
