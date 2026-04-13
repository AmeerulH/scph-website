import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { ContactForm } from "./contact-form";
import { GtpForestHero } from "@/components/sections/heroes";
import { TwoColumnTextImages } from "@/components/sections/two-column-text-images";
import type { GtpGetInvolvedResolvedCopy } from "@/sanity/gtp-stage2";
import {
  getGtp2026GetInvolvedPage,
  mergeGtpGetInvolvedCopy,
} from "@/sanity/gtp-stage2";

const description =
  "Partner, sponsor, or volunteer for Global Tipping Points Conference 2026—get in touch with the Sunway Centre for Planetary Health team.";

export const metadata: Metadata = {
  title: "Get involved",
  description,
  alternates: { canonical: "/events/gtp-2026/get-involved" },
  openGraph: {
    title: "Get involved | GTP 2026",
    description,
    url: "/events/gtp-2026/get-involved",
  },
  twitter: {
    card: "summary_large_image",
    title: "Get involved with GTP 2026",
    description,
  },
};

export const revalidate = 60;

function ContactUsSection({
  contact,
}: {
  contact: GtpGetInvolvedResolvedCopy["contact"];
}) {
  return (
    <SectionWrapper
      title={contact.sectionTitle}
      subtitle={contact.sectionSubtitle}
      theme="gtp"
      background="default"
      id="contact"
    >
      <TwoColumnTextImages
        align="start"
        text={
          <>
            <p className="text-base leading-relaxed text-gray-600">
              {contact.intro}
            </p>
            <div className="mt-6 space-y-3">
              <p className="text-sm font-semibold text-gtp-dark-teal">
                {contact.orgName}
              </p>
              <p className="text-sm text-gray-500">{contact.orgAddress}</p>
              <p className="text-sm text-gray-500">{contact.conferenceDates}</p>
            </div>
          </>
        }
        media={
          <div className="rounded-2xl border border-gray-100 bg-gray-50/50 p-6 shadow-sm">
            <ContactForm />
          </div>
        }
      />
    </SectionWrapper>
  );
}

function PartnershipSection({
  partnership,
}: {
  partnership: GtpGetInvolvedResolvedCopy["partnership"];
}) {
  return (
    <SectionWrapper
      title={partnership.sectionTitle}
      subtitle={partnership.sectionSubtitle}
      theme="gtp"
      background="muted"
      id="partnership"
    >
      <div className="mx-auto max-w-3xl">
        <div className="rounded-2xl border-2 border-gtp-teal/20 bg-white px-8 py-10 text-center shadow-lg ring-1 ring-gtp-dark-teal/5 md:px-12 md:py-14">
          <p className="text-xl font-medium leading-relaxed text-gtp-dark-teal md:text-2xl">
            {partnership.lead}
          </p>
          <p className="mt-4 text-lg font-semibold text-gtp-teal md:text-xl">
            {partnership.highlight}
          </p>
          <p className="mt-6 text-lg leading-relaxed text-gray-600 md:text-xl">
            {partnership.body}
          </p>
          <Button
            variant="gtpSecondary"
            size="lg"
            className="mt-10 text-base"
            asChild
          >
            <Link href="/events/gtp-2026/get-involved#contact">
              {partnership.ctaLabel}
            </Link>
          </Button>
        </div>
      </div>
    </SectionWrapper>
  );
}

export default async function GtpGetInvolvedPage() {
  const cms = await getGtp2026GetInvolvedPage().catch(() => null);
  const copy = mergeGtpGetInvolvedCopy(cms);

  return (
    <>
      <GtpForestHero title={copy.heroTitle} lede={copy.heroLede} />
      <ContactUsSection contact={copy.contact} />
      <PartnershipSection partnership={copy.partnership} />
    </>
  );
}
