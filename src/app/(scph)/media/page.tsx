import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { StaggerReveal } from "@/components/motion/StaggerReveal";
import { ScphPageHero } from "@/components/sections/heroes";

export const metadata: Metadata = {
  title: "Media",
  description:
    "News, stories, and media resources from Sunway Centre for Planetary Health—planetary health updates from Malaysia and beyond.",
  alternates: { canonical: "/media" },
  openGraph: {
    title: "Media | Sunway Centre for Planetary Health",
    description:
      "Latest updates and media from the Sunway Centre for Planetary Health.",
    url: "/media",
  },
};

// ─── Articles ─────────────────────────────────────────────────────────────────

const articles = [
  {
    title: "'We are at War with Nature' – and We Urgently Need to Make Peace",
    tag: "Biodiversity",
    excerpt:
      "Every single animal and plant we lose forever is another step towards the extinction of the human race.",
  },
  {
    title: "Pathways Linking Climate Change and HIV/AIDS",
    tag: "Climate & Health",
    excerpt:
      "The connection between climate change and HIV/AIDS is still yet to be recognized in research and practice.",
  },
  {
    title:
      "Beyond the Hippocratic Oath: A Planetary Health Pledge for the Malaysian Medical Community",
    tag: "Policy",
    excerpt:
      "Without adequate levels of care for the larger planet, both human health and human development are compromised.",
  },
  {
    title: "Safeguarding Human Health in the Anthropocene Epoch",
    tag: "Research",
    excerpt:
      "Far-reaching changes to Earth's natural systems represent a growing threat to human health.",
  },
  {
    title:
      "Tackling the Politics of Intersectoral Action for the Health of People and Planet",
    tag: "Governance",
    excerpt:
      "Unlocking the potential for intersectoral action requires thinking politically about its facilitators and barriers.",
  },
  {
    title: "Plastics Are A Planetary Health Crisis – Can You Do Anything About It?",
    tag: "Pollution",
    excerpt:
      "A UN Environment Assembly resolution calls for a plastics treaty to be negotiated.",
  },
  {
    title: "The Future Belongs to the Youth, It's Time We Listen to Them",
    tag: "Youth",
    excerpt:
      "Our country is poorly prepared for the larger planetary health crisis.",
  },
  {
    title:
      "Indonesia: Why Planetary Health Should Be on the Menu for the G20 Chair",
    tag: "Governance",
    excerpt:
      "Indonesia's G20 chairmanship should focus on strengthening global health architecture.",
  },
  {
    title: "Health of Our Planet Impacts Our Own Wellness",
    tag: "Policy",
    excerpt:
      "The need to urgently think about how the health of our planet impacts individual wellness.",
  },
  {
    title:
      "Malaysia is Drowning in Uneaten Food – 6 Steps to Help Stop Food Waste",
    tag: "Food Systems",
    excerpt:
      "Food waste is one of the issues that we have the most power to change by our individual behaviours.",
  },
  {
    title: "Tackling Air Pollution in the Philippines",
    tag: "Pollution",
    excerpt:
      "Three decades after the Clean Air Act, the Philippines is still far from comprehensive air pollution control.",
  },
  {
    title: "Financing the Future of WHO",
    tag: "Financing",
    excerpt:
      "WHO's resources have consistently lagged behind its constitutional mandate.",
  },
];

function ArticlesSection() {
  return (
    <SectionWrapper
      title="Latest Articles"
      subtitle="From Our Community"
      theme="scph"
      background="default"
    >
      {/* Mobile: horizontal swipe carousel / Desktop: 3-col grid */}
      <StaggerReveal
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory px-4 py-4 pb-2 [&::-webkit-scrollbar]:hidden md:grid md:grid-cols-2 md:overflow-visible md:px-0 md:py-0 md:pb-0 lg:grid-cols-3"
        variant="long"
      >
        {articles.map(({ title, tag, excerpt }) => (
          <div
            key={title}
            className="w-[85vw] max-w-[85vw] min-h-[320px] flex-shrink-0 snap-center group flex flex-col rounded-2xl bg-white p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg md:w-auto md:max-w-none"
          >
            <Badge variant="scph" className="mb-4 w-fit">
              {tag}
            </Badge>
            <h3 className="line-clamp-3 font-heading text-base font-bold leading-snug text-scph-blue">
              {title}
            </h3>
            <p className="mt-3 flex-1 line-clamp-3 text-sm leading-relaxed text-gray-500">
              {excerpt}
            </p>
            <a
              href="https://sunwayuniversity.edu.my/research/planetaryhealth/news"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-scph-blue transition-colors hover:text-scph-dark-green"
            >
              Read Article <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        ))}
      </StaggerReveal>

      <p className="mt-12 text-center text-sm text-gray-400">
        Articles are published on the Sunway University website.{" "}
        <a
          href="https://sunwayuniversity.edu.my/research/planetaryhealth/news"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-scph-blue hover:underline"
        >
          View all articles →
        </a>
      </p>
    </SectionWrapper>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function MediaPage() {
  return (
    <>
      <ScphPageHero
        eyebrow="Media"
        title={<>News &amp; Articles</>}
        lede="Perspectives from the planetary health community."
      />
      <ArticlesSection />
    </>
  );
}
