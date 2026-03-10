import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SectionWrapper } from "@/components/shared/section-wrapper";

// ─── Hero ─────────────────────────────────────────────────────────────────────

function RegisterHero() {
  return (
    <div className="relative overflow-hidden px-4 pb-16 pt-40 text-center">
      <Image
        src="/images/gtp/forest-bg.jpg"
        alt=""
        fill
        className="object-cover object-center"
        priority
      />
      <div className="absolute inset-0 bg-gtp-dark-teal/75" />
      <div className="relative mx-auto max-w-4xl">
        <span className="inline-block rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-white/80 backdrop-blur-sm">
          GTP 2026
        </span>
        <h1 className="mt-6 font-heading text-3xl font-bold leading-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">
          Register Now
        </h1>
        <div className="mx-auto mt-6 h-1 w-20 rounded-full bg-gtp-teal" />
        <p className="mx-auto mt-6 max-w-2xl text-base text-white/70 md:text-lg">
          12–15 October 2026 · Kuala Lumpur, Malaysia
        </p>
      </div>
    </div>
  );
}

// ─── Registration Section ────────────────────────────────────────────────────

function RegistrationSection() {
  return (
    <SectionWrapper
      title="Join the Conference"
      subtitle="Registration"
      theme="gtp"
      background="default"
    >
      <div className="mx-auto max-w-3xl">
        <div className="rounded-2xl border-2 border-gtp-teal/20 bg-gtp-teal/5 px-8 py-10 text-center ring-1 ring-gtp-dark-teal/5 md:px-12 md:py-14">
          <p className="text-xl font-medium leading-relaxed text-gtp-dark-teal md:text-2xl">
            Registration for the Global Tipping Points Conference 2026 will open
            soon.
          </p>
          <p className="mt-4 text-lg font-semibold text-gtp-teal md:text-xl">
            Early bird rates will be available for a limited time.
          </p>
          <p className="mt-6 text-lg leading-relaxed text-gray-600 md:text-xl">
            Sign up below to be notified when registration opens, or get in touch
            if you have questions about group bookings, scholarships, or
            partnership opportunities.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Button variant="gtpSecondary" size="lg" className="text-base" asChild>
              <Link href="/events/gtp-2026/get-involved#contact">
                Notify Me When Registration Opens
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-2 border-gtp-teal text-base font-semibold text-gtp-teal hover:bg-gtp-teal/10"
              asChild
            >
              <Link href="/events/gtp-2026/get-involved#contact">
                Contact Us
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function GtpRegisterPage() {
  return (
    <>
      <RegisterHero />
      <RegistrationSection />
    </>
  );
}
