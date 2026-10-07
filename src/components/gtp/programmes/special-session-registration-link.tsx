"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { buildSpecialSessionRegistrationLink } from "@/lib/gtp-programme-session-link";
import type { GtpProgrammeCalendarDayTab } from "@/lib/gtp-programme-google-calendar";
import type { Session } from "./types";

export function SpecialSessionRegistrationLink({ session, calendarTabId }: {
  session: Session;
  calendarTabId: GtpProgrammeCalendarDayTab;
}) {
  const link = buildSpecialSessionRegistrationLink(session, calendarTabId);
  if (!link) return null;
  return (
    <div className="mt-6">
      <Button variant="gtpCta" className="h-auto whitespace-normal px-5 py-3 text-center" asChild>
        <Link href={link.href} onClick={(event) => event.stopPropagation()}>
          {link.label}
        </Link>
      </Button>
    </div>
  );
}
