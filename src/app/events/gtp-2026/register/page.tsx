import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { GtpForestHero } from "@/components/sections/heroes";
import type { GtpRegisterResolvedCopy } from "@/sanity/gtp-stage2";
import {
  getGtp2026RegisterPage,
  mergeGtpRegisterCopy,
} from "@/sanity/gtp-stage2";

const description =
  "Register for Global Tipping Points Conference 2026, 12–15 October in Kuala Lumpur—join leaders in science, finance, culture, and policy.";

export const metadata: Metadata = {
  title: "Register",
  description,
  alternates: { canonical: "/events/gtp-2026/register" },
  openGraph: {
    title: "Register | GTP 2026",
    description,
    url: "/events/gtp-2026/register",
  },
  twitter: {
    card: "summary_large_image",
    title: "Register for GTP 2026",
    description,
  },
};

export const dynamic = "force-dynamic";

function RegistrationSection({ copy }: { copy: GtpRegisterResolvedCopy }) {
  return (
    <SectionWrapper
      title={copy.sectionTitle}
      subtitle={copy.sectionSubtitle}
      theme="gtp"
      background="default"
    >
      <div className="mx-auto max-w-3xl">
        <div className="rounded-2xl border-2 border-gtp-teal/20 bg-gtp-teal/5 px-8 py-10 text-center ring-1 ring-gtp-dark-teal/5 md:px-12 md:py-14">
          <p className="text-xl font-medium leading-relaxed text-gtp-dark-teal md:text-2xl">
            {copy.bodyLead}
          </p>
          <p className="mt-4 text-lg font-semibold text-gtp-teal md:text-xl">
            {copy.bodyHighlight}
          </p>
          <p className="mt-6 text-lg leading-relaxed text-gray-600 md:text-xl">
            {copy.bodyMore}
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Button variant="gtpSecondary" size="lg" className="text-base" asChild>
              <Link href="/events/gtp-2026/get-involved#contact">
                {copy.primaryCtaLabel}
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-2 border-gtp-teal text-base font-semibold text-gtp-teal hover:bg-gtp-teal/10"
              asChild
            >
              <Link href="/events/gtp-2026/get-involved#contact">
                {copy.secondaryCtaLabel}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}

export default async function GtpRegisterPage() {
  const cms = await getGtp2026RegisterPage().catch(() => null);
  const copy = mergeGtpRegisterCopy(cms);

  return (
    <>
      <GtpForestHero title={copy.heroTitle} lede={copy.heroLede} />
      <RegistrationSection copy={copy} />
    </>
  );
}
