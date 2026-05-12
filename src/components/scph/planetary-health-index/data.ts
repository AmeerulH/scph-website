export type PillarId = "environmental" | "societal" | "human";

export type Pillar = {
  id: PillarId;
  label: string;
  color: string;
  vizId: string;
  workbook: string;
  sheet: string;
  description: string;
  subIndices: string[];
  stats: { label: string; value: string }[];
};

export const PILLARS: Pillar[] = [
  {
    id: "environmental",
    label: "Environmental Health",
    color: "#59A14F",
    vizId: "viz1778594301422",
    workbook: "PlanetaryHealthIndexWorldMap",
    sheet: "EnvironmentalHealth",
    description:
      "Environmental Health measures the overall well-being of Earth's natural systems — including ecosystem quality, biodiversity, soil, air, and water. Scores range from 0 (lowest) to 1 (highest).",
    subIndices: ["Environmental Health", "Natural Hazards", "Biodiversity"],
    stats: [
      { label: "Countries scored", value: "216" },
      { label: "Global average", value: "0.53" },
      { label: "Highest score", value: "0.85" },
      { label: "Lowest score", value: "0.13" },
    ],
  },
  {
    id: "societal",
    label: "Societal Health",
    color: "#007BFF",
    vizId: "viz1778594352204",
    workbook: "PlanetaryHealthIndexWorldMap",
    sheet: "SocietalHealth",
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
  },
  {
    id: "human",
    label: "Human Health",
    color: "#E6CA3E",
    vizId: "viz1778594369201",
    workbook: "PlanetaryHealthIndexWorldMap",
    sheet: "HumanHealth",
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
  },
];
