import type { GtpActionWorkshopPartnerDay } from "@/data/gtp-programme-activity-defaults";
import type { ActionWorkshopListingItem } from "./action-workshop-listing";
import type { ResearchSessionBlock } from "./research-session-listing";
import { programmeDateKey } from "./programme-day-matching";

export type CombinedProgrammeDay = {
  id: string;
  dateLabel: string;
  weekday?: string;
  workshops: ActionWorkshopListingItem[];
  research: ResearchSessionBlock[];
  partnerDays: GtpActionWorkshopPartnerDay[];
  workshopTimes: string[];
};

export function buildCombinedProgrammeDays(input: {
  workshops: ActionWorkshopListingItem[];
  research: ResearchSessionBlock[];
  partnerDays: GtpActionWorkshopPartnerDay[];
}): CombinedProgrammeDay[] {
  const days: CombinedProgrammeDay[] = [
    {id: "day-13", dateLabel: "13 October 2026", weekday: "Tuesday", workshops: [], research: [], partnerDays: [], workshopTimes: []},
    {id: "day-14", dateLabel: "14 October 2026", weekday: "Wednesday", workshops: [], research: [], partnerDays: [], workshopTimes: []},
  ];
  function forDate(dateLabel: string) {
    let day = days.find((candidate) => programmeDateKey(candidate.dateLabel) === programmeDateKey(dateLabel));
    if (!day) {
      day = {id: `day-extra-${days.length}`, dateLabel, workshops: [], research: [], partnerDays: [], workshopTimes: []};
      days.push(day);
    }
    return day;
  }
  for (const workshop of input.workshops) {
    const day = forDate(workshop.dateLabel || "Date to be confirmed");
    day.workshops.push(workshop);
    if (workshop.parent.time && !/confirm|tbc/i.test(workshop.parent.time) && !day.workshopTimes.includes(workshop.parent.time)) {
      day.workshopTimes.push(workshop.parent.time);
    }
  }
  for (const block of input.research) days[block.dayId === "day2" ? 0 : 1].research.push(block);
  for (const partnerDay of input.partnerDays) forDate(partnerDay.dateLabel).partnerDays.push(partnerDay);
  return days;
}
