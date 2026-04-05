import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/shared/placeholder-page";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { GtpForestHero } from "@/components/sections/heroes";
import { getGtp2026FaqItems } from "@/sanity/gtp-stage1";

const description =
  "Frequently asked questions about Global Tipping Points Conference 2026 in Kuala Lumpur—travel, registration, and the programme.";

export const metadata: Metadata = {
  title: "FAQ",
  description,
  alternates: { canonical: "/events/gtp-2026/faq" },
  openGraph: {
    title: "FAQ | GTP 2026",
    description,
    url: "/events/gtp-2026/faq",
  },
  twitter: {
    card: "summary_large_image",
    title: "GTP 2026 FAQ",
    description,
  },
};

export const dynamic = "force-dynamic";

export default async function GtpFaqPage() {
  const items = await getGtp2026FaqItems().catch(() => []);
  const faqs = items.filter(
    (item) => item.question?.trim() && item.answer?.trim(),
  );

  if (faqs.length === 0) {
    return <PlaceholderPage title="FAQ" theme="gtp" />;
  }

  return (
    <>
      <GtpForestHero
        title="Frequently asked questions"
        lede="Practical information about Global Tipping Points Conference 2026 in Kuala Lumpur."
        bottomSpacing="spacious"
      />
      <SectionWrapper theme="gtp" background="default" className="pb-20">
        <div className="mx-auto max-w-3xl space-y-3">
          {faqs.map((item) => (
            <details
              key={item._id}
              className="group rounded-2xl border border-gtp-dark-teal/10 bg-white/90 p-1 shadow-sm ring-1 ring-gtp-dark-teal/5 open:shadow-md"
            >
              <summary className="relative cursor-pointer list-none rounded-xl px-4 py-4 font-heading text-lg font-semibold text-gtp-dark-teal outline-none marker:content-none [&::-webkit-details-marker]:hidden">
                <span className="flex w-full items-start justify-between gap-3 pr-6">
                  <span>{item.question.trim()}</span>
                  <span
                    aria-hidden
                    className="mt-1 shrink-0 text-gtp-teal transition-transform group-open:rotate-180"
                  >
                    ▼
                  </span>
                </span>
              </summary>
              <div className="border-t border-gtp-dark-teal/8 px-4 pb-4 pt-3 text-base leading-relaxed text-gray-600">
                <p className="whitespace-pre-wrap">{item.answer.trim()}</p>
              </div>
            </details>
          ))}
        </div>
      </SectionWrapper>
    </>
  );
}
