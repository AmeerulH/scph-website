import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { ScphPageHero } from "@/components/sections/heroes";
import { TwoColumnCopyBenefits } from "@/components/sections/two-column-copy-benefits";
import { RenderSectionBlocks } from "@/components/sections/render-section-block";
import { sectionBlocksMayRender } from "@/sanity/section-block-types";
import { getScphNetworkPage } from "@/sanity/scph-pages";
import {
  mergeScphNetworkPageBands,
  splitParagraphs,
} from "@/sanity/scph-page-bands-merge";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Network",
  description:
    "Join the planetary health community—Sunway Centre for Planetary Health networks for media professionals and youth action in Malaysia.",
  alternates: { canonical: "/network" },
  openGraph: {
    title: "Network | Sunway Centre for Planetary Health",
    description:
      "Connect with our Media Professional Network and Youth Action Network.",
    url: "/network",
  },
};

export const revalidate = 300;

function CommunitySection({
  copyEyebrow,
  copyTitle,
  copyBody,
  benefitsEyebrow,
  benefitsTitle,
  benefitItems,
}: {
  copyEyebrow: string;
  copyTitle: string;
  copyBody: string;
  benefitsEyebrow: string;
  benefitsTitle: string;
  benefitItems: string[];
}) {
  const copyParas = splitParagraphs(copyBody);
  return (
    <SectionWrapper theme="scph" background="default">
      <TwoColumnCopyBenefits
        copy={{
          eyebrow: copyEyebrow,
          title: copyTitle,
          children: (
            <>
              {copyParas.map((p, i) => (
                <p
                  key={i}
                  className={cn(
                    i === 0
                      ? "mt-6 text-lg leading-relaxed text-gray-600"
                      : "mt-4 text-base leading-relaxed text-gray-500",
                  )}
                >
                  {p}
                </p>
              ))}
            </>
          ),
        }}
        benefits={{
          eyebrow: benefitsEyebrow,
          title: benefitsTitle,
          items: benefitItems,
        }}
      />
    </SectionWrapper>
  );
}

// ─── Sign-up Form ─────────────────────────────────────────────────────────────

const backgrounds = [
  "Student",
  "Sunway Staff",
  "Academic",
  "Private Sector",
  "Government",
  "Non-profit Organisation",
];

const interests = [
  "Learning more about planetary health",
  "Joining planetary health events",
  "Connect with the planetary health community",
  "Getting my project/organisation featured",
  "Writing for SCPH's Medium",
];

function SignUpSection() {
  return (
    <SectionWrapper
      title="Sign Up to Join Our Community"
      subtitle="Get Involved"
      theme="scph"
      background="muted"
    >
      <div className="mx-auto max-w-2xl rounded-2xl bg-white p-8 shadow-md md:p-10">
        <form className="space-y-6">
          {/* Name */}
          <div>
            <label
              htmlFor="name"
              className="mb-1.5 block text-sm font-semibold text-gray-700"
            >
              Name
            </label>
            <input
              id="name"
              type="text"
              placeholder="Your full name"
              className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm text-gray-700 placeholder-gray-400 outline-none transition focus:border-scph-blue focus:ring-2 focus:ring-scph-blue/20"
            />
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="mb-1.5 block text-sm font-semibold text-gray-700"
            >
              Email address
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm text-gray-700 placeholder-gray-400 outline-none transition focus:border-scph-blue focus:ring-2 focus:ring-scph-blue/20"
            />
          </div>

          {/* Background */}
          <div>
            <label
              htmlFor="background"
              className="mb-1.5 block text-sm font-semibold text-gray-700"
            >
              Background
            </label>
            <select
              id="background"
              className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-scph-blue focus:ring-2 focus:ring-scph-blue/20"
              defaultValue=""
            >
              <option value="" disabled>
                Select your background
              </option>
              {backgrounds.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          {/* Interests */}
          <div>
            <p className="mb-3 text-sm font-semibold text-gray-700">
              I&apos;m interested in
            </p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {interests.map((interest) => (
                <label
                  key={interest}
                  className="flex cursor-pointer items-start gap-3 rounded-lg border border-gray-100 bg-gray-50 p-3 transition hover:border-scph-blue/30 hover:bg-scph-blue/5"
                >
                  <input
                    type="checkbox"
                    className="mt-0.5 h-4 w-4 shrink-0 accent-scph-blue"
                  />
                  <span className="text-sm text-gray-600">{interest}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Submit */}
          <Button variant="scph" size="lg" className="w-full" type="submit">
            Submit Interest
          </Button>

          <p className="text-center text-xs text-gray-400">
            Form submission functionality coming soon. In the meantime, reach
            out to us directly via{" "}
            <a
              href="https://sunwayuniversity.edu.my/research/planetaryhealth/get-involved"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-scph-blue hover:underline"
            >
              Sunway University
            </a>
            .
          </p>
        </form>
      </div>
    </SectionWrapper>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function NetworkPage() {
  const networkCms = await getScphNetworkPage().catch(() => null);
  const bands = mergeScphNetworkPageBands(networkCms);
  const networkSections = bands.sections;
  const showOptionalNetworkCms = sectionBlocksMayRender(networkSections);
  const c = bands.community;

  return (
    <>
      <ScphPageHero
        eyebrow="Network"
        title="Join the Planetary Health Community"
        lede="The global planetary health community is a diverse group of people committed to contributing to a healthier future through policy reforms, research, innovative solutions, advocacy efforts, and more."
      />
      <CommunitySection
        copyEyebrow={c.copyEyebrow}
        copyTitle={c.copyTitle}
        copyBody={c.copyBody}
        benefitsEyebrow={c.benefitsEyebrow}
        benefitsTitle={c.benefitsTitle}
        benefitItems={c.benefitItems}
      />
      {showOptionalNetworkCms ? (
        <RenderSectionBlocks blocks={networkSections} />
      ) : null}
      <SignUpSection />
    </>
  );
}
