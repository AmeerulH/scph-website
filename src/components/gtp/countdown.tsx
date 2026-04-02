"use client";

import * as React from "react";

// GTP 2026 opens 12 Oct 2026 00:00 MYT (UTC+8)
const EVENT_TARGET = new Date("2026-10-12T00:00:00+08:00").getTime();

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function calcTimeLeft(): TimeLeft {
  const diff = EVENT_TARGET - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

const UNITS = [
  { key: "days" as const,    label: "Days" },
  { key: "hours" as const,   label: "Hours" },
  { key: "minutes" as const, label: "Minutes" },
  { key: "seconds" as const, label: "Seconds" },
];

const ZERO_TIME: TimeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };

export function GtpCountdown() {
  // Stable SSR + first client paint — Date.now() differs between server and browser, so never use it in useState initialiser.
  const [time, setTime] = React.useState<TimeLeft>(ZERO_TIME);

  React.useEffect(() => {
    setTime(calcTimeLeft());
    const id = setInterval(() => setTime(calcTimeLeft()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative w-full border-y border-white/10 bg-white/8 py-5 text-center backdrop-blur-md">
      {/* Label */}
      <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.3em] text-white/40">
        — Conference Starts In —
      </p>

      {/* Boxes */}
      <div className="flex items-center justify-center gap-2.5 sm:gap-4">
        {UNITS.map(({ key, label }, i) => (
          <React.Fragment key={key}>
            {i > 0 && (
              <span className="mb-5 select-none text-xl font-bold text-gtp-teal/35 sm:text-2xl">
                :
              </span>
            )}
            <div className="flex flex-col items-center gap-1.5">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-black/30 ring-1 ring-white/10 sm:h-16 sm:w-16">
                <span className="font-heading text-2xl font-bold tabular-nums text-gtp-teal sm:text-3xl">
                  {pad(time[key])}
                </span>
              </div>
              <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/45 sm:text-[10px]">
                {label}
              </span>
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
