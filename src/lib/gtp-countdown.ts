/** GTP 2026 opens 12 Oct 2026 00:00 MYT (UTC+8) */
export const GTP_2026_EVENT_START_MS = new Date(
  "2026-10-12T00:00:00+08:00",
).getTime();

export type GtpCountdownTimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

export function calcGtpCountdownTimeLeft(atMs: number): GtpCountdownTimeLeft {
  const diff = GTP_2026_EVENT_START_MS - atMs;
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

/** Snapshot for SSR / RSC props on dynamic routes (`force-dynamic`). Not for static prerender. */
export function getGtpCountdownSnapshot(): GtpCountdownTimeLeft {
  return calcGtpCountdownTimeLeft(Date.now());
}
