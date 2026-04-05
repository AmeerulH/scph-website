import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { ScphPageHero } from "@/components/sections/heroes";
import { TwoColumnCopyBenefits } from "@/components/sections/two-column-copy-benefits";
import { RenderSectionBlocks } from "@/components/sections/render-section-block";
import { getScphNetworkPage } from "@/sanity/scph-pages";

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

export const dynamic = "force-dynamic";

// ─── Who Qualifies + Benefits ─────────────────────────────────────────────────

const benefits = [
  "Opportunity to get your organisation, social enterprise, or project featured within SCPH's research themes",
  "Opportunity to write for our Medium page",
  "Exclusive access to SCPH's partners' events",
  "Early-bird access to SCPH events",
  "Access to an online community of like-minded individuals",
];

function CommunitySection() {
  return (
    <SectionWrapper theme="scph" background="default">
      <TwoColumnCopyBenefits
        copy={{
          eyebrow: "Who Qualifies",
          title: "Anyone Who Shares Our Vision",
          children: (
            <>
              <p className="mt-6 text-lg leading-relaxed text-gray-600">
                Anyone who shares our vision for a world where the health of humans
                and the planet thrive in harmony!
              </p>
              <p className="mt-4 text-base leading-relaxed text-gray-500">
                Whether you are a student, researcher, policymaker, or community
                advocate — there is a place for you in the planetary health
                movement.
              </p>
            </>
          ),
        }}
        benefits={{
          eyebrow: "What You Get",
          title: "Member Benefits",
          items: benefits,
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

  return (
    <>
      <ScphPageHero
        eyebrow="Network"
        title="Join the Planetary Health Community"
        lede="The global planetary health community is a diverse group of people committed to contributing to a healthier future through policy reforms, research, innovative solutions, advocacy efforts, and more."
      />
      <RenderSectionBlocks blocks={networkCms?.sections ?? []} />
      <CommunitySection />
      <SignUpSection />
    </>
  );
}
