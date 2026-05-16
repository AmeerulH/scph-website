export type PillarId = "environmental" | "societal" | "human";

export type MobileViz = {
  vizId: string;
  /** For shared/path embeds (Environmental uses this) */
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
    vizId: "viz1778679237191",
    workbook: "PlanetaryHealthIndexWorldMap",
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
      vizId: "viz1778943622373",
      path: "shared/NJCDXH998",
      staticImage: "https://public.tableau.com/static/images/NJ/NJCDXH998/1.png",
      rssImage: "https://public.tableau.com/static/images/NJ/NJCDXH998/1_rss.png",
    },
  },
  {
    id: "societal",
    label: "Societal Health",
    color: "#007BFF",
    vizId: "viz1778679135686",
    workbook: "PlanetaryHealthIndexWorldMap",
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
      vizId: "viz1778943788642",
      name: "PlanetaryHealthIndexWorldMap/SocietalHealthDashboard2",
      staticImage:
        "https://public.tableau.com/static/images/Pl/PlanetaryHealthIndexWorldMap/SocietalHealthDashboard2/1.png",
      rssImage:
        "https://public.tableau.com/static/images/Pl/PlanetaryHealthIndexWorldMap/SocietalHealthDashboard2/1_rss.png",
    },
  },
  {
    id: "human",
    label: "Human Health",
    color: "#92720A",
    vizId: "viz1778679210007",
    workbook: "PlanetaryHealthIndexWorldMap",
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
      vizId: "viz1778943799208",
      name: "PlanetaryHealthIndexWorldMap/HumanHealthDashboard2",
      staticImage:
        "https://public.tableau.com/static/images/Pl/PlanetaryHealthIndexWorldMap/HumanHealthDashboard2/1.png",
      rssImage:
        "https://public.tableau.com/static/images/Pl/PlanetaryHealthIndexWorldMap/HumanHealthDashboard2/1_rss.png",
    },
  },
];
