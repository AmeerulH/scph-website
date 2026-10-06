import type { GtpActionWorkshopPartnerDay } from "@/data/gtp-programme-activity-defaults";

export function programmeDateKey(value: string): string {
  const normalized = value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
  const dayFirst = normalized.match(/(\d{1,2})\s+([a-z]{3,})/);
  if (dayFirst) return `${Number(dayFirst[1])}-${dayFirst[2].slice(0, 3)}`;
  const monthFirst = normalized.match(/([a-z]{3,})\s+(\d{1,2})/);
  return monthFirst ? `${Number(monthFirst[2])}-${monthFirst[1].slice(0, 3)}` : normalized;
}

export function matchActionWorkshopPartnerDay(dateLabel: string, days: readonly GtpActionWorkshopPartnerDay[]) {
  return days.find((day) => programmeDateKey(day.dateLabel) === programmeDateKey(dateLabel));
}
