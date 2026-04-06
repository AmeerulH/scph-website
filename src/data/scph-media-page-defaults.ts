/** Repo defaults for `/media` when Sanity is empty or fields are missing. */

export const SCPH_MEDIA_PAGE_DEFAULTS = {
  heroEyebrow: "Media",
  heroTitle: "News & Articles",
  heroLede: "Perspectives from the planetary health community.",
  articlesSectionTitle: "Latest Articles",
  articlesSectionSubtitle: "From Our Community",
  viewAllArticlesUrl: "https://sunwayuniversity.edu.my/research/planetaryhealth/news",
  viewAllArticlesLabel: "View all articles →",
  readArticleLabel: "Read Article",
  articlesIntroNote:
    "Articles are published on the Sunway University website.",
} as const;

export type ScphMediaArticleDefault = {
  title: string;
  tag: string;
  body: string;
  /** Empty = use page `viewAllArticlesUrl` after merge. */
  href?: string;
};

export const SCPH_MEDIA_ARTICLES_DEFAULT: ScphMediaArticleDefault[] = [
  {
    title:
      "'We are at War with Nature' – and We Urgently Need to Make Peace",
    tag: "Biodiversity",
    body:
      "Every single animal and plant we lose forever is another step towards the extinction of the human race.",
  },
  {
    title: "Pathways Linking Climate Change and HIV/AIDS",
    tag: "Climate & Health",
    body:
      "The connection between climate change and HIV/AIDS is still yet to be recognized in research and practice.",
  },
  {
    title:
      "Beyond the Hippocratic Oath: A Planetary Health Pledge for the Malaysian Medical Community",
    tag: "Policy",
    body:
      "Without adequate levels of care for the larger planet, both human health and human development are compromised.",
  },
  {
    title: "Safeguarding Human Health in the Anthropocene Epoch",
    tag: "Research",
    body:
      "Far-reaching changes to Earth's natural systems represent a growing threat to human health.",
  },
  {
    title:
      "Tackling the Politics of Intersectoral Action for the Health of People and Planet",
    tag: "Governance",
    body:
      "Unlocking the potential for intersectoral action requires thinking politically about its facilitators and barriers.",
  },
  {
    title:
      "Plastics Are A Planetary Health Crisis – Can You Do Anything About It?",
    tag: "Pollution",
    body:
      "A UN Environment Assembly resolution calls for a plastics treaty to be negotiated.",
  },
  {
    title: "The Future Belongs to the Youth, It's Time We Listen to Them",
    tag: "Youth",
    body:
      "Our country is poorly prepared for the larger planetary health crisis.",
  },
  {
    title:
      "Indonesia: Why Planetary Health Should Be on the Menu for the G20 Chair",
    tag: "Governance",
    body:
      "Indonesia's G20 chairmanship should focus on strengthening global health architecture.",
  },
  {
    title: "Health of Our Planet Impacts Our Own Wellness",
    tag: "Policy",
    body:
      "The need to urgently think about how the health of our planet impacts individual wellness.",
  },
  {
    title:
      "Malaysia is Drowning in Uneaten Food – 6 Steps to Help Stop Food Waste",
    tag: "Food Systems",
    body:
      "Food waste is one of the issues that we have the most power to change by our individual behaviours.",
  },
  {
    title: "Tackling Air Pollution in the Philippines",
    tag: "Pollution",
    body:
      "Three decades after the Clean Air Act, the Philippines is still far from comprehensive air pollution control.",
  },
  {
    title: "Financing the Future of WHO",
    tag: "Financing",
    body:
      "WHO's resources have consistently lagged behind its constitutional mandate.",
  },
];
