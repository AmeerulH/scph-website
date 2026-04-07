/**
 * Session objectives for the GTP 2026 programme (main timetable rows).
 * Keys must match **exact** `title` strings in `src/components/gtp/programmes/data.tsx`.
 * Replace any entry with verbatim text from the official agenda working file when available.
 * Re-import programme (`npm run import-gtp-programme`) after edits to push to Sanity.
 */

/** Exact `title` in programme data — Opening Plenary row, Day 1. */
export const GTP_AGENDA_TITLE_OPENING_PLENARY_SCIENCE =
  "Opening Plenary: The Science of Global Tipping Points";

/**
 * Full objective from the agenda (table column). Last sentence completed where the
 * source screenshot was truncated, aligned with Global Tipping Points Report 2025 messaging.
 */
export const objectiveOpeningPlenaryTheScienceOfGlobalTippingPoints =
  "This plenary introduces the scientific foundations of planetary stability and systemic change through the Planetary Boundaries framework, developed by Prof. Johan Rockström and a global team of scientists. It defines the Earth’s safe operating space across critical processes such as climate, biodiversity, freshwater, and nutrient cycles, showing how crossing these limits undermines the resilience of the Earth system and threatens human wellbeing.\n\n" +
  "The session then explores the science of tipping points — moments when small increases in pressure can trigger rapid, often irreversible shifts in entire ecosystems. Drawing on the Global Tipping Points Report 2025, it highlights the risks of crossing points of no return in major systems such as ice sheets, rainforests, and coral reefs, with cascading impacts on food security, displacement, health, and economic stability.\n\n" +
  "Crucially, the plenary also examines positive tipping points, where targeted policies, innovation, and social momentum can rapidly shift systems toward sustainability and resilience. Together, these frameworks provide powerful tools for avoiding catastrophic climate and environmental collapse and for scaling positive tipping responses.";

/**
 * Map of exact session title → objective (shown on programme + modal).
 * Shared titles (e.g. “Action Workshops” on multiple days) use one entry for all instances.
 */
export const gtpAgendaSessionObjectivesByTitle: Record<string, string> = {
  [GTP_AGENDA_TITLE_OPENING_PLENARY_SCIENCE]:
    objectiveOpeningPlenaryTheScienceOfGlobalTippingPoints,

  "Opening of Global Tipping Points Conference 2026":
    "Welcome participants, set expectations, and open the conference framing for science, policy, and collective action on tipping points.",

  "Lightning Talk: Frontline Realities of Tipping Points in Malaysia":
    "Ground global themes in Malaysian frontline experience—environment, communities, and implementation realities.",

  "Plenary 2: Global Context and ASEAN Pathways":
    "Connect global tipping-points dynamics to regional context and plausible pathways for ASEAN countries and partners.",

  "Action Workshops":
    "Parallel action-oriented workshops; participants choose one track per slot to go deeper on practice, skills, and collaboration.",

  "Research Sessions":
    "Parallel research tracks for presenting and discussing emerging evidence; participants choose sessions aligned to their focus.",

  "Fireside Chat: [Insert Topic]":
    "TBC — fireside topic and participants to be confirmed closer to the event.",

  Reconvening:
    "Bring participants together to synthesise insights from parallel sessions and connect themes across the conference programme.",

  "Film Premiere: How to Live on Earth by Open Planet Studios":
    "Premiere screening and discussion of How to Live on Earth, produced by Open Planet Studios.",

  "Lightning Talk: Who Really Pays for Environmental Damage?":
    "Highlight equity and accountability—who bears costs and who benefits when environmental harm and transitions collide.",

  "Plenary 3: Flipping the Script":
    "Explore narratives, culture, and imagination as levers to flip entrenched stories and unlock faster positive change.",

  "Plenary 4: Values and Cultural Tipping Points":
    "Examine how values, norms, and cultural movements can tip—or block—societal shifts on climate and nature.",

  "Fireside Chat: Leadership That Tips Energy Systems":
    "Discuss leadership patterns and decisions that can help tip energy systems toward clean, equitable outcomes.",

  "Poster Exhibit":
    "Showcase poster presentations and informal exchange between researchers, practitioners, and participants.",

  "Street Food Dinner":
    "Informal networking dinner—build connections across sectors in a relaxed setting.",

  "Plenary 5: Finance for Positive Tipping Points":
    "Map how finance—public, private, and blended—can scale interventions that trigger positive tipping dynamics.",

  "Plenary 6: From Courtrooms to System Change":
    "Explore legal and governance pathways from individual cases to broader system-level shifts.",

  "Plenary 7: Change is Possible – Cities as Tipping Points":
    "Highlight urban innovation and coalition-building where cities act as crucibles for rapid, positive transitions.",

  "Fireside Chat: Peace Dividends and Health Security":
    "Explore links between peace, stability, and health security as enablers—or risks—for environmental action.",

  "Plenary 8: Bringing It All Together and Road to COP31":
    "Synthesise conference threads and outline implications for diplomacy, implementation, and COP31 momentum.",

  "Next Steps and Closing — Launch of the Kuala Lumpur Tipping Points Declaration":
    "Agree concrete next steps and launch the Kuala Lumpur Tipping Points Declaration as a shared outcome.",

  "End of Conference":
    "Formal close of the Global Tipping Points Conference 2026 programme.",
};

/** When a title is missing from the map (e.g. new session added in `data.tsx` only). */
const OBJ_SESSION_PENDING =
  "TBC — add this session’s title and objective to src/data/gtp-2026-agenda-objectives.ts (or edit in Sanity after import).";

export function agendaObjectiveForSessionTitle(title: string): string {
  return gtpAgendaSessionObjectivesByTitle[title] ?? OBJ_SESSION_PENDING;
}
