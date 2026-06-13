export type PillarId = "environmental" | "societal" | "human";

export type MobileViz = {
  vizId: string;
  /** For shared/path embeds */
  path?: string;
  /** For named embeds — "workbook/sheet" (Societal & Human use this) */
  name?: string;
  staticImage: string;
  rssImage: string;
};

export type Pillar = {
  id: PillarId;
  label: string;
  color: string;
  vizId: string;
  workbook: string;
  sheet: string;
  /** For shared/path desktop embeds (Societal uses this) */
  path?: string;
  /** Override static image for path-based desktop embeds */
  staticImage?: string;
  rssImage?: string;
  /** Original worksheet name for CSV download (dashboards don't support CSV export) */
  csvSheet: string;
  description: string;
  subIndices: string[];
  stats: { label: string; value: string }[];
  /** Dedicated mobile dashboard — served below 500px viewport width */
  mobileViz: MobileViz;
};

export const PILLARS: Pillar[] = [
  {
    id: "environmental",
    label: "Environmental Health",
    color: "#59A14F",
    vizId: "viz1781335208197",
    workbook: "PlanetaryHealthIndexWorldMap_17810135781890",
    sheet: "EnvironmentalHealthDashboard",
    csvSheet: "EnvironmentalHealth",
    description:
      "Environmental Health measures the overall well-being of Earth's natural systems — including ecosystem quality, biodiversity, soil, air, and water. Scores range from 0 (lowest) to 1 (highest).",
    subIndices: ["Environmental Health", "Natural Hazards", "Biodiversity"],
    stats: [
      { label: "Countries scored", value: "216" },
      { label: "Global average", value: "0.53" },
      { label: "Highest score", value: "0.85" },
      { label: "Lowest score", value: "0.13" },
    ],
    mobileViz: {
      vizId: "viz1781335278548",
      name: "PlanetaryHealthIndexWorldMap_17810135781890/EnvironmentalHealthDashboard2",
      staticImage:
        "https://public.tableau.com/static/images/Pl/PlanetaryHealthIndexWorldMap_17810135781890/EnvironmentalHealthDashboard2/1.png",
      rssImage:
        "https://public.tableau.com/static/images/Pl/PlanetaryHealthIndexWorldMap_17810135781890/EnvironmentalHealthDashboard2/1_rss.png",
    },
  },
  {
    id: "societal",
    label: "Societal Health",
    color: "#007BFF",
    vizId: "viz1781336238219",
    workbook: "PlanetaryHealthIndexWorldMap_17810135781890",
    sheet: "SocietalHealthDashboard",
    csvSheet: "SocietalHealth",
    description:
      "Societal Health captures structural and institutional conditions that shape human resilience — including governance quality, economic prosperity, conflict exposure, and disaster preparedness. Scores range from 0 (lowest) to 1 (highest).",
    subIndices: [
      "Societal Health",
      "Recent Disaster Impacts",
      "Conflict Impacts",
      "Economic Prosperity",
      "Governance",
    ],
    stats: [
      { label: "Countries scored", value: "216" },
      { label: "Global average", value: "0.49" },
      { label: "Highest score", value: "0.88" },
      { label: "Lowest score", value: "0.08" },
    ],
    mobileViz: {
      vizId: "viz1781335425310",
      name: "PlanetaryHealthIndexWorldMap_17810135781890/SocietalHealthDashboard2",
      staticImage:
        "https://public.tableau.com/static/images/Pl/PlanetaryHealthIndexWorldMap_17810135781890/SocietalHealthDashboard2/1.png",
      rssImage:
        "https://public.tableau.com/static/images/Pl/PlanetaryHealthIndexWorldMap_17810135781890/SocietalHealthDashboard2/1_rss.png",
    },
  },
  {
    id: "human",
    label: "Human Health",
    color: "#92720A",
    vizId: "viz1781335559078",
    workbook: "PlanetaryHealthIndexWorldMap_17810135781890",
    sheet: "HumanHealthDashboard",
    csvSheet: "HumanHealth",
    description:
      "Human Health reflects population health outcomes and healthcare system capacity — covering infectious disease burden, women and children's health, and access to care. Scores range from 0 (lowest) to 1 (highest).",
    subIndices: [
      "Human Health",
      "Health Care Capacity",
      "Infectious Disease",
      "Women & Children's Health",
    ],
    stats: [
      { label: "Countries scored", value: "216" },
      { label: "Global average", value: "0.57" },
      { label: "Highest score", value: "0.91" },
      { label: "Lowest score", value: "0.11" },
    ],
    mobileViz: {
      vizId: "viz1781335571147",
      name: "PlanetaryHealthIndexWorldMap_17810135781890/HumanHealthDashboard2",
      staticImage:
        "https://public.tableau.com/static/images/Pl/PlanetaryHealthIndexWorldMap_17810135781890/HumanHealthDashboard2/1.png",
      rssImage:
        "https://public.tableau.com/static/images/Pl/PlanetaryHealthIndexWorldMap_17810135781890/HumanHealthDashboard2/1_rss.png",
    },
  },
];
