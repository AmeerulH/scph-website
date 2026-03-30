import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { ContactForm } from "./contact-form";

// ─── Hero ─────────────────────────────────────────────────────────────────────

function GetInvolvedHero() {
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
          Get Involved
        </h1>
        <div className="mx-auto mt-6 h-1 w-20 rounded-full bg-gtp-teal" />
        <p className="mx-auto mt-6 max-w-2xl text-base text-white/70 md:text-lg">
          Connect with us. Partner with us. Collaborate for change.
        </p>
      </div>
    </div>
  );
}

// ─── Contact Us ────────────────────────────────────────────────────────────────

function ContactUsSection() {
  return (
    <SectionWrapper
      title="Get in Touch"
      subtitle="Contact Us"
      theme="gtp"
      background="default"
      id="contact"
    >
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        <div>
          <p className="text-base leading-relaxed text-gray-600">
            Have questions about the Global Tipping Points Conference 2026?
            Want to learn more about registration, submissions, or partnership
            opportunities? We&apos;d love to hear from you.
          </p>
          <div className="mt-6 space-y-3">
            <p className="text-sm font-semibold text-gtp-dark-teal">
              Sunway Centre for Planetary Health
            </p>
            <p className="text-sm text-gray-500">
              Sunway University, Kuala Lumpur, Malaysia
            </p>
            <p className="text-sm text-gray-500">
              Conference: 12–15 October 2026
            </p>
          </div>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-gray-50/50 p-6 shadow-sm">
          <ContactForm />
        </div>
      </div>
    </SectionWrapper>
  );
}

// ─── Partnership ──────────────────────────────────────────────────────────────

function PartnershipSection() {
  return (
    <SectionWrapper
      title="Partner with Us"
      subtitle="Partnership"
      theme="gtp"
      background="muted"
      id="partnership"
    >
      <div className="mx-auto max-w-3xl">
        <div className="rounded-2xl border-2 border-gtp-teal/20 bg-white px-8 py-10 text-center shadow-lg ring-1 ring-gtp-dark-teal/5 md:px-12 md:py-14">
          <p className="text-xl font-medium leading-relaxed text-gtp-dark-teal md:text-2xl">
            The Global Tipping Points Conference 2026 brings together science,
            finance, culture and policy from across Asia and the world.
          </p>
          <p className="mt-4 text-lg font-semibold text-gtp-teal md:text-xl">
            We welcome organisations that share our commitment to positive
            tipping points and planetary health.
          </p>
          <p className="mt-6 text-lg leading-relaxed text-gray-600 md:text-xl">
            Partnership opportunities include sponsorship, co-hosting sessions,
            exhibition space, and visibility in our communications.
          </p>
          <Button
            variant="gtpSecondary"
            size="lg"
            className="mt-10 text-base"
            asChild
          >
            <Link href="/events/gtp-2026/get-involved#contact">
              Inquire about Partnership
            </Link>
          </Button>
        </div>
      </div>
    </SectionWrapper>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function GtpGetInvolvedPage() {
  return (
    <>
      <GetInvolvedHero />
      <ContactUsSection />
      <PartnershipSection />
    </>
  );
}
