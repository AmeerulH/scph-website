import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SectionWrapper } from "@/components/shared/section-wrapper";

// ─── Hero Band ───────────────────────────────────────────────────────────────

function MediaHero() {
  return (
    <div className="bg-scph-blue px-4 pb-24 pt-40 text-center">
      <div className="mx-auto max-w-4xl">
        <span className="inline-block rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-white/80 backdrop-blur-sm">
          Media
        </span>
        <h1 className="mt-6 font-heading text-5xl font-bold leading-tight text-white md:text-6xl">
          News &amp; Articles
        </h1>
        <div className="mx-auto mt-6 h-1 w-20 rounded-full bg-scph-green" />
        <p className="mx-auto mt-6 max-w-2xl text-lg text-white/70">
          Perspectives from the planetary health community.
        </p>
      </div>
    </div>
  );
}

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
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {articles.map(({ title, tag, excerpt }) => (
          <div
            key={title}
            className="group flex flex-col rounded-2xl bg-white p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
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
      </div>

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
      <MediaHero />
      <ArticlesSection />
    </>
  );
}
