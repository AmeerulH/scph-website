import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionWrapper } from "@/components/shared/section-wrapper";

// ─── Hero Band ───────────────────────────────────────────────────────────────

function NetworkHero() {
  return (
    <div className="bg-scph-blue px-4 pb-24 pt-40 text-center">
      <div className="mx-auto max-w-4xl">
        <span className="inline-block rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-white/80 backdrop-blur-sm">
          Network
        </span>
        <h1 className="mt-6 font-heading text-3xl font-bold leading-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">
          Join the Planetary Health Community
        </h1>
        <div className="mx-auto mt-6 h-1 w-20 rounded-full bg-scph-green" />
        <p className="mx-auto mt-6 max-w-2xl text-lg text-white/70">
          The global planetary health community is a diverse group of people
          committed to contributing to a healthier future through policy
          reforms, research, innovative solutions, advocacy efforts, and more.
        </p>
      </div>
    </div>
  );
}

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
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        {/* Left — Who Qualifies */}
        <div>
          <div className="mb-4 flex items-center gap-3 text-scph-dark-green">
            <span className="h-px w-8 bg-current opacity-60 shrink-0" />
            <span className="text-xs font-semibold uppercase tracking-[0.15em]">
              Who Qualifies
            </span>
          </div>
          <h2 className="font-heading text-4xl font-bold leading-tight text-scph-blue md:text-5xl">
            Anyone Who Shares Our Vision
          </h2>
          <div className="mt-4 h-1 w-20 rounded-full bg-scph-green" />
          <p className="mt-6 text-lg leading-relaxed text-gray-600">
            Anyone who shares our vision for a world where the health of humans
            and the planet thrive in harmony!
          </p>
          <p className="mt-4 text-base leading-relaxed text-gray-500">
            Whether you are a student, researcher, policymaker, or community
            advocate — there is a place for you in the planetary health
            movement.
          </p>
        </div>

        {/* Right — Benefits */}
        <div>
          <div className="mb-4 flex items-center gap-3 text-scph-dark-green">
            <span className="h-px w-8 bg-current opacity-60 shrink-0" />
            <span className="text-xs font-semibold uppercase tracking-[0.15em]">
              What You Get
            </span>
          </div>
          <h2 className="font-heading text-3xl font-bold leading-tight text-scph-blue">
            Member Benefits
          </h2>
          <ul className="mt-6 space-y-4">
            {benefits.map((benefit) => (
              <li key={benefit} className="flex items-start gap-3">
                <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-scph-green/15">
                  <CheckCircle2 className="h-4 w-4 text-scph-dark-green" />
                </div>
                <p className="text-base leading-relaxed text-gray-600">
                  {benefit}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
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

export default function NetworkPage() {
  return (
    <>
      <NetworkHero />
      <CommunitySection />
      <SignUpSection />
    </>
  );
}
